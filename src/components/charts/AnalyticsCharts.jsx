import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Line, ComposedChart, Legend
} from 'recharts';

export function StudentGrowthChart({ data }) {
  // Use passed data or empty fallback
  const chartData = data || [];
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-main">Student Growth Analytics</h3>
        <p className="text-sm text-text-muted">Monthly registrations and active learners</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1F4D" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0B1F4D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="registrations" stroke="#0B1F4D" fillOpacity={1} fill="url(#colorReg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RevenueAnalyticsChart({ data }) {
  // Use passed data or empty fallback
  const chartData = data || [];
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-main">Revenue Analytics Overview</h3>
        <p className="text-sm text-text-muted">Monthly, Subscription, and Course Revenue</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="course" stackId="a" fill="#0B1F4D" radius={[0, 0, 4, 4]} name="Course Rev." />
            <Bar dataKey="subscription" stackId="a" fill="#C89B3C" radius={[4, 4, 0, 0]} name="Subscription Rev." />
            <Line type="monotone" dataKey="total" stroke="#22C55E" strokeWidth={3} name="Total Rev." />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CourseEnrollmentChart({ data }) {
  // Use passed data or empty fallback
  const chartData = data || [];
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text-main">Course Enrollment</h3>
        <p className="text-sm text-text-muted">Top performing courses</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} width={100} />
            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="students" fill="#0B1F4D" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
