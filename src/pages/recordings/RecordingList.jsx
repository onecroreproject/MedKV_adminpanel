import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Filter, MoreVertical, LayoutGrid, List as ListIcon, PlayCircle, Clock, RefreshCw, X, Video, Eye, Trash2, Upload } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ImportModal from '../../components/common/ImportModal';
import { getRecordings, deleteRecording } from '../../services/recordingService';
import { exportToCSV } from '../../utils/exportUtils';

export default function RecordingList() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' or 'grid'
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const res = await getRecordings();
      if (res.success) {
        setRecordings(res.data);
      }
    } catch (err) {
      console.error('Failed to load recordings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      try {
        await deleteRecording(id);
        fetchRecordings();
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Processing': return 'warning';
      case 'Draft': return 'default';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? (rec.isPublished ? 'published' : 'draft') === statusFilter.toLowerCase() : true;
    const matchesCourse = courseFilter ? rec.course?._id === courseFilter : true;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleExport = () => {
    const headers = [
      { label: 'Title', key: 'title' },
      { label: 'Duration', key: 'duration' },
      { label: 'Published', key: 'isPublished' },
      { label: 'Course', key: 'courseTitle' },
    ];
    const formattedData = filteredRecordings.map(r => ({
      ...r,
      courseTitle: r.course?.title || 'General'
    }));
    exportToCSV(formattedData, headers, 'recordings_export.csv');
  };

  const handleImport = async (data) => {
    try {
      console.log("Importing recordings: ", data);
      alert(`Successfully simulated import of ${data.length} recordings! Backend endpoint required for real data insertion.`);
    } catch (err) {
      alert("Error importing data");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Recorded Sessions</h1>
          <p className="text-sm text-text-muted mt-1">Manage video content, zoom recordings, and lectures.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
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
            onClick={() => navigate('/recordings/upload')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Upload Recording
          </button>
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
            placeholder="Search Recordings by Title..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Courses</option>
            {/* Ideally this would be populated dynamically from an API, but for now we'll rely on the existing static options or unique values from recordings */}
            {Array.from(new Set(recordings.filter(r => r.course).map(r => r.course._id))).map(courseId => {
              const course = recordings.find(r => r.course?._id === courseId).course;
              return <option key={courseId} value={courseId}>{course.title}</option>
            })}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="processing">Processing</option>
            <option value="draft">Draft</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> More Filters
          </button>
        </div>
      </div>

      {view === 'list' ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
              <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </th>
                  <th className="px-6 py-4">Session Info</th>
                  <th className="px-6 py-4">Course & Faculty</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center text-text-muted">Loading recordings...</td></tr>
                ) : filteredRecordings.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-4 text-center text-text-muted">No recordings found</td></tr>
                ) : filteredRecordings.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 group-hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVideo(rec)}>
                          <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors flex items-center justify-center">
                            <PlayCircle className="w-6 h-6 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-sm" />
                          </div>
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/recordings/${rec._id}`)}
                            className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left max-w-[200px] truncate block"
                            title={rec.title}
                          >
                            {rec.title}
                          </button>
                          <p className="text-xs text-text-muted mt-0.5">Uploaded {new Date(rec.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-text-main">{rec.course?.title || 'General'}</span>
                        <span className="text-xs text-text-muted">{rec.faculty?.name || 'Unassigned'}</span>
                        
                        {/* Dynamic Curriculum Display */}
                        {(rec.courseModule || rec.lesson || rec.liveClass?.courseModule || rec.liveClass?.lesson) && (
                          <div className="flex flex-col gap-1 mt-1">
                            {(rec.courseModule || rec.liveClass?.courseModule) && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary w-fit">
                                M: {(rec.courseModule?.title || rec.liveClass?.courseModule?.title)}
                              </span>
                            )}
                            {(rec.lesson || rec.liveClass?.lesson) && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 w-fit">
                                L: {(rec.lesson?.title || rec.liveClass?.lesson?.title)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted flex items-center gap-1.5 pt-6">
                      <Clock className="w-3.5 h-3.5" /> {rec.duration || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-text-muted font-medium">
                      -
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={getStatusColor(rec.isPublished ? 'Published' : 'Draft')}>
                        {rec.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/recordings/${rec._id}`)} 
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-brand-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-text-muted">Loading recordings...</div>
          ) : filteredRecordings.map((rec) => (
            <div key={rec._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => navigate(`/recordings/${rec._id}`)}>
              {/* Thumbnail Area */}
              <div className="relative aspect-video bg-gray-100 border-b border-gray-100 flex items-center justify-center">
                {/* Mock Thumbnail Image */}
                <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors"></div>
                <div onClick={(e) => { e.stopPropagation(); setSelectedVideo(rec); }}>
                  <PlayCircle className="w-12 h-12 text-brand-primary/50 group-hover:text-brand-primary transition-colors z-10" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm z-10">
                  {rec.duration}
                </div>
                <div className="absolute top-2 left-2 z-10">
                  <Badge status={getStatusColor(rec.isPublished ? 'Published' : 'Draft')}>{rec.isPublished ? 'Published' : 'Draft'}</Badge>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-4 border-t-2 border-transparent group-hover:border-brand-accent transition-colors">
                <h3 className="font-bold text-text-main text-sm line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors">
                  {rec.title}
                </h3>
                <p className="text-xs text-text-muted mb-3">{rec.course?.title || 'General'}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                  <span className="truncate max-w-[120px]">{rec.faculty?.name || 'Unassigned'}</span>
                  <span>- views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              {selectedVideo.videoUrl ? (
                <video 
                  controls 
                  autoPlay 
                  className="w-full h-full outline-none"
                  src={selectedVideo.videoUrl.startsWith('http') ? selectedVideo.videoUrl : `${baseUrl}${selectedVideo.videoUrl}`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-center text-white/50">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No video URL provided.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <span className="text-text-muted">Course: <span className="font-medium text-text-main">{selectedVideo.course?.title || 'General'}</span></span>
              </div>
              <button onClick={() => navigate(`/recordings/${selectedVideo._id}`)} className="text-brand-primary font-medium hover:underline">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
        entityName="Recordings" 
      />
    </div>
  );
}
