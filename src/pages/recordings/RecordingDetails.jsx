import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Video, PlayCircle, Maximize, Volume2, Settings, Users, Clock, Eye, BarChart2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getRecording } from '../../services/recordingService';
import EditRecordingModal from './EditRecordingModal';

export default function RecordingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

  const fetchRecording = async () => {
    try {
      setLoading(true);
      const res = await getRecording(id);
      if (res.success) {
        setRecording(res.data);
      }
    } catch (err) {
      console.error('Failed to load recording details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRecording();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-text-muted">Loading recording details...</div>;
  }

  if (!recording) {
    return <div className="py-20 text-center text-text-muted">Recording not found.</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/recordings')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recordings
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" /> Edit Recording
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video & Details Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Actual Video Player */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800 relative group aspect-video flex items-center justify-center">
            {recording.videoUrl ? (
              <video 
                controls 
                className="w-full h-full outline-none"
                src={recording.videoUrl.startsWith('http') ? recording.videoUrl : `${baseUrl}${recording.videoUrl}`}
                poster={recording.thumbnail && recording.thumbnail !== 'default_thumbnail.jpg' ? (recording.thumbnail.startsWith('http') ? recording.thumbnail : `${baseUrl}${recording.thumbnail}`) : undefined}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center text-white/50 py-20">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No video URL provided.</p>
              </div>
            )}
          </div>

          {/* Recording Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-text-main">{recording.title}</h1>
                <p className="text-text-muted text-sm mt-1">Uploaded on {new Date(recording.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge status={recording.isPublished ? 'success' : 'default'}>{recording.isPublished ? 'Published' : 'Draft'}</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Course</p>
                <p className="text-sm font-medium text-text-main">{recording.course?.title || 'General'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Faculty</p>
                <p className="text-sm font-medium text-text-main">{recording.faculty?.name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm font-medium text-text-main">{recording.duration || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Format</p>
                <p className="text-sm font-medium text-text-main">Video</p>
              </div>
            </div>

            {recording.description && (
              <div className="mt-4">
                <h4 className="text-sm font-bold text-text-main mb-2">Description</h4>
                <p className="text-sm text-text-muted leading-relaxed">
                  {recording.description}
                </p>
              </div>
            )}
            
            {(recording.courseModule || recording.lesson || recording.liveClass?.courseModule || recording.liveClass?.lesson) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-text-main mb-2">Curriculum Alignment</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(recording.courseModule || recording.liveClass?.courseModule) && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-brand-primary/10 text-brand-primary">
                      Module: {(recording.courseModule?.title || recording.liveClass?.courseModule?.title)}
                    </span>
                  )}
                  {(recording.lesson || recording.liveClass?.lesson) && (
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                      Lesson: {(recording.lesson?.title || recording.liveClass?.lesson?.title)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Analytics & Access */}
        <div className="space-y-6">
          
          {/* Analytics Cards */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><BarChart2 className="w-4 h-4 text-brand-primary" /> Analytics</h3>
              <button className="text-xs text-brand-primary font-medium hover:underline">View Full Report</button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-text-main">0</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5">Total Views</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-text-main">0h</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5">Watch Time</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <Video className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-brand-primary">0%</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5">Completion</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-emerald-600">0</p>
                <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5">Unique Studs</p>
              </div>
            </div>
          </div>

          {/* Student Access Management */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main flex items-center gap-2"><Users className="w-4 h-4 text-brand-primary" /> Access Control</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-medium text-text-main">Assigned Course</span>
                <span className="text-sm text-text-muted">{recording.course?.title || 'None'}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-sm font-medium text-text-main">Access Level</span>
                <Badge status="info">Course Students Only</Badge>
              </div>
              
              {/* Missed Live Class Rule Display */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-2">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Missed Session Policy Active</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Available to students who missed the live session until <strong>Nov 01, 2023</strong> (7 Days).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <EditRecordingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        recording={recording}
        onRecordingUpdated={fetchRecording}
      />
    </div>
  );
}
