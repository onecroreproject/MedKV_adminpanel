import React from 'react';
import { Video, Calendar, Users, Play, Upload, CheckCircle, Clock, Eye, Edit2, Trash2 } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockClasses = [
  { id: 1, title: 'FRCR Part 1 Physics Revision', course: 'Physics Masterclass', date: 'Oct 24, 2026', time: '10:00 AM - 12:00 PM', status: 'Ongoing', attendees: 145 },
  { id: 2, title: 'MRI Safety Guidelines', course: 'Advanced MRI', date: 'Oct 25, 2026', time: '02:00 PM - 03:30 PM', status: 'Upcoming', attendees: 0 },
  { id: 3, title: 'Basic Ultrasound Techniques', course: 'Ultrasound Basics', date: 'Oct 22, 2026', time: '09:00 AM - 11:00 AM', status: 'Completed', attendees: 210 },
];

export default function FacultyLiveClasses() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Live Classes</h1>
          <p className="text-[#60738A] text-sm">Schedule, manage, and conduct your live sessions.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C89B3C]" /> Schedule Class
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FacultyStatsWidget title="Total Classes" value="124" icon={Video} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Upcoming Sessions" value="8" icon={Calendar} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Avg. Attendance" value="85%" icon={Users} color="bg-emerald-100 text-emerald-600" trend="up" trendValue="5%" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0B1F4D]">Class Schedule</h2>
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
              {mockClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#1A1A1A]">{cls.title}</p>
                    <p className="text-xs text-[#60738A] mt-0.5">{cls.course}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-[#1A1A1A]">{cls.date}</p>
                    <p className="text-xs text-[#60738A] mt-0.5">{cls.time}</p>
                  </td>
                  <td className="py-4 px-6">
                    {cls.status === 'Ongoing' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700 animate-pulse"><Play className="w-3 h-3" fill="currentColor" /> Ongoing</span>}
                    {cls.status === 'Upcoming' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700"><Clock className="w-3.5 h-3.5" /> Upcoming</span>}
                    {cls.status === 'Completed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#1A1A1A]">{cls.attendees > 0 ? cls.attendees : '-'}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      {cls.status === 'Upcoming' || cls.status === 'Ongoing' ? (
                        <button className="px-3 py-1.5 bg-[#C89B3C] text-[#0B1F4D] text-xs font-bold rounded-lg hover:bg-[#D4A94A] transition-colors">
                          Start Session
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-gray-100 text-[#60738A] text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5" /> Recording
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#0B1F4D] transition-colors" title="View Session">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors" title="Edit Session">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors" title="Delete Session">
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
    </div>
  );
}
