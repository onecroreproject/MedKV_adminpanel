import React, { useState, useEffect } from 'react';
import { Video, Calendar, Users, Play, Upload, CheckCircle, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';
import { getLiveClasses, updateLiveClass, deleteLiveClass } from '../../../services/liveClassService';

export default function FacultyLiveClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getLiveClasses();
      const list = res?.data || res || [];
      setClasses(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch faculty live classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleStartSession = async (cls) => {
    try {
      if (cls.status !== 'Live Now') {
        await updateLiveClass(cls._id, { status: 'Live Now' });
        fetchClasses();
      }
      if (cls.meetingProvider === 'zoom') {
        const url = cls.zoomStartUrl || cls.zoomLink;
        if (url) {
          window.open(url, '_blank');
        } else {
          alert('No Zoom link configured for this class.');
        }
      } else {
        const classroomBase = import.meta.env.VITE_CLASSROOM_URL || 'https://www.drsamreefathradiologyacademy.com';
        const token = localStorage.getItem('token');
        const url = `${classroomBase}/classroom/${cls._id}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Failed to start session:', err);
      alert('Could not start live session.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this live class?')) {
      try {
        await deleteLiveClass(id);
        fetchClasses();
      } catch (err) {
        console.error('Failed to delete live class:', err);
      }
    }
  };

  const totalClasses = classes.length;
  const upcomingCount = classes.filter(c => c.status === 'Scheduled').length;
  const activeCount = classes.filter(c => c.status === 'Live Now').length;

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Live Classes</h1>
          <p className="text-[#60738A] text-sm">Schedule, manage, and conduct your live sessions.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/admin/live-classes'}
          className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#C89B3C]" /> Schedule Class
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FacultyStatsWidget title="Total Classes" value={String(totalClasses)} icon={Video} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Upcoming Sessions" value={String(upcomingCount)} icon={Calendar} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Active Sessions" value={String(activeCount)} icon={Users} color="bg-emerald-100 text-emerald-600" trend="up" trendValue={activeCount > 0 ? "Live" : "Idle"} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0B1F4D]">Class Schedule</h2>
          <button onClick={fetchClasses} className="text-xs text-[#0B1F4D] hover:underline font-medium">
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-[#60738A]">
                <th className="py-4 px-6 font-semibold">Session Details</th>
                <th className="py-4 px-6 font-semibold">Date & Time</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Attendees</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#60738A]">Loading live classes...</td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#60738A]">No live classes scheduled yet.</td>
                </tr>
              ) : (
                classes.map((cls) => {
                  const dateStr = cls.date ? new Date(cls.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD';
                  const timeStr = cls.time || 'TBD';
                  const isLive = cls.status === 'Live Now';
                  const isScheduled = cls.status === 'Scheduled';
                  const isCompleted = cls.status === 'Completed';

                  return (
                    <tr key={cls._id || cls.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#1A1A1A]">{cls.title}</p>
                        <p className="text-xs text-[#60738A] mt-0.5">{cls.course?.title || cls.courseName || 'General Classroom'}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-[#1A1A1A]">{dateStr}</p>
                        <p className="text-xs text-[#60738A] mt-0.5">{timeStr}</p>
                      </td>
                      <td className="py-4 px-6">
                        {isLive && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 animate-pulse">
                            <Play className="w-3 h-3" fill="currentColor" /> Live Now
                          </span>
                        )}
                        {isScheduled && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">
                            <Clock className="w-3.5 h-3.5" /> Scheduled
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium text-[#1A1A1A]">
                        {cls.liveParticipants > 0 ? cls.liveParticipants : '-'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {isScheduled || isLive ? (
                            <button 
                              onClick={() => handleStartSession(cls)}
                              className="px-3 py-1.5 bg-[#C89B3C] text-[#0B1F4D] text-xs font-bold rounded-lg hover:bg-[#D4A94A] transition-colors cursor-pointer"
                            >
                              {isLive ? 'Join Now' : 'Start Session'}
                            </button>
                          ) : (
                            <button 
                              onClick={() => window.location.href = `/admin/recordings`}
                              className="px-3 py-1.5 bg-gray-100 text-[#60738A] text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" /> Recording
                            </button>
                          )}
                          <button 
                            onClick={() => window.location.href = `/admin/live-classes/${cls._id}`}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#0B1F4D] transition-colors cursor-pointer" 
                            title="View Session"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cls._id)}
                            className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors cursor-pointer" 
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
