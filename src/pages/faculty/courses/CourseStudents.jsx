import React, { useState } from 'react';
import { Search, Filter, MoreVertical, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const mockStudents = [
  { id: 'S101', name: 'Dr. Emma Watson', email: 'emma.w@hospital.org', date: 'Oct 24, 2026', progress: 100, status: 'Completed' },
  { id: 'S102', name: 'Dr. Michael Chen', email: 'm.chen@clinic.com', date: 'Oct 22, 2026', progress: 75, status: 'Active' },
  { id: 'S103', name: 'Sarah Jenkins, Tech', email: 's.jenkins@imaging.net', date: 'Oct 15, 2026', progress: 45, status: 'Active' },
  { id: 'S104', name: 'Dr. Robert Patel', email: 'r.patel@med.edu', date: 'Oct 10, 2026', progress: 0, status: 'Inactive' },
  { id: 'S105', name: 'Lisa Kumar', email: 'lkumar@health.org', date: 'Sep 28, 2026', progress: 92, status: 'Active' },
];

export default function CourseStudents() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total Students" value="1,250" icon={Users} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Active Students" value="840" icon={CheckCircle} color="bg-emerald-100 text-emerald-600" />
        <FacultyStatsWidget title="Completed" value="320" icon={Star} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Inactive" value="90" icon={XCircle} color="bg-red-100 text-red-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="text-xl font-bold text-[#0B1F4D]">Course Students</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search students..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] outline-none"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-[#60738A] hover:bg-gray-100 transition-colors shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[#60738A]">
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">Enrollment Date</th>
                <th className="py-4 px-6 font-semibold">Progress</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B1F4D] to-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {student.name.charAt(0)}{student.name.split(' ')[1]?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A] group-hover:text-[#0B1F4D] transition-colors">{student.name}</p>
                        <p className="text-xs text-[#60738A]">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#60738A] font-medium">{student.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${student.progress === 100 ? 'bg-emerald-500' : 'bg-[#C89B3C]'}`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-[#1A1A1A]">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {student.status === 'Completed' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle className="w-3.5 h-3.5" /> Completed</span>}
                    {student.status === 'Active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700"><Clock className="w-3.5 h-3.5" /> Active</span>}
                    {student.status === 'Inactive' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700"><AlertCircle className="w-3.5 h-3.5" /> Inactive</span>}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-[#C89B3C] font-semibold hover:text-[#0B1F4D] text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-[#60738A]">
          <p>Showing <span className="font-bold text-[#1A1A1A]">1</span> to <span className="font-bold text-[#1A1A1A]">5</span> of <span className="font-bold text-[#1A1A1A]">1,250</span> students</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 bg-[#0B1F4D] text-white">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add the missing imports for the above components inside CourseStudents
import { Users, Star } from 'lucide-react';
