import React from 'react';
import { Users, BarChart2, CheckCircle, TrendingUp, Search, Filter } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

const progressData = [
  { name: 'Week 1', avgScore: 65, attendance: 92 },
  { name: 'Week 2', avgScore: 72, attendance: 88 },
  { name: 'Week 3', avgScore: 78, attendance: 90 },
  { name: 'Week 4', avgScore: 84, attendance: 95 },
];

const mockStudents = [
  { id: 'S101', name: 'Dr. Emma Watson', course: 'FRCR Part 1', progress: 100, score: 92, attendance: 98 },
  { id: 'S102', name: 'Dr. Michael Chen', course: 'MRI Safety', progress: 75, score: 85, attendance: 80 },
  { id: 'S103', name: 'Sarah Jenkins', course: 'Ultrasound Basics', progress: 45, score: 78, attendance: 90 },
];

export default function FacultyPerformance() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Student Performance</h1>
        <p className="text-[#60738A] text-sm">Monitor student progress, exam scores, and overall course completion rates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total Students" value="4,540" icon={Users} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Average Score" value="82%" icon={BarChart2} color="bg-emerald-100 text-emerald-600" trend="up" trendValue="4%" />
        <FacultyStatsWidget title="Attendance Rate" value="92%" icon={CheckCircle} color="bg-purple-100 text-purple-600" />
        <FacultyStatsWidget title="Completion Rate" value="68%" icon={TrendingUp} color="bg-amber-100 text-amber-600" trend="up" trendValue="2%" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px] mt-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#0B1F4D]">Performance Trends</h3>
          <p className="text-xs text-[#60738A] mt-1">Average scores vs Attendance over the last 4 weeks</p>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" name="Avg Score %" dataKey="avgScore" stroke="#0B1F4D" strokeWidth={3} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Attendance %" dataKey="attendance" stroke="#C89B3C" strokeWidth={3} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0B1F4D]">Top Performers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50/50 text-[#60738A]">
                <th className="py-4 px-6 font-semibold">Student Name</th>
                <th className="py-4 px-6 font-semibold">Course</th>
                <th className="py-4 px-6 font-semibold">Progress</th>
                <th className="py-4 px-6 font-semibold">Exam Score</th>
                <th className="py-4 px-6 font-semibold">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#1A1A1A]">{student.name}</td>
                  <td className="py-4 px-6 text-[#60738A]">{student.course}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                      </div>
                      <span className="font-semibold">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{student.score}%</td>
                  <td className="py-4 px-6 font-semibold text-[#1A1A1A]">{student.attendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
