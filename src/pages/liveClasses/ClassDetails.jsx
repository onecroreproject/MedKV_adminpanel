import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Video, Clock, Users, Calendar, Upload, Download, Copy, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getLiveClass, updateLiveClass } from '../../services/liveClassService';
import { getAttendanceByClass } from '../../services/attendanceService';
import { getRecordings, createRecording, uploadRecordingFile } from '../../services/recordingService';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [session, setSession] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [recordingFile, setRecordingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [savingRec, setSavingRec] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await getLiveClass(id);
      if (res.success) {
        setSession(res.data);
      }
      
      const [attRes, recRes] = await Promise.all([
        getAttendanceByClass(id),
        getRecordings({ liveClass: id })
      ]);
      
      if (attRes.success) setAttendanceData(attRes.data);
      if (recRes.success) {
        // Filter locally if backend doesn't filter by liveClass query (though we just added it)
        const classRecs = recRes.data.filter(r => r.liveClass === id || (r.liveClass && r.liveClass._id === id));
        setRecordings(classRecs.length ? classRecs : recRes.data.filter(r => String(r.liveClass) === id));
      }
    } catch (err) {
      console.error('Failed to load session details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecording = async () => {
    if (!recordingUrl && !recordingFile) return alert("Please enter a URL or select a video file");
    try {
      setSavingRec(true);
      setUploadProgress(0);

      if (recordingFile) {
        // File Upload
        const formData = new FormData();
        formData.append('video', recordingFile);
        formData.append('title', `${session.title} - Recording`);
        if (session.course?._id) formData.append('course', session.course._id);
        if (session.faculty?._id) formData.append('faculty', session.faculty._id);
        formData.append('liveClass', id);
        formData.append('duration', `${session.duration}m`);

        const res = await uploadRecordingFile(formData, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        });

        if (res.success) {
          alert("Recording uploaded successfully! Compression started in background.");
          setRecordingFile(null);
          setUploadProgress(0);
          fetchSession(); // refresh list
        }
      } else {
        // URL Link Upload
        const res = await createRecording({
          title: `${session.title} - Recording`,
          course: session.course?._id,
          faculty: session.faculty?._id,
          videoUrl: recordingUrl,
          liveClass: id,
          duration: `${session.duration}m`,
          isPublished: true
        });
        if (res.success) {
          alert("Recording link added successfully!");
          setRecordingUrl('');
          fetchSession(); // refresh list
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add recording");
      setUploadProgress(0);
    } finally {
      setSavingRec(false);
    }
  };

  const extractUrl = (text) => {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    let url = matches ? matches[0] : text;
    if (url && url.includes('.zoom.us/j/')) {
      url = url.replace('.zoom.us/j/', '.zoom.us/s/');
    }
    return url;
  };

  const getFullVideoUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const handleStartSession = async () => {
    try {
      await updateLiveClass(id, { status: 'Live Now' });
      fetchSession();
      if (session.zoomLink) {
        const url = extractUrl(session.zoomLink);
        if (url) {
          window.open(url, '_blank');
        } else {
          alert('Could not extract a valid URL from the Zoom link text.');
        }
      } else {
        alert('No Zoom link available for this session.');
      }
    } catch (err) {
      console.error('Failed to start session', err);
      alert('Failed to start session');
    }
  };



  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/live-classes')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Live Classes
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/live-classes/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit Session
          </button>
          {session?.status === 'Scheduled' && (
            <button 
              onClick={handleStartSession}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
            >
              <PlayCircle className="w-4 h-4 text-brand-accent" /> Start Session
            </button>
          )}
          {session?.status === 'Live Now' && (
            <button 
              onClick={async () => {
                if (window.confirm("Are you sure you want to end this live session?")) {
                  await updateLiveClass(id, { status: 'Completed' });
                  fetchSession();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
            >
              <StopCircle className="w-4 h-4 text-emerald-100" /> End Session
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-text-muted">Loading session details...</div>
      ) : !session ? (
        <div className="py-20 text-center text-text-muted">Session not found.</div>
      ) : (
        <>
          {/* Profile Header Dashboard */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20 shrink-0">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status={
                session.status === 'Live Now' ? 'success' :
                session.status === 'Completed' ? 'default' :
                session.status === 'Cancelled' ? 'danger' : 'warning'
              }>{session.status}</Badge>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{session.course?.title || 'General'}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{session.title}</h1>
            <p className="text-text-muted text-sm mt-1">Instructor: <span className="font-medium text-text-main">{session.faculty?.name || 'Unassigned'}</span></p>
            {(session.courseModule || session.lesson) && (
              <div className="flex items-center gap-2 mt-3">
                {session.courseModule && <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">Module: {session.courseModule.title}</span>}
                {session.lesson && <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">Lesson: {session.lesson.title}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full lg:w-auto">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</p>
            <p className="text-sm font-medium text-text-main">{new Date(session.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time</p>
            <p className="text-sm font-medium text-text-main">{session.time} ({session.duration} mins)</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200 w-full sm:w-fit">
        {['overview', 'attendance', 'recordings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-text-main'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Zoom Details */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-text-main">Zoom Meeting Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Meeting Link</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-sm text-text-main font-medium truncate flex-1">{session.zoomLink || 'No link provided'}</span>
                      <button 
                        onClick={() => {
                          if (session.zoomLink) {
                            navigator.clipboard.writeText(session.zoomLink);
                            alert('Copied to clipboard');
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-brand-primary transition-colors" 
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Meeting ID</label>
                    <p className="text-sm font-medium text-text-main px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{session.zoomId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Passcode</label>
                    <p className="text-sm font-medium text-text-main px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{session.zoomPasscode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Session Statistics */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-text-main">Session Statistics</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-2xl font-bold text-brand-primary">0</p>
                      <p className="text-xs text-text-muted mt-1 uppercase">Registered</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-2xl font-bold text-text-main">-</p>
                      <p className="text-xs text-text-muted mt-1 uppercase">Attended</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Total Registered</p>
                <p className="text-2xl font-bold text-text-main">0</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Present</p>
                <p className="text-2xl font-bold text-emerald-600">{attendanceData.filter(a => a.status === 'Present').length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Absent</p>
                <p className="text-2xl font-bold text-red-600">{attendanceData.filter(a => a.status === 'Absent').length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Attendance Rate</p>
                <p className="text-2xl font-bold text-brand-primary">0%</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-text-main">Attendance Log</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 bg-white text-text-main rounded-md text-xs font-medium hover:bg-gray-50">
                  <Download className="w-3.5 h-3.5" /> Export Log
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
                  <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Join Time</th>
                      <th className="px-6 py-3">Leave Time</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendanceData.length > 0 ? attendanceData.map((record) => (
                      <tr key={record._id}>
                        <td className="px-6 py-3 font-medium">{record.student?.name || 'Unknown'}</td>
                        <td className="px-6 py-3 text-text-muted">{record.joinTime ? new Date(record.joinTime).toLocaleTimeString() : '-'}</td>
                        <td className="px-6 py-3 text-text-muted">{record.leaveTime ? new Date(record.leaveTime).toLocaleTimeString() : '-'}</td>
                        <td className="px-6 py-3">{record.duration}m</td>
                        <td className="px-6 py-3">
                          <Badge status={
                            record.status === 'Present' ? 'success' : 
                            record.status === 'Absent' ? 'danger' : 'warning'
                          }>{record.status}</Badge>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-text-muted">No attendance data available for this session.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Recordings Tab */}
        {activeTab === 'recordings' && (
          <div className="space-y-6">
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800">Recording Retention Policy</p>
                <p className="text-sm text-blue-600 mt-1">
                  Recordings uploaded here will be automatically available to students enrolled in the course for <strong>7 days</strong> after the session.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Upload Session Recording</h3>
              <p className="text-sm text-text-muted max-w-md mb-6">
                Upload a video file to automatically compress and save it to the backend, or enter an external URL link (Zoom, Vimeo).
              </p>

              {uploadProgress > 0 && uploadProgress < 100 ? (
                <div className="w-full max-w-md mb-6">
                  <div className="flex justify-between text-xs text-brand-primary font-bold mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full max-w-md gap-4">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50 focus-within:border-brand-primary">
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/x-m4v,video/*"
                      onChange={(e) => {
                        setRecordingFile(e.target.files[0]);
                        setRecordingUrl('');
                      }}
                      className="text-sm text-gray-500 flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-brand-primary hover:file:bg-gray-100 file:cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-gray-400">OR</div>
                  <input 
                    type="text" 
                    value={recordingUrl}
                    onChange={(e) => {
                      setRecordingUrl(e.target.value);
                      setRecordingFile(null);
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" 
                    placeholder="https://..." 
                  />
                  <button 
                    onClick={handleAddRecording}
                    disabled={savingRec || (!recordingUrl && !recordingFile)}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 disabled:opacity-50 mt-2"
                  >
                    <Video className="w-4 h-4 text-brand-accent" /> {savingRec ? 'Uploading...' : 'Save Recording'}
                  </button>
                </div>
              )}
            </div>

            {recordings.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-text-main">Session Recordings ({recordings.length})</h3>
                </div>
                <div className="p-4 grid gap-4">
                  {recordings.map(rec => (
                    <div key={rec._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-text-main flex items-center gap-2">
                            {rec.title}
                            {rec.compressionStatus === 'processing' && (
                              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full uppercase font-bold animate-pulse">Compressing...</span>
                            )}
                          </p>
                          <p className="text-xs text-text-muted">
                            Added {new Date(rec.createdAt).toLocaleDateString()} {rec.duration ? `• Duration: ${rec.duration}` : ''}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={getFullVideoUrl(rec.videoUrl)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-2 text-xs font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20 transition-colors"
                      >
                        View Recording
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}
