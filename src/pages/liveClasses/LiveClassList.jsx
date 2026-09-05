import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Calendar as CalendarIcon, Search, Filter, MoreVertical, Video, Clock, Eye, Trash2, Upload, PlayCircle, X, ExternalLink, Activity } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ImportModal from '../../components/common/ImportModal';
import { getLiveClasses, deleteLiveClass, updateLiveClass } from '../../services/liveClassService';
import { getRecordings } from '../../services/recordingService';
import { exportToCSV } from '../../utils/exportUtils';
import LiveClassCalendar from './LiveClassCalendar';
import { io } from 'socket.io-client';

export default function LiveClassList() {
  const navigate = useNavigate();

  const extractUrl = (text) => {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    let url = matches ? matches[0] : text;
    // Ensure admin joins as host (Zoom uses /s/ for start meeting, /j/ for join)
    if (url && url.includes('.zoom.us/j/')) {
      url = url.replace('.zoom.us/j/', '.zoom.us/s/');
    }
    return url;
  };

  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [sessions, setSessions] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // Default to active (Live & Scheduled)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const getFullVideoUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    fetchSessions();

    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
    const socket = io(baseUrl);
    
    socket.on('liveClassUpdate', () => {
      fetchSessions();
    });

    return () => socket.disconnect();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const [res, recRes] = await Promise.all([
        getLiveClasses(),
        getRecordings().catch(() => ({ success: false, data: [] }))
      ]);

      if (res.success) {
        setSessions(res.data);
      }
      
      if (recRes && recRes.success) {
        const map = new Map();
        recRes.data.forEach(r => {
          if (r.liveClass && r.videoUrl) {
            const classId = typeof r.liveClass === 'object' ? r.liveClass._id : r.liveClass;
            map.set(classId, r.videoUrl);
          }
        });
        setRecordedSessions(map);
      }
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteLiveClass(id);
        fetchSessions();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleStartSession = async (session) => {
    try {
      await updateLiveClass(session._id, { status: 'Live Now' });
      fetchSessions();
      if (session.meetingProvider === 'webrtc') {
        window.open(`/webrtc-host/${session._id}`, '_blank');
      } else if (session.zoomLink) {
        const url = extractUrl(session.zoomLink);
        if (url) {
          window.open(url, '_blank');
        } else {
          alert('Could not extract a valid URL from the Zoom link text.');
        }
      } else {
        alert('No Zoom link available for this session.');
      }
    } catch (error) {
      console.error('Failed to start session', error);
      alert('Failed to start session. Please try again.');
    }
  };

  const handleEndSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to end this live session?")) {
      try {
        await updateLiveClass(sessionId, { status: 'Completed' });
        fetchSessions();
      } catch (err) {
        console.error('Failed to end session', err);
        alert('Failed to end session');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Live Now': return 'danger'; // Red for live
      case 'Scheduled': return 'info'; // Blue for scheduled
      case 'Completed': return 'success';
      case 'Cancelled': return 'default';
      case 'Rescheduled': return 'warning';
      default: return 'default';
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'active') {
       matchesStatus = ['live now', 'scheduled'].includes(session.status?.toLowerCase());
    } else if (statusFilter && statusFilter !== 'all') {
       matchesStatus = session.status?.toLowerCase() === statusFilter.toLowerCase();
    }

    const matchesFaculty = facultyFilter ? session.faculty?._id === facultyFilter : true;
    return matchesSearch && matchesStatus && matchesFaculty;
  }).sort((a, b) => {
    // Keep 'Live Now' at the very top
    if (a.status?.toLowerCase() === 'live now' && b.status?.toLowerCase() !== 'live now') return -1;
    if (a.status?.toLowerCase() !== 'live now' && b.status?.toLowerCase() === 'live now') return 1;
    
    // Sort the rest by date descending
    return new Date(b.date) - new Date(a.date);
  });

  const handleExport = () => {
    const headers = [
      { label: 'Title', key: 'title' },
      { label: 'Date', key: 'date' },
      { label: 'Time', key: 'time' },
      { label: 'Status', key: 'status' }
    ];
    // Formatter logic since date/time might need formatting
    const formattedData = filteredSessions.map(session => ({
      ...session,
      date: new Date(session.date).toLocaleDateString(),
      time: `${session.time} (${session.duration} min)`
    }));
    exportToCSV(formattedData, headers, 'live_classes_export.csv');
  };

  const handleImport = async (data) => {
    try {
      console.log("Importing sessions: ", data);
      alert(`Successfully simulated import of ${data.length} live classes! Backend endpoint required for real data insertion.`);
    } catch (err) {
      alert("Error importing data");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Live Classes Management</h1>
          <p className="text-sm text-text-muted mt-1">Schedule and manage upcoming Zoom-based learning sessions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button 
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
            >
              List
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'calendar' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
            >
              Calendar
            </button>
          </div>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/live-classes/monitor')} 
            className="flex items-center gap-2 px-4 py-2 border border-brand-primary text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/5 transition-colors"
          >
            <Activity className="w-4 h-4" /> System Monitor
          </button>
          <button 
            onClick={() => navigate('/live-classes/schedule')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Schedule Session
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Global Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Classes</p>
               <p className="text-2xl font-bold text-slate-800">{sessions.length}</p>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Live Now</p>
               <p className="text-2xl font-bold text-green-600">{sessions.filter(s => s.status?.toLowerCase() === 'live now').length}</p>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Scheduled</p>
               <p className="text-2xl font-bold text-brand-primary">{sessions.filter(s => s.status?.toLowerCase() === 'scheduled').length}</p>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Participants</p>
               <p className="text-2xl font-bold text-slate-800">{sessions.reduce((acc, curr) => acc + (curr.liveParticipants || 0), 0)}</p>
             </div>
          </div>

          {/* Filters Area */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Session Name..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <div className="flex flex-wrap lg:flex-nowrap gap-3">
              <select value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
                <option value="">All Faculty</option>
                {Array.from(new Set(sessions.filter(s => s.faculty).map(s => s.faculty._id))).map(facultyId => {
                  const faculty = sessions.find(s => s.faculty?._id === facultyId).faculty;
                  return <option key={facultyId} value={facultyId}>{faculty.name}</option>
                })}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
                <option value="all">All Statuses</option>
                <option value="active">Active (Live & Scheduled)</option>
                <option value="scheduled">Scheduled</option>
                <option value="live now">Live Now</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" /> More Filters
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </th>
                    <th className="px-6 py-4">Session Name</th>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Faculty</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center text-text-muted">Loading sessions...</td></tr>
                ) : filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-text-muted">
                      No live sessions found matching the filters.
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session.status === 'Live Now' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-brand-primary/10 text-brand-primary'}`}>
                            <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <button 
                              onClick={() => navigate(`/live-classes/${session._id}`)}
                              className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                            >
                              {session.title}
                            </button>
                            <p className="text-xs text-text-muted mt-0.5">{session._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-text-main">{session.course?.title || 'General / No Course'}</p>
                        {session.courseModule && (
                          <p className="text-xs text-text-muted mt-0.5">M: {session.courseModule.title}</p>
                        )}
                        {session.lesson && (
                          <p className="text-xs text-text-muted mt-0.5">L: {session.lesson.title}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-text-main">{session.faculty?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1.5 text-text-main font-medium"><CalendarIcon className="w-3.5 h-3.5 text-gray-400" /> {new Date(session.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1.5 text-text-muted"><Clock className="w-3.5 h-3.5 text-gray-400" /> {session.time} ({session.duration} min)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={getStatusColor(session.status)} className={session.status === 'Live Now' ? 'animate-pulse' : ''}>
                          {session.status === 'Live Now' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>}
                          {session.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {session.status === 'Live Now' ? (
                            <>
                              <button 
                                onClick={(e) => { 
                                  if (session.meetingProvider === 'webrtc') {
                                    window.open(`/webrtc-host/${session._id}`, '_blank');
                                  } else {
                                    if(!session.zoomLink) { e.preventDefault(); alert('No Zoom link provided'); } 
                                    else { window.open(extractUrl(session.zoomLink), '_blank'); }
                                  }
                                }} 
                                className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors">
                                Join Now
                              </button>
                              <button onClick={() => handleEndSession(session._id)} className="px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 rounded text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors cursor-pointer">
                                End
                              </button>
                            </>
                          ) : session.status === 'Scheduled' && (
                            <button onClick={() => handleStartSession(session)} className="px-3 py-1.5 border border-brand-primary text-brand-primary rounded text-xs font-medium hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                              Start
                            </button>
                          )}
                          {session.status === 'Completed' && (
                            recordedSessions.has(session._id) ? (
                              <button onClick={() => setPreviewVideoUrl(recordedSessions.get(session._id))} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-500 hover:text-emerald-700 transition-colors" title="Play Recording Preview">
                                <PlayCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button onClick={() => navigate(`/live-classes/${session._id}`)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-400 hover:text-blue-600 transition-colors" title="Upload Recording">
                                <Upload className="w-4 h-4" />
                              </button>
                            )
                          )}
                          <button onClick={() => navigate(`/live-classes/${session._id}`)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-primary transition-colors ml-2" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(session._id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete Session">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
            {/* Pagination Dummy */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-text-muted">
              <span>Showing 1 to 4 of 24 entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-brand-primary text-white rounded">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LiveClassCalendar sessions={filteredSessions} />
      )}
      
      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden relative">
            <button 
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full bg-black">
              <video 
                src={getFullVideoUrl(previewVideoUrl)} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-text-muted">Recording Preview</p>
            </div>
          </div>
        </div>
      )}

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
        entityName="Live Classes" 
      />
    </div>
  );
}
