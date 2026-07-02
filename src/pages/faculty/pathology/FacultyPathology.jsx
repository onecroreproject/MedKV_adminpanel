import React from 'react';
import { Stethoscope, Plus, FileText, Activity, Layers, Edit2, ShieldCheck, Eye, Trash2 } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockPathology = [
  { id: 1, disease: 'Glioblastoma Multiforme', category: 'Neuro-oncology', findings: 4, diffDx: 3, status: 'Approved', date: 'Oct 18, 2026' },
  { id: 2, disease: 'Idiopathic Pulmonary Fibrosis', category: 'Thoracic', findings: 6, diffDx: 5, status: 'Pending Approval', date: 'Oct 21, 2026' },
];

export default function FacultyPathology() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Pathology Management</h1>
          <p className="text-[#60738A] text-sm">Add diseases, key findings, and differential diagnosis data.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C89B3C]" /> Add Disease
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FacultyStatsWidget title="Total Diseases" value="145" icon={Stethoscope} color="bg-rose-100 text-rose-600" />
        <FacultyStatsWidget title="Approved" value="130" icon={ShieldCheck} color="bg-emerald-100 text-emerald-600" />
        <FacultyStatsWidget title="Pending Review" value="15" icon={Activity} color="bg-orange-100 text-orange-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0B1F4D]">Pathology Database</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-[#60738A]">
                <th className="py-4 px-6 font-semibold">Disease Name</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Details</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPathology.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#1A1A1A]">{p.disease}</p>
                  </td>
                  <td className="py-4 px-6 text-[#60738A] font-medium">{p.category}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#60738A]">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{p.findings} Findings</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">{p.diffDx} Diff Dx</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {p.status === 'Approved' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">Approved</span>}
                    {p.status === 'Pending Approval' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">Pending</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="Edit Pathology">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="View Pathology">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 hover:border-red-200 transition-colors" title="Delete Pathology">
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
