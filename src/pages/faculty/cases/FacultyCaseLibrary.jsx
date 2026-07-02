import React from 'react';
import { FolderOpen, Plus, FileText, Activity, Layers, Edit2, ShieldCheck, Eye, Trash2 } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockCases = [
  { id: 1, title: 'Acute Subdural Hematoma', diagnosis: 'Traumatic Brain Injury', type: 'CT Scan', difficulty: 'Beginner', status: 'Approved', date: 'Oct 20, 2026' },
  { id: 2, title: 'Pulmonary Embolism with Right Heart Strain', diagnosis: 'Pulmonary Embolism', type: 'CTPA', difficulty: 'Advanced', status: 'Pending Approval', date: 'Oct 22, 2026' },
  { id: 3, title: 'Hepatocellular Carcinoma', diagnosis: 'Liver Mass', type: 'MRI', difficulty: 'Intermediate', status: 'Draft', date: 'Oct 24, 2026' },
];

export default function FacultyCaseLibrary() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Case Library</h1>
          <p className="text-[#60738A] text-sm">Create and manage your radiology case studies.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C89B3C]" /> Create Case
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total Cases" value="320" icon={FolderOpen} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Approved" value="295" icon={ShieldCheck} color="bg-emerald-100 text-emerald-600" />
        <FacultyStatsWidget title="Pending Review" value="12" icon={Activity} color="bg-orange-100 text-orange-600" />
        <FacultyStatsWidget title="Drafts" value="13" icon={FileText} color="bg-gray-100 text-gray-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0B1F4D]">My Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-[#60738A]">
                <th className="py-4 px-6 font-semibold">Case Title & Diagnosis</th>
                <th className="py-4 px-6 font-semibold">Modality</th>
                <th className="py-4 px-6 font-semibold">Difficulty</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#1A1A1A]">{c.title}</p>
                    <p className="text-xs text-[#60738A] mt-0.5">{c.diagnosis}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                      <Layers className="w-3.5 h-3.5" /> {c.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {c.difficulty === 'Beginner' && <span className="text-emerald-600 font-semibold text-xs">Beginner</span>}
                    {c.difficulty === 'Intermediate' && <span className="text-blue-600 font-semibold text-xs">Intermediate</span>}
                    {c.difficulty === 'Advanced' && <span className="text-purple-600 font-semibold text-xs">Advanced</span>}
                  </td>
                  <td className="py-4 px-6">
                    {c.status === 'Approved' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">Approved</span>}
                    {c.status === 'Pending Approval' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">Pending</span>}
                    {c.status === 'Draft' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">Draft</span>}
                  </td>
                  <td className="py-4 px-6 text-[#60738A] font-medium">{c.date}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="Edit Case">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="View Case">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 hover:border-red-200 transition-colors" title="Delete Case">
                        <Trash2 className="w-3.5 h-3.5" />
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
