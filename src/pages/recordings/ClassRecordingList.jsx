import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Search, PlayCircle, Download, Edit, Trash2, X, FileVideo,
  ChevronLeft, ChevronRight, RefreshCw, Loader2
} from 'lucide-react';
import api from '../../services/axiosInstance';
import Badge from '../../components/common/Badge';
import { updateClassRecording, deleteClassRecording } from '../../services/classRecordingService';

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'recording', label: 'Recording' },
  { value: 'paused', label: 'Paused' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const STATUS_BADGE = {
  completed: 'success',
  failed: 'danger',
  recording: 'warning',
  paused: 'warning',
  processing: 'warning',
  idle: 'default',
};

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '\u2014';
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDuration(seconds) {
  if (!seconds || seconds === 0) return '\u2014';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`;
  return `${m}m ${s.toString().padStart(2,'0')}s`;
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ClassRecordingList() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const LIMIT = 20;

  // Player state â€” uses HTTP range streaming, no blob
  const [playerRec, setPlayerRec] = useState(null);
  const [playerError, setPlayerError] = useState('');

  // Edit state
  const [editingRec, setEditingRec] = useState(null);
  const [editError, setEditError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [portalsReady, setPortalsReady] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';

  useEffect(() => { setPortalsReady(true); return () => setPortalsReady(false); }, []);

  const fetchRecordings = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const params = { page, limit: LIMIT };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/class-recordings', { params });
      setRecordings(res.data.data || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      setLoadError('Failed to load recordings. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchRecordings, 300);
    return () => clearTimeout(t);
  }, [fetchRecordings]);

  // Authenticated streaming URL â€” backend supports HTTP Range requests for seeking
  const getStreamUrl = (id) => {
    const token = localStorage.getItem('token');
    return `${baseUrl}/api/v1/class-recordings/${id}/stream?token=${encodeURIComponent(token || '')}`;
  };

  const handlePlay = (rec) => {
    if (rec.recordingState !== 'completed') return;
    setPlayerRec(rec);
    setPlayerError('');
  };

  const handleDownload = async (rec) => {
    if (rec.recordingState !== 'completed') return;
    try {
      const response = await api.get(`/class-recordings/${rec._id}/download`, { responseType: 'blob' });
      const blobUrl = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = rec.fileName || `${rec.title || 'recording'}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recording? This will permanently remove the file from the server.')) return;
    try {
      setDeletingId(id);
      await deleteClassRecording(id);
      fetchRecordings();
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditError('');
      await updateClassRecording(editingRec._id, { title: editingRec.title, description: editingRec.description });
      setEditingRec(null);
      fetchRecordings();
    } catch (err) {
      setEditError('Failed to save. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {portalsReady && document.getElementById('topbar-title-portal') &&
        createPortal(<span>Class Recordings</span>, document.getElementById('topbar-title-portal'))}

      {portalsReady && document.getElementById('topbar-search-portal') &&
        createPortal(
          <div className="flex items-center gap-3 flex-1 min-w-[250px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search by title..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50"
              />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary">
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={fetchRecordings} className="p-2 text-gray-400 hover:text-brand-primary" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>,
          document.getElementById('topbar-search-portal')
        )}

      {loadError && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">{loadError}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-5 py-4">Recording</th>
                <th className="px-5 py-4">Host</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Duration</th>
                <th className="px-5 py-4">Size</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                    <span>Loading recordingsâ€¦</span>
                  </div>
                </td></tr>
              ) : recordings.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-text-muted">
                    <FileVideo className="w-8 h-8 opacity-30" />
                    <span>No recordings found</span>
                  </div>
                </td></tr>
              ) : recordings.map(rec => {
                const isComplete = rec.recordingState === 'completed';
                const isProcessing = ['processing', 'recording', 'paused'].includes(rec.recordingState);
                return (
                  <tr key={rec._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-text-main">{rec.title}</p>
                      {rec.course?.title && <p className="text-xs text-text-muted mt-0.5">{rec.course.title}</p>}
                    </td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">{rec.teacher?.name || 'â€”'}</td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">{formatDate(rec.startedAt || rec.createdAt)}</td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">{formatDuration(rec.duration)}</td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">{formatSize(rec.fileSize)}</td>
                    <td className="px-5 py-4">
                      <Badge status={STATUS_BADGE[rec.recordingState] || 'default'}>
                        {isProcessing
                          ? <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />{(rec.recordingState || '').charAt(0).toUpperCase() + (rec.recordingState || '').slice(1)}</span>
                          : (rec.recordingState || 'idle').charAt(0).toUpperCase() + (rec.recordingState || 'idle').slice(1)
                        }
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handlePlay(rec)} disabled={!isComplete}
                          title={isComplete ? 'Play' : 'Not available yet'}
                          className={`p-1.5 rounded-lg transition-colors ${isComplete ? 'hover:bg-blue-50 text-gray-400 hover:text-brand-primary' : 'text-gray-200 cursor-not-allowed'}`}>
                          <PlayCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingRec({ ...rec })} title="Edit"
                          className="p-1.5 hover:bg-yellow-50 rounded-lg text-gray-400 hover:text-yellow-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDownload(rec)} disabled={!isComplete}
                          title={isComplete ? 'Download MP4' : 'Not available yet'}
                          className={`p-1.5 rounded-lg transition-colors ${isComplete ? 'hover:bg-green-50 text-gray-400 hover:text-green-600' : 'text-gray-200 cursor-not-allowed'}`}>
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(rec._id)} disabled={deletingId === rec._id}
                          title="Delete" className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                          {deletingId === rec._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-text-muted">
            <span>Showing {((page - 1) * LIMIT) + 1}â€“{Math.min(page * LIMIT, pagination.total)} of {pagination.total}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {page} of {pagination.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* â”€â”€ Video Player Modal â€” uses HTTP range streaming for seek support â”€â”€ */}
      {playerRec && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:pl-64">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-text-main">{playerRec.title}</h3>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-text-muted">
                  {playerRec.teacher?.name && <span>Host: {playerRec.teacher.name}</span>}
                  <span>{formatDate(playerRec.startedAt || playerRec.createdAt)}</span>
                  {playerRec.duration > 0 && <span>Duration: {formatDuration(playerRec.duration)}</span>}
                  {playerRec.fileSize > 0 && <span>Size: {formatSize(playerRec.fileSize)}</span>}
                </div>
              </div>
              <button onClick={() => { setPlayerRec(null); setPlayerError(''); }} className="p-2 hover:bg-gray-100 rounded-lg ml-4">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="aspect-video bg-black relative">
              {playerError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <FileVideo className="w-12 h-12 opacity-30 mb-3" />
                  <p className="font-medium">Unable to play recording</p>
                  <p className="text-sm opacity-60 mt-1">{playerError}</p>
                </div>
              ) : (
                <video key={playerRec._id} controls autoPlay className="w-full h-full outline-none"
                  onError={() => setPlayerError('Playback failed. The file may be unavailable or still processing.')}
                  src={getStreamUrl(playerRec._id)}>
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button onClick={() => handleDownload(playerRec)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 text-sm font-medium transition-colors">
                <Download className="w-4 h-4" /> Download Recording
              </button>
              {playerRec.roomName && <span className="text-xs text-text-muted">Class ID: {playerRec.roomName.slice(-8)}</span>}
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Edit Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {editingRec && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:pl-64">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Edit Recording</h3>
              <button onClick={() => { setEditingRec(null); setEditError(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            {editError && <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{editError}</p>}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editingRec.title || ''}
                  onChange={e => setEditingRec({ ...editingRec, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editingRec.description || ''}
                  onChange={e => setEditingRec({ ...editingRec, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary min-h-[100px] resize-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => { setEditingRec(null); setEditError(''); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 text-sm font-medium">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

