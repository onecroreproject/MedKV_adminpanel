import React from 'react';
import { Activity, Plus, Image as ImageIcon, MapPin, Search } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockAnatomy = [
  { id: 1, title: 'Cranial Nerves (I-VI)', category: 'Neuroanatomy', labels: 24, quizzes: 5, status: 'Approved', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Coronary Arteries', category: 'Cardiovascular', labels: 12, quizzes: 3, status: 'Draft', image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=400&q=80' },
];

export default function FacultyAnatomy() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Anatomy Management</h1>
          <p className="text-[#60738A] text-sm">Upload MRI/CT scans, add labels, and create interactive anatomy quizzes.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C89B3C]" /> Add Content
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FacultyStatsWidget title="Total Modules" value="98" icon={Activity} color="bg-cyan-100 text-cyan-600" />
        <FacultyStatsWidget title="Annotated Labels" value="1,450" icon={MapPin} color="bg-purple-100 text-purple-600" />
        <FacultyStatsWidget title="Linked Quizzes" value="42" icon={HelpCircle} color="bg-blue-100 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {mockAnatomy.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative h-48 bg-gray-100 group-cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3">
                {item.status === 'Approved' && <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Approved</span>}
                {item.status === 'Draft' && <span className="px-2.5 py-1 bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Draft</span>}
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs font-semibold text-[#C89B3C] mb-1">{item.category}</div>
              <h3 className="font-bold text-[#0B1F4D] text-lg leading-tight mb-4 group-hover:text-blue-700 transition-colors">{item.title}</h3>
              
              <div className="flex gap-4 text-sm text-[#60738A] mb-5">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-500" /> {item.labels} Labels</div>
                <div className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-blue-500" /> {item.quizzes} Quizzes</div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#0B1F4D] py-2 rounded-lg text-sm font-semibold transition-colors flex justify-center items-center gap-1.5 border border-gray-200">
                  <ImageIcon className="w-3.5 h-3.5" /> Manage Images
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { HelpCircle } from 'lucide-react';
