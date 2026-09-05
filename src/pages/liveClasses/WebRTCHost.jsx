import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { webrtcService } from '../../services/webrtcService';
import { Mic, MicOff, Video, VideoOff, MonitorUp, SquareSquare, PhoneOff, MessageSquare, Hand, Users, Circle, Square, Maximize, Minimize } from 'lucide-react';
import axios from 'axios';
import darkLogo from '../../assets/logos/dark_logo_transparent.png';

import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  RoomAudioRenderer,
  useLocalParticipant,
  useParticipants
} from '@livekit/components-react';
import { Track } from 'livekit-client';

const playSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();

  if (type === 'join') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else if (type === 'message') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'hand') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
};

export default function WebRTCHost() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user || JSON.parse(localStorage.getItem('adminUser')) || JSON.parse(localStorage.getItem('facultyUser')) || { name: 'Admin Host', role: 'admin' };
  const liveClassInfo = location.state?.liveClass;
  const courseName = liveClassInfo?.title || liveClassInfo?.courseName || liveClassInfo?.course?.title || 'LiveClass';
  
  const isTeacher = true; 

  const [hasJoined, setHasJoined] = useState(false);
  const [token, setToken] = useState('');
  
  // Lobby Media State (pre-join)
  const [lobbyStream, setLobbyStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const myVideoRef = useRef();

  useEffect(() => {
    const initMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640, max: 640 }, height: { ideal: 480, max: 480 }, frameRate: { ideal: 15, max: 15 } },
          audio: true
        });
        setLobbyStream(userStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = userStream;
      } catch (err) {
        setMediaError(`Media error: ${err.message || err.name}`);
      }
    };
    initMedia();
    return () => {
      webrtcService.disconnect();
      if (lobbyStream) lobbyStream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const toggleLobbyMute = () => {
    if (lobbyStream) {
      const audioTrack = lobbyStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleLobbyVideo = () => {
    if (lobbyStream) {
      const videoTrack = lobbyStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleJoin = async () => {
    if (!lobbyStream && !mediaError) return;
    try {
      const backendUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/live-classes/token/livekit`, {
        roomId,
        participantName: user.name,
        role: user.role
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setToken(response.data.token);
      setHasJoined(true);
      
      // Stop lobby stream so LiveKit can take over hardware
      if (lobbyStream) lobbyStream.getTracks().forEach(t => t.stop());

      // Connect Socket.IO for chat/handraise
      webrtcService.connect(roomId, user._id, user.role, user.name);

    } catch(err) {
      console.error('Failed to get token', err);
      alert('Failed to connect to media server.');
    }
  };

  if (!hasJoined || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Ready to join?</h1>
          <div className="w-full max-w-md bg-black rounded-xl overflow-hidden aspect-video relative mb-6 border border-slate-700">
            {lobbyStream ? (
              <video 
                ref={el => {
                  myVideoRef.current = el;
                  if (el && lobbyStream && el.srcObject !== lobbyStream) el.srcObject = lobbyStream;
                }} 
                autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" 
              />
            ) : mediaError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-red-400 bg-red-950/30">
                <VideoOff size={48} className="mb-4 opacity-50" />
                <p>{mediaError}</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-slate-400 animate-pulse">Requesting permissions...</span>
              </div>
            )}
            
            {lobbyStream && (
               <div className="absolute bottom-4 flex w-full justify-center gap-4">
                  <button onClick={toggleLobbyMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button onClick={toggleLobbyVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  </button>
               </div>
            )}
          </div>
          <button 
            onClick={handleJoin}
            disabled={!lobbyStream && !mediaError}
            className={`px-8 py-3 rounded-full font-bold text-lg transition ${
              !lobbyStream && !mediaError ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {mediaError ? 'Join Without Media' : 'Join Class'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={!isVideoOff}
      audio={!isMuted}
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      connect={true}
      options={{ adaptiveStream: true, dynacast: true }}
      className="flex flex-col h-screen bg-slate-900 text-white relative"
    >
      <ActiveHostClassroom user={user} roomId={roomId} isTeacher={isTeacher} courseName={courseName} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function ActiveHostClassroom({ user, roomId, isTeacher, courseName }) {
  const navigate = useNavigate();
  
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [waitingParticipants, setWaitingParticipants] = useState([]);
  
  const mainVideoWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  
  const activeTabRef = useRef(activeTab);
  const chatOpenRef = useRef(chatOpen);
  
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { chatOpenRef.current = chatOpen; }, [chatOpen]);
  
  useEffect(() => {
    if (chatOpen && activeTab === 'chat') {
      setUnreadChatCount(0);
    }
  }, [chatOpen, activeTab]);

  useEffect(() => {
    webrtcService.onChat = (data) => {
      setMessages(prev => [...prev, data]);
      if (data.senderId !== user._id) {
        playSound('message');
        if (activeTabRef.current !== 'chat' || !chatOpenRef.current) {
          setUnreadChatCount(prev => prev + 1);
        }
      }
    };

    webrtcService.onHandRaise = (data) => {
      playSound('hand');
      setToastMessage({ name: data.name, show: true });
      setTimeout(() => setToastMessage(null), 4000);
    };

    webrtcService.onStudentWaiting = (data) => {
      setWaitingParticipants(prev => {
        if (prev.find(p => p.socketId === data.socketId)) return prev;
        playSound('join');
        return [...prev, data];
      });
    };
  }, [user._id]);

  const admitParticipant = (id) => {
    webrtcService.admitStudent(id);
    setWaitingParticipants(prev => prev.filter(w => w.socketId !== id));
  };

  const admitAll = () => {
    webrtcService.admitAll();
    setWaitingParticipants([]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mainVideoWrapperRef.current?.requestFullscreen) {
        mainVideoWrapperRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleMute = () => {
    localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
  };

  const toggleVideo = () => {
    localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  };

  const toggleScreenShare = () => {
    localParticipant.setScreenShareEnabled(!localParticipant.isScreenShareEnabled);
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        // Check local storage space before starting
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          const availableMB = (estimate.quota - estimate.usage) / (1024 * 1024);
          
          if (availableMB < 1024) { // Less than 1 GB
            const proceed = window.confirm(`WARNING: Your browser indicates you have low storage space (${Math.round(availableMB)} MB available). Long recordings might fail to save. Do you still want to proceed?`);
            if (!proceed) return;
          }
        }

        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        recordedChunks.current = [];
        mediaRecorderRef.current = new MediaRecorder(screenStream, { mimeType: 'video/webm' });
        
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Format filename: CourseName_Recording-1.webm
          const safeCourseName = courseName.replace(/[^a-zA-Z0-9]/g, '_');
          const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
          a.download = `${safeCourseName}_Recording_${timestamp}.webm`;
          
          a.click();
          window.URL.revokeObjectURL(url);
          screenStream.getTracks().forEach(t => t.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Recording failed", err);
      }
    } else {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const leaveRoom = () => {
    webrtcService.endClass();
    window.close();
    setTimeout(() => navigate(-1), 300);
  };

  const handleForceMute = async (identity) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/live-classes/mute-participant`, { roomId, identity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error("Failed to mute participant", err);
    }
  };

  const handleKickParticipant = async (identity) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/live-classes/kick-participant`, { roomId, identity }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error("Failed to kick participant", err);
    }
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    webrtcService.sendChat(chatInput);
    setChatInput('');
  };

  // Find local screen share or camera
  const localScreenTrack = tracks.find(t => t.participant.isLocal && t.source === Track.Source.ScreenShare);
  const localCameraTrack = tracks.find(t => t.participant.isLocal && t.source === Track.Source.Camera);
  const mainTrack = localScreenTrack || localCameraTrack;

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && toastMessage.show && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <Hand size={24} />
          <span className="font-bold text-lg">{toastMessage.name || 'A student'} raised their hand!</span>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
             <img src={darkLogo} alt="Logo" className="h-8 object-contain" />
             <h1 className="font-bold text-lg">Live Classroom {isRecording && <span className="text-red-500 ml-2 animate-pulse">● Recording</span>}</h1>
          </div>
          <div className="h-6 w-px bg-slate-600 mx-2"></div>
          <div className="flex items-center gap-3">
             <img src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.name + "&background=random"} alt="Host" className="w-9 h-9 rounded-full border border-slate-500" />
             <div className="flex flex-col">
               <span className="font-medium text-sm leading-tight">{user.name}</span>
               <span className="text-xs text-slate-400">Host</span>
             </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm bg-slate-700 px-3 py-1 rounded-full">{participants.length} Participants</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-4 relative">
          
          {/* Main Video View (Teacher) */}
          <div ref={mainVideoWrapperRef} className="flex-1 bg-black rounded-xl overflow-hidden relative border border-slate-700 flex items-center justify-center">
             {localParticipant.isScreenShareEnabled && (
               <div className="text-green-500 flex flex-col items-center animate-pulse z-10 bg-black/80 w-full h-full justify-center absolute inset-0">
                  <MonitorUp size={64} className="mb-4" />
                  <p className="font-bold text-lg">You are sharing your screen</p>
               </div>
             )}
             
             {mainTrack && (
                <VideoTrack 
                  trackRef={mainTrack} 
                  className={`w-full h-full object-contain ${mainTrack.source === Track.Source.Camera ? '-scale-x-100' : ''} ${localParticipant.isScreenShareEnabled ? 'opacity-0' : 'opacity-100'}`} 
                />
             )}
             {!mainTrack && (
                <div className="flex flex-col items-center text-slate-500">
                  <VideoOff size={48} className="mb-4" />
                  <p>Camera is off</p>
                </div>
             )}

             <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-sm">
               You (Broadcasting)
             </div>
             <button 
               onClick={toggleFullscreen} 
               className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-md transition text-slate-300 hover:text-white"
             >
               {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
             </button>
          </div>

          {/* Picture in Picture / Grid of other students */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 h-36">
             {tracks.filter(t => !t.participant.isLocal && t.source === Track.Source.Camera).map((track) => (
                <div key={track.participant.identity} className="w-48 flex flex-col bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-lg">
                  <div className="flex-1 bg-black relative">
                    <VideoTrack trackRef={track} className="w-full h-full absolute inset-0 object-cover" />
                  </div>
                  <div className="px-2 py-1.5 text-center text-xs text-slate-300 font-medium truncate bg-slate-800 border-t border-slate-700">
                    {track.participant.name || track.participant.identity}
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Sidebar (Chat / Participants) */}
        {chatOpen && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="flex border-b border-slate-700">
              <button 
                onClick={() => setActiveTab('chat')} 
                className={`flex-1 p-3 font-bold text-center transition-all duration-300 text-sm flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-slate-700 border-b-2 border-primary text-white' : 'text-slate-400 hover:bg-slate-750'}`}
              >
                Chat
                {unreadChatCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                    {unreadChatCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('participants')} 
                className={`flex-1 p-3 font-bold text-center transition-all duration-300 text-sm flex items-center justify-center gap-2 ${activeTab === 'participants' ? 'bg-slate-700 border-b-2 border-primary text-white' : 'text-slate-400 hover:bg-slate-750'}`}
              >
                Participants
                {waitingParticipants.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                    {waitingParticipants.length}
                  </span>
                )}
              </button>
            </div>
            
            {activeTab === 'chat' ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.senderId === 'system' ? 'text-center text-accent text-xs' : 'text-left'}`}>
                      {m.senderId !== 'system' && <span className="text-xs text-slate-400 mb-1">{m.name}</span>}
                      <div className={`${m.senderId === 'system' ? 'bg-transparent' : (m.senderId === webrtcService.socket?.id ? 'bg-primary self-end' : 'bg-slate-700 self-start')} px-3 py-2 rounded-lg text-sm inline-block max-w-[85%]`}>
                        {m.message}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendChat} className="p-4 border-t border-slate-700 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                  />
                  <button type="submit" className="bg-primary hover:bg-primary-hover px-3 py-2 rounded transition">Send</button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 flex gap-2 border-b border-slate-700 flex-wrap">
                  <button onClick={() => setActiveFilter('all')} className={`px-3 py-1 text-xs rounded-full font-medium ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} transition`}>All</button>
                  <button onClick={() => setActiveFilter('muted')} className={`px-3 py-1 text-xs rounded-full font-medium ${activeFilter === 'muted' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} transition`}>Muted</button>
                  <button onClick={() => setActiveFilter('camera-off')} className={`px-3 py-1 text-xs rounded-full font-medium ${activeFilter === 'camera-off' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'} transition`}>Cam Off</button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {waitingParticipants.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3 px-1 border-b border-slate-700 pb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Waiting Room ({waitingParticipants.length})</h3>
                        <button onClick={admitAll} className="text-xs bg-primary hover:bg-primary-hover text-white px-2 py-1 rounded transition">Admit All</button>
                      </div>
                      <div className="space-y-2">
                        {waitingParticipants.map(wp => (
                          <div key={wp.socketId} className="flex items-center justify-between bg-slate-750 p-2.5 rounded-lg border border-slate-700 shadow-sm opacity-80 hover:opacity-100 transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-7 h-7 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                {wp.name ? wp.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <span className="text-sm truncate font-medium">{wp.name || 'Unknown'}</span>
                            </div>
                            <button onClick={() => admitParticipant(wp.socketId)} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition">
                              Admit
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="px-1 mb-2 mt-4 border-b border-slate-700 pb-2">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Class ({participants.length})</h3>
                  </div>

                  {participants.filter(p => {
                    if (activeFilter === 'muted') return !p.isMicrophoneEnabled;
                    if (activeFilter === 'camera-off') return !p.isCameraEnabled;
                    return true;
                  }).map(p => (
                    <div key={p.identity} className="flex items-center justify-between bg-slate-750 p-3 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-sm truncate font-medium">{p.name || p.identity}</span>
                      </div>
                      
                      {!p.isLocal && (
                        <div className="flex gap-2">
                          {!p.isMicrophoneEnabled ? (
                            <span className="p-1.5 text-red-400" title="Muted"><MicOff size={14} /></span>
                          ) : (
                            <button onClick={() => handleForceMute(p.identity)} className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Force Mute">
                              <MicOff size={14} />
                            </button>
                          )}
                          <button onClick={() => handleKickParticipant(p.identity)} className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Remove Participant">
                            <PhoneOff size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {participants.length <= 1 && (
                    <div className="text-center text-slate-400 text-sm mt-10">
                      No students have joined yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <footer className="bg-slate-800 p-4 flex justify-between items-center">
        <div className="flex gap-2"></div>
        <div className="flex gap-4">
          <button onClick={toggleMute} className={`p-3 rounded-full ${!localParticipant.isMicrophoneEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
            {!localParticipant.isMicrophoneEnabled ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button onClick={toggleVideo} className={`p-3 rounded-full ${!localParticipant.isCameraEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
            {!localParticipant.isCameraEnabled ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button onClick={toggleScreenShare} className={`p-3 rounded-full ${localParticipant.isScreenShareEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} transition`} title="Share Screen">
            <MonitorUp size={20} />
          </button>

          <button onClick={toggleRecording} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600 hover:bg-slate-500'} transition`} title={isRecording ? 'Stop Recording' : 'Start Recording'}>
            {isRecording ? <Square size={20} fill="white" /> : <Circle size={20} fill="white" />}
          </button>
          
          <button onClick={leaveRoom} className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition px-6 font-bold flex items-center gap-2">
            <PhoneOff size={20} /> End Class
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-full ${chatOpen ? 'bg-primary text-white' : 'bg-slate-600 hover:bg-slate-500'} transition relative`} title="Chat">
            <MessageSquare size={20} />
            {unreadChatCount > 0 && !chatOpen && (
               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {unreadChatCount}
               </span>
            )}
          </button>
        </div>
      </footer>
    </>
  );
}
