import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const engagementData = [
  { name: 'Mon', activeLearners: 1200, courseViews: 2400 },
  { name: 'Tue', activeLearners: 1350, courseViews: 2800 },
  { name: 'Wed', activeLearners: 1800, courseViews: 3500 },
  { name: 'Thu', activeLearners: 1500, courseViews: 3000 },
  { name: 'Fri', activeLearners: 2100, courseViews: 4200 },
  { name: 'Sat', activeLearners: 2600, courseViews: 5100 },
  { name: 'Sun', activeLearners: 2400, courseViews: 4800 },
];

export function StudentEngagementChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-brand-primary">Student Engagement</h3>
          <p className="text-xs text-text-muted mt-1">Weekly active learners and course interactions</p>
        </div>
        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-brand-accent">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLearners" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B1F4D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0B1F4D" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C89B3C" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C89B3C" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#60738A' }} />
            <Area type="monotone" name="Active Learners" dataKey="activeLearners" stroke="#0B1F4D" strokeWidth={3} fillOpacity={1} fill="url(#colorLearners)" />
            <Area type="monotone" name="Course Views" dataKey="courseViews" stroke="#C89B3C" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const performanceData = [
  { name: 'FRCR Part 1', enrollments: 450, completions: 320 },
  { name: 'MRI Masterclass', enrollments: 380, completions: 290 },
  { name: 'Ultrasound Basic', enrollments: 520, completions: 410 },
  { name: 'CT Protocols', enrollments: 310, completions: 250 },
  { name: 'Neuro Imaging', enrollments: 280, completions: 180 },
];

export function CoursePerformanceChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-brand-primary">Course Performance</h3>
          <p className="text-xs text-text-muted mt-1">Enrollments vs Completions</p>
        </div>
      </div>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#60738A' }} dy={10} interval={0} angle={-35} textAnchor="end" height={60} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#60738A' }} />
            <Tooltip 
              cursor={{ fill: '#F8FAFC' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar name="Enrollments" dataKey="enrollments" fill="#0B1F4D" radius={[4, 4, 0, 0]} />
            <Bar name="Completions" dataKey="completions" fill="#C89B3C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const contributionData = [
  { name: 'MCQs', value: 45, color: '#0B1F4D' },
  { name: 'Cases', value: 30, color: '#C89B3C' },
  { name: 'Anatomy', value: 15, color: '#3B82F6' },
  { name: 'Pathology', value: 10, color: '#10B981' },
];

export function ContentContributionsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col items-center">
      <div className="mb-2 w-full">
        <h3 className="text-lg font-bold text-brand-primary">Content Contributions</h3>
        <p className="text-xs text-text-muted mt-1">Distribution of created materials</p>
      </div>
      <div className="w-full flex-1 min-h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={contributionData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {contributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle" 
              formatter={(value, entry) => <span className="text-xs font-medium text-text-main">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Total Impact</p>
          <p className="text-xl font-bold text-[#0B1F4D]">1,805</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider mb-1">Growth (MoM)</p>
          <p className="text-xl font-bold text-green-500">+12%</p>
        </div>
      </div>
    </div>
  );
}
