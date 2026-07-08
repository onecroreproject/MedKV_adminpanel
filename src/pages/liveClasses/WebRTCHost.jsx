import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { webrtcService } from '../../services/webrtcService';
import { Mic, MicOff, Video, VideoOff, MonitorUp, SquareSquare, PhoneOff, MessageSquare, Hand, Users, Circle, Square, Maximize, Minimize } from 'lucide-react';
import axios from 'axios';
import darkLogo from '../../assets/logos/dark_logo_transparent.png';

export default function WebRTCHost() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Admin panel user
  const user = location.state?.user || JSON.parse(localStorage.getItem('adminUser')) || JSON.parse(localStorage.getItem('facultyUser')) || { name: 'Admin Host', role: 'admin' };
  const isTeacher = true; // Always host from admin panel

  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const [hasJoined, setHasJoined] = useState(false);
  const [mediaError, setMediaError] = useState('');
  
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  
  const mainVideoWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [participants, setParticipants] = useState([
    { id: user._id || 'local', name: user.name + (isTeacher ? ' (Teacher)' : ' (You)'), role: user.role }
  ]);
  const [waitingParticipants, setWaitingParticipants] = useState([]);

  const admitParticipant = (id) => {
    webrtcService.admitStudent(id);
    setWaitingParticipants(prev => prev.filter(w => w.socketId !== id));
  };

  const admitAll = () => {
    webrtcService.admitAll();
    setWaitingParticipants([]);
  };

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const myVideoRef = useRef();
  const mainVideoRef = useRef(); // Usually the teacher's video for students

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mainVideoWrapperRef.current?.requestFullscreen) {
        mainVideoWrapperRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    // 1. Get local media for lobby preview
    const initMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        setStream(userStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Failed to get local media", err);
        if (err.name === 'NotReadableError') {
          setMediaError("Your camera or microphone is currently being used by another application (like Zoom or OBS). Please close it and refresh.");
        } else if (err.name === 'NotFoundError') {
          setMediaError("No camera or microphone found on your device.");
        } else if (err.name === 'NotAllowedError') {
          setMediaError("Camera/Microphone access denied. Please allow permissions in your browser to join.");
        } else {
          setMediaError(`Media error: ${err.message || err.name}`);
        }
      }
    };

    initMedia();

    return () => {
      webrtcService.disconnect();
    };
  }, [roomId]);

  const handleJoin = () => {
    if (!stream && !mediaError) return;
    setHasJoined(true);

    // 2. Connect to Socket
    webrtcService.connect(roomId, user._id, user.role, user.name);

    webrtcService.onChat = (data) => {
      setMessages(prev => [...prev, data]);
    };

    webrtcService.onTrack = (socketId, remoteStream) => {
      setRemoteStreams(prev => ({ ...prev, [socketId]: remoteStream }));
    };

    webrtcService.onParticipantsUpdate = (socketId, isJoining, participant) => {
      if (isJoining) {
        setParticipants(prev => [...prev, { id: socketId, ...participant }]);
      } else {
        setParticipants(prev => prev.filter(p => p.id !== socketId));
        setRemoteStreams(prev => {
          const updated = { ...prev };
          delete updated[socketId];
          return updated;
        });
      }
    };

    webrtcService.onHandRaise = (data) => {
      setToastMessage({ name: data.name, show: true });
      setTimeout(() => setToastMessage(null), 4000);
    };

    webrtcService.onStudentWaiting = (data) => {
      setWaitingParticipants(prev => {
        // Prevent duplicates if multiple events fire
        if (prev.find(p => p.socketId === data.socketId)) return prev;
        return [...prev, data];
      });
    };

    webrtcService.onParticipantMediaState = (data) => {
      setParticipants(prev => prev.map(p => p.id === data.socketId ? { ...p, isMuted: data.isMuted, isVideoOff: data.isVideoOff } : p));
    };

    if (isTeacher) {
      webrtcService.initTeacher(stream, (studentData) => {
        setParticipants(prev => [...prev, { id: studentData.socketId, name: studentData.name, role: 'student' }]);
      });
    } else {
      webrtcService.initStudent(stream, (teacherData) => {
        setParticipants(prev => [...prev, { id: teacherData.socketId, name: teacherData.name, role: 'teacher' }]);
      });
    }
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (myVideoRef.current) myVideoRef.current.srcObject = screenStream;
        webrtcService.setLocalStream(screenStream);
        setIsScreenSharing(true);

        screenStream.getVideoTracks()[0].onended = () => {
          if (myVideoRef.current) myVideoRef.current.srcObject = stream;
          webrtcService.setLocalStream(stream);
          setIsScreenSharing(false);
        };
      } catch (err) {
        console.error("Screen share failed", err);
      }
    } else {
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;
      webrtcService.setLocalStream(stream);
      setIsScreenSharing(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      recordedChunks.current = [];
      // Combine screen and audio if sharing, else standard stream
      const streamToRecord = myVideoRef.current.srcObject || stream;
      mediaRecorderRef.current = new MediaRecorder(streamToRecord, { mimeType: 'video/webm' });
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('recording', blob, `recording-${roomId}.webm`);
        formData.append('roomId', roomId);
        formData.append('teacherId', user._id);
        
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/webrtc/upload-recording`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          alert('Recording uploaded successfully!');
        } catch (err) {
          console.error("Failed to upload recording", err);
          alert('Failed to upload recording to server.');
          // Fallback: download locally
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `backup-recording-${roomId}.webm`;
          a.click();
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const leaveRoom = () => {
    if (isTeacher) {
      webrtcService.endClass();
    } else {
      webrtcService.disconnect();
    }
    if (stream) stream.getTracks().forEach(t => t.stop());
    navigate(-1);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    webrtcService.sendChat(chatInput);
    setChatInput('');
  };

  const raiseHand = () => {
    webrtcService.raiseHand();
  };

  if (!hasJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-2xl w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6">Ready to join?</h1>
          
          <div className="w-full max-w-md bg-black rounded-xl overflow-hidden aspect-video relative mb-6 border border-slate-700">
            {stream ? (
              <video 
                ref={el => {
                  myVideoRef.current = el;
                  if (el && stream) el.srcObject = stream;
                }} 
                autoPlay playsInline muted className="w-full h-full object-cover" 
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
            
            {stream && (
               <div className="absolute bottom-4 flex w-full justify-center gap-4">
                  <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  </button>
               </div>
            )}
          </div>
          
          <button 
            onClick={handleJoin}
            disabled={!stream && !mediaError}
            className={`px-8 py-3 rounded-full font-bold text-lg transition ${
              !stream && !mediaError ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {mediaError ? 'Join Without Media' : 'Join Class'}
          </button>
          
          <button onClick={() => navigate(-1)} className="mt-4 text-slate-400 hover:text-white transition">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white relative">
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
             <h1 className="font-bold text-lg">Classroom {isRecording && <span className="text-red-500 ml-2 animate-pulse">● Recording</span>}</h1>
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
          
          {/* Main Video View (Teacher for Students, or Active Speaker) */}
          <div ref={mainVideoWrapperRef} className="flex-1 bg-black rounded-xl overflow-hidden relative border border-slate-700">
             {isTeacher ? (
                // Teacher sees their own main video
                <video 
                  ref={el => {
                    myVideoRef.current = el;
                    if (el && stream) el.srcObject = stream;
                  }} 
                  autoPlay playsInline muted className="w-full h-full object-contain" 
                />
             ) : (
                // Student sees the teacher's video
                <video ref={mainVideoRef} autoPlay playsInline className="w-full h-full object-contain" />
             )}
             <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-sm">
               {isTeacher ? 'You (Broadcasting)' : 'Teacher'}
             </div>
             <button 
               onClick={toggleFullscreen} 
               className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-md transition text-slate-300 hover:text-white"
               title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
             >
               {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
             </button>
          </div>

          {/* Picture in Picture / Grid of other students (Only for Teacher mainly, or self view for student) */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 h-36">
             {!isTeacher && (
                <div className="w-48 flex flex-col bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-lg">
                  <div className="flex-1 bg-black relative">
                    <video ref={myVideoRef} autoPlay playsInline muted className="w-full h-full absolute inset-0 object-cover" />
                  </div>
                  <div className="px-2 py-1.5 text-center text-xs text-slate-300 font-medium truncate bg-slate-800 border-t border-slate-700">
                    You
                  </div>
                </div>
             )}
             
             {isTeacher && Object.keys(remoteStreams).map(socketId => {
                const participant = participants.find(p => p.id === socketId);
                return (
                  <div key={socketId} className="w-48 flex flex-col bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-lg">
                    <div className="flex-1 bg-black relative">
                      <video 
                        autoPlay 
                        playsInline 
                        className="w-full h-full absolute inset-0 object-cover" 
                        ref={el => { if (el) el.srcObject = remoteStreams[socketId] }} 
                      />
                    </div>
                    <div className="px-2 py-1.5 text-center text-xs text-slate-300 font-medium truncate bg-slate-800 border-t border-slate-700">
                      {participant ? participant.name : 'Student'}
                    </div>
                  </div>
                );
             })}
          </div>
        </div>

        {/* Sidebar (Chat / Participants) */}
        {chatOpen && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="flex border-b border-slate-700">
              <button 
                onClick={() => setActiveTab('chat')} 
                className={`flex-1 p-3 font-bold text-center transition text-sm ${activeTab === 'chat' ? 'bg-slate-700 border-b-2 border-primary text-white' : 'text-slate-400 hover:bg-slate-750'}`}
              >
                Chat
              </button>
              <button 
                onClick={() => setActiveTab('participants')} 
                className={`flex-1 p-3 font-bold text-center transition text-sm ${activeTab === 'participants' ? 'bg-slate-700 border-b-2 border-primary text-white' : 'text-slate-400 hover:bg-slate-750'}`}
              >
                Participants
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
                          <div key={wp.socketId} className="flex items-center justify-between bg-slate-750 p-2.5 rounded-lg border border-slate-700 shadow-sm opacity-80">
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
                    if (activeFilter === 'muted') return p.isMuted;
                    if (activeFilter === 'camera-off') return p.isVideoOff;
                    return true;
                  }).map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-slate-750 p-3 rounded-lg border border-slate-700 shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                          {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="text-sm truncate font-medium">{p.name || 'Unknown'}</span>
                      </div>
                      
                      {p.role === 'student' && (
                        <div className="flex gap-2">
                          {!p.isMuted ? (
                            <button onClick={() => webrtcService.muteParticipant(p.id)} className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Force Mute">
                              <MicOff size={14} />
                            </button>
                          ) : (
                            <span className="p-1.5 text-red-400" title="Muted"><MicOff size={14} /></span>
                          )}
                          
                          <button onClick={() => webrtcService.kickParticipant(p.id)} className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Remove Participant">
                            <PhoneOff size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {participants.length === 1 && (
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
        <div className="flex gap-2">
          {/* Empty space for alignment */}
        </div>

        <div className="flex gap-4">
          <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 hover:bg-slate-500'} transition`}>
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          {isTeacher && (
            <button onClick={toggleScreenShare} className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-600 hover:bg-slate-500'} transition`} title="Share Screen">
              <MonitorUp size={20} />
            </button>
          )}

          {isTeacher && (
            <button onClick={toggleRecording} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600 hover:bg-slate-500'} transition`} title={isRecording ? 'Stop Recording' : 'Start Recording'}>
              {isRecording ? <Square size={20} fill="white" /> : <Circle size={20} fill="white" />}
            </button>
          )}

          {!isTeacher && (
            <button onClick={raiseHand} className="p-3 rounded-full bg-slate-600 hover:bg-slate-500 transition" title="Raise Hand">
              <Hand size={20} />
            </button>
          )}
          
          <button onClick={leaveRoom} className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition px-6 font-bold flex items-center gap-2">
            <PhoneOff size={20} /> {isTeacher ? 'End Class' : 'Leave'}
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-full ${chatOpen ? 'bg-primary text-white' : 'bg-slate-600 hover:bg-slate-500'} transition relative`} title="Chat">
            <MessageSquare size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
