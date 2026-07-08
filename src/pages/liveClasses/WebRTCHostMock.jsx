import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquare, Hand, Circle, Square, Maximize, Minimize } from 'lucide-react';
import darkLogo from '../../assets/logos/dark_logo_transparent.png';

export default function WebRTCHostMock() {
  const mainVideoWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState([
    { senderId: 'student1', name: 'Alice Smith', message: 'Hello teacher!' },
    { senderId: 'student2', name: 'Bob Johnson', message: 'I have a question about the assignment.' },
    { senderId: 'system', name: 'System', role: 'system', message: 'Alice Smith raised hand!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [activeFilter, setActiveFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState({ name: 'Alice Smith', show: true });
  
  const [participants, setParticipants] = useState([
    { id: 'local', name: 'Admin Host (You)', role: 'admin', isMuted: false, isVideoOff: false },
    { id: 'student1', name: 'Alice Smith', role: 'student', isMuted: false, isVideoOff: false },
    { id: 'student2', name: 'Bob Johnson', role: 'student', isMuted: true, isVideoOff: true },
    { id: 'student3', name: 'Charlie Davis', role: 'student', isMuted: false, isVideoOff: true }
  ]);

  const [waitingParticipants, setWaitingParticipants] = useState([
    { id: 'wait1', name: 'Diana Prince' },
    { id: 'wait2', name: 'Bruce Wayne' }
  ]);

  const admitParticipant = (id) => {
    const p = waitingParticipants.find(w => w.id === id);
    if (p) {
      setWaitingParticipants(waitingParticipants.filter(w => w.id !== id));
      setParticipants([...participants, { ...p, role: 'student', isMuted: true, isVideoOff: true }]);
    }
  };

  const admitAll = () => {
    const newParticipants = waitingParticipants.map(w => ({ ...w, role: 'student', isMuted: true, isVideoOff: true }));
    setParticipants([...participants, ...newParticipants]);
    setWaitingParticipants([]);
  };

  const [isRecording, setIsRecording] = useState(true);

  // Fake streams
  const remoteStreams = {
    'student1': true,
    'student2': true,
    'student3': true
  };

  const user = { name: 'Admin Host', profilePicture: '' };
  
  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { senderId: 'local', name: 'Admin Host', message: chatInput }]);
    setChatInput('');
  };

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

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white relative">
      {/* Toast Notification */}
      {toastMessage && toastMessage.show && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <Hand size={24} />
          <span className="font-bold text-lg">{toastMessage.name} raised their hand!</span>
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
             <img src={"https://ui-avatars.com/api/?name=" + user.name + "&background=random"} alt="Host" className="w-9 h-9 rounded-full border border-slate-500" />
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
          
          {/* Main Video View */}
          <div ref={mainVideoWrapperRef} className="flex-1 bg-slate-800 rounded-xl overflow-hidden relative border border-slate-700 flex items-center justify-center">
             <div className="text-slate-500 flex flex-col items-center">
                <VideoOff size={64} className="mb-4 opacity-50" />
                <p>Your Video Feed Goes Here</p>
             </div>
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-sm">
              You (Broadcasting)
            </div>
            <button 
              onClick={toggleFullscreen} 
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-md transition text-slate-300 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>

          {/* Picture in Picture */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 h-36">
             {Object.keys(remoteStreams).map(socketId => {
                const participant = participants.find(p => p.id === socketId);
                return (
                  <div key={socketId} className="w-48 flex flex-col bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-lg">
                    <div className="flex-1 bg-slate-900 relative flex items-center justify-center">
                        {participant?.isVideoOff ? (
                             <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg">
                                {participant.name.charAt(0)}
                             </div>
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${participant?.name}&background=random`} className="w-full h-full object-cover opacity-50" alt="" />
                        )}
                    </div>
                    <div className="px-2 py-1.5 flex justify-between items-center bg-slate-800 border-t border-slate-700">
                        <span className="text-xs text-slate-300 font-medium truncate">
                            {participant ? participant.name : 'Student'}
                        </span>
                        {participant?.isMuted && <MicOff size={12} className="text-red-400 flex-shrink-0" />}
                    </div>
                  </div>
                );
             })}
          </div>
        </div>

        {/* Sidebar */}
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
                      <div className={`${m.senderId === 'system' ? 'bg-transparent' : (m.senderId === 'local' ? 'bg-primary self-end' : 'bg-slate-700 self-start')} px-3 py-2 rounded-lg text-sm inline-block max-w-[85%]`}>
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
                          <div key={wp.id} className="flex items-center justify-between bg-slate-750 p-2.5 rounded-lg border border-slate-700 shadow-sm opacity-80">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-7 h-7 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                {wp.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm truncate font-medium">{wp.name}</span>
                            </div>
                            <button onClick={() => admitParticipant(wp.id)} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition">
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
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm truncate font-medium">{p.name}</span>
                      </div>
                      
                      {p.role === 'student' && (
                        <div className="flex gap-2">
                          {!p.isMuted ? (
                            <button className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Force Mute">
                              <MicOff size={14} />
                            </button>
                          ) : (
                            <span className="p-1.5 text-red-400" title="Muted"><MicOff size={14} /></span>
                          )}
                          
                          <button className="p-1.5 bg-slate-600 hover:bg-red-500 rounded text-slate-300 transition" title="Remove Participant">
                            <PhoneOff size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
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
          <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-slate-600'} transition`}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-slate-600'} transition`}>
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-500' : 'bg-slate-600'} transition`} title="Share Screen">
            <MonitorUp size={20} />
          </button>

          <button onClick={() => setIsRecording(!isRecording)} className={`p-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'} transition`} title={isRecording ? 'Stop Recording' : 'Start Recording'}>
            {isRecording ? <Square size={20} fill="white" /> : <Circle size={20} fill="white" />}
          </button>
          
          <button className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition px-6 font-bold flex items-center gap-2">
            <PhoneOff size={20} /> End Class
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-full ${chatOpen ? 'bg-primary text-white' : 'bg-slate-600'} transition relative`} title="Chat">
            <MessageSquare size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
