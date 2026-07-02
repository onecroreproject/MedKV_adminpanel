import React from 'react';
import { HelpCircle, Plus, FileText, CheckCircle, Clock, Edit2, ShieldCheck, Eye, Trash2 } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockMCQs = [
  { id: 1, question: 'Which MRI sequence is most sensitive for detecting early cerebral ischemia?', type: 'Standard MCQ', course: 'Neuro Imaging', status: 'Approved', date: 'Oct 20, 2026' },
  { id: 2, question: 'Identify the structure marked by the arrow in the following axial CT image.', type: 'Image-Based MCQ', course: 'Thoracic Anatomy', status: 'Pending Approval', date: 'Oct 22, 2026' },
  { id: 3, question: 'A 45-year-old male presents with acute right upper quadrant pain...', type: 'Case-Based MCQ', course: 'Abdominal Ultrasound', status: 'Draft', date: 'Oct 24, 2026' },
];

export default function FacultyMCQBank() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">MCQ Question Bank</h1>
          <p className="text-[#60738A] text-sm">Create and manage multiple-choice questions for exams and quizzes.</p>
        </div>
        <button className="bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#C89B3C]" /> Add Question
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total MCQs" value="1,250" icon={HelpCircle} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Approved" value="1,105" icon={ShieldCheck} color="bg-emerald-100 text-emerald-600" />
        <FacultyStatsWidget title="Pending Review" value="84" icon={Clock} color="bg-orange-100 text-orange-600" />
        <FacultyStatsWidget title="Drafts" value="61" icon={FileText} color="bg-gray-100 text-gray-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0B1F4D]">My Questions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-[#60738A]">
                <th className="py-4 px-6 font-semibold w-1/2">Question Snippet</th>
                <th className="py-4 px-6 font-semibold">Type</th>
                <th className="py-4 px-6 font-semibold">Course</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockMCQs.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-[#1A1A1A] line-clamp-2">{q.question}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-[#0B1F4D] text-xs font-semibold">
                      {q.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#60738A] font-medium">{q.course}</td>
                  <td className="py-4 px-6">
                    {q.status === 'Approved' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">Approved</span>}
                    {q.status === 'Pending Approval' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">Pending</span>}
                    {q.status === 'Draft' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">Draft</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="Edit MCQ">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors" title="View MCQ">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 hover:border-red-200 transition-colors" title="Delete MCQ">
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
