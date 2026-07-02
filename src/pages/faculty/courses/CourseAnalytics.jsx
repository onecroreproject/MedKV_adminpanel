import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const completionData = [
  { name: 'Week 1', completion: 15 },
  { name: 'Week 2', completion: 28 },
  { name: 'Week 3', completion: 45 },
  { name: 'Week 4', completion: 62 },
  { name: 'Week 5', completion: 78 },
  { name: 'Week 6', completion: 85 },
];

const activityData = [
  { name: 'Mon', hours: 120 },
  { name: 'Tue', hours: 150 },
  { name: 'Wed', hours: 210 },
  { name: 'Thu', hours: 180 },
  { name: 'Fri', hours: 240 },
  { name: 'Sat', hours: 320 },
  { name: 'Sun', hours: 290 },
];

export default function CourseAnalytics() {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Course Completion Analytics */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#0B1F4D]">Course Completion Trend</h3>
            <p className="text-xs text-[#60738A] mt-1">Cumulative completion percentage over time</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" name="Completion %" dataKey="completion" stroke="#0B1F4D" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Activity Graph */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#0B1F4D]">Learning Activity</h3>
            <p className="text-xs text-[#60738A] mt-1">Total learning hours spent by students this week</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar name="Learning Hours" dataKey="hours" fill="#C89B3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
