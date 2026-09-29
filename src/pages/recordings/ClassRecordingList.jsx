import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Download, Edit, Trash2, X, FileVideo } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getClassRecordings, deleteClassRecording, updateClassRecording } from '../../services/classRecordingService';

export default function ClassRecordingList() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [portalsReady, setPortalsReady] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

  useEffect(() => {
    setPortalsReady(true);
    fetchRecordings();
    return () => setPortalsReady(false);
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const res = await getClassRecordings();
      if (res.success) {
        setRecordings(res.data);
      }
    } catch (err) {
      console.error('Failed to load class recordings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recording? This will also remove the file from the server.')) {
      try {
        await deleteClassRecording(id);
        fetchRecordings();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClassRecording(editingVideo._id, {
        title: editingVideo.title,
        description: editingVideo.description,
      });
      setEditingVideo(null);
      fetchRecordings();
    } catch (err) {
      console.error('Failed to update', err);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const filteredRecordings = recordings.filter(rec => 
    rec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.roomName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {portalsReady && document.getElementById('topbar-title-portal') && createPortal(
        <span>Class Recordings</span>,
        document.getElementById('topbar-title-portal')
      )}

      {portalsReady && document.getElementById('topbar-search-portal') && createPortal(
        <div className="flex-1 min-w-[250px] w-full">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Title or Room..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50"
            />
          </div>
        </div>,
        document.getElementById('topbar-search-portal')
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Recording</th>
                <th className="px-6 py-4">Class/Course</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">File Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-4 text-center text-text-muted">Loading class recordings...</td></tr>
              ) : filteredRecordings.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-4 text-center text-text-muted">No recordings found</td></tr>
              ) : filteredRecordings.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {rec.title}
                  </td>
                  <td className="px-6 py-4">
                    {rec.course?.title || rec.roomName || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {rec.teacher?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {formatDuration(rec.duration)}
                  </td>
                  <td className="px-6 py-4">
                    {formatSize(rec.fileSize)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={(rec.recordingState === 'completed' || rec.status === 'EGRESS_COMPLETE') ? 'success' : (rec.recordingState === 'failed' || rec.status === 'EGRESS_FAILED' ? 'danger' : 'warning')}>
                      {rec.recordingState ? rec.recordingState.toUpperCase() : rec.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedVideo(rec)} 
                        className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-brand-primary transition-colors"
                        title="View / Play"
                        disabled={!(rec.recordingState === 'completed' || rec.status === 'EGRESS_COMPLETE')}
                      >
                        <PlayCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingVideo(rec)} 
                        className="p-1.5 hover:bg-yellow-50 rounded-lg text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <a 
                        href={`${baseUrl}/api/v1/class-recordings/${rec._id}/download`} 
                        download
                        className={`p-1.5 rounded-lg transition-colors ${!(rec.recordingState === 'completed' || rec.status === 'EGRESS_COMPLETE') ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                        title="Download MP4"
                        onClick={(e) => !(rec.recordingState === 'completed' || rec.status === 'EGRESS_COMPLETE') && e.preventDefault()}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(rec._id)} 
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:pl-64">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-text-main">{selectedVideo.title}</h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center relative w-full">
              <video 
                controls 
                autoPlay 
                className="w-full h-full outline-none"
                src={`${baseUrl}/api/v1/class-recordings/${selectedVideo._id}/stream`}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:pl-64">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Edit Recording</h3>
              <button onClick={() => setEditingVideo(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingVideo.title || ''} 
                  onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editingVideo.description || ''} 
                  onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[100px]"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingVideo(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
