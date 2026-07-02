import React from 'react';
import { Film, UploadCloud, Edit2, Trash2, PlayCircle, Eye } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockRecordings = [
  { id: 1, title: 'Introduction to T1 and T2 Weighted Images', course: 'MRI Basics', views: 1240, date: 'Oct 20, 2026', duration: '1h 15m', thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Artifacts in Ultrasound', course: 'Ultrasound Masterclass', views: 850, date: 'Oct 15, 2026', duration: '45m', thumbnail: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'CT Head Protocols', course: 'CT Imaging', views: 2100, date: 'Oct 10, 2026', duration: '55m', thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80' },
];

export default function FacultyRecordings() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Recorded Sessions</h1>
          <p className="text-[#60738A] text-sm">Upload and manage your course video recordings.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-[#C89B3C]" /> Upload Recording
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total Recordings" value="56" icon={Film} color="bg-purple-100 text-purple-600" />
        <FacultyStatsWidget title="Total Views" value="45.2k" icon={Eye} color="bg-blue-100 text-blue-600" trend="up" trendValue="12%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {mockRecordings.map((rec) => (
          <div key={rec.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative h-48 bg-gray-100 group-cursor-pointer">
              <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                {rec.duration}
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs font-semibold text-[#C89B3C] mb-1">{rec.course}</div>
              <h3 className="font-bold text-[#0B1F4D] text-base leading-tight mb-3 line-clamp-2">{rec.title}</h3>
              <div className="flex items-center justify-between text-sm text-[#60738A] mb-4">
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {rec.views.toLocaleString()} views</span>
                <span>{rec.date}</span>
              </div>
              <div className="flex gap-2 border-t border-gray-100 pt-4">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#0B1F4D] py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
