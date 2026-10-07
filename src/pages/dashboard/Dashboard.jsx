import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/dashboardService';
import DashboardStats from '../../components/cards/DashboardStats';
import { 
  Users, UserCheck, BookOpen, Repeat, CreditCard, Calendar, 
  UserPlus, ShieldCheck, HelpCircle, FolderOpen, Activity, 
  BarChart2, Server, CheckCircle, Clock
} from 'lucide-react';
import { 
  StudentGrowthChart, 
  RevenueAnalyticsChart, 
  CourseEnrollmentChart 
} from '../../components/charts/AnalyticsCharts';
import RecentEnrollmentsTable from '../../components/tables/RecentEnrollmentsTable';

const STATS_CONFIG = [
  { key: 'totalStudents', title: 'Total Students', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'totalFaculty', title: 'Total Faculty', icon: UserCheck, color: 'bg-indigo-100 text-indigo-600' },
  { key: 'totalCourses', title: 'Total Courses', icon: BookOpen, color: 'bg-emerald-100 text-emerald-600' },
  { key: 'activeSubscriptions', title: 'Active Subscriptions', icon: Repeat, color: 'bg-purple-100 text-purple-600' },
  { key: 'totalRevenue', title: 'Total Revenue', icon: CreditCard, color: 'bg-amber-100 text-amber-600', isCurrency: true },
  { key: 'upcomingLiveClassesCount', title: 'Upcoming Live Classes', icon: Calendar, color: 'bg-rose-100 text-rose-600' },
  { key: 'recentEnrollments', title: 'Recent Enrollments', icon: UserPlus, color: 'bg-cyan-100 text-cyan-600' },
  { key: 'pendingApprovals', title: 'Pending Approvals', icon: ShieldCheck, color: 'bg-orange-100 text-orange-600' },
  { key: 'totalMCQs', title: 'Total MCQs', icon: HelpCircle, color: 'bg-fuchsia-100 text-fuchsia-600' },
  { key: 'casesUploaded', title: 'Cases Uploaded', icon: FolderOpen, color: 'bg-teal-100 text-teal-600' },
  { key: 'dailyActiveLearners', title: 'Daily Active Learners', icon: Activity, color: 'bg-brand-primary/10 text-brand-primary' },
  { key: 'platformStatus', title: 'Platform Status', icon: BarChart2, color: 'bg-status-success/10 text-status-success', defaultStr: 'Healthy' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary mb-1">Welcome Back, Admin 👋</h1>
          <p className="text-text-muted text-sm max-w-2xl">
            Monitor platform performance, manage educational content, track student engagement, and oversee academy operations.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="hidden md:block text-right">
            <p className="font-medium text-text-main">{currentDate}</p>
            <p className="text-text-muted">System Status: <span className="text-status-success font-medium">All systems operational</span></p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 font-medium">Loading Dashboard Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STATS_CONFIG.map((config, idx) => {
            const rawValue = data ? data[config.key] : 0;
            let displayValue = config.defaultStr || rawValue || 0;
            if (config.isCurrency) {
              displayValue = '₹' + displayValue.toLocaleString();
            } else if (typeof displayValue === 'number') {
              displayValue = displayValue.toLocaleString();
            }
            return (
              <DashboardStats 
                key={idx} 
                title={config.title} 
                value={String(displayValue)} 
                icon={config.icon} 
                iconColor={config.color} 
              />
            );
          })}
        </div>
      )}

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentGrowthChart data={data?.studentGrowthData} />
        <RevenueAnalyticsChart data={data?.revenueData} />
      </div>

      {/* Middle Row: Course Enrollment & Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CourseEnrollmentChart data={data?.topCourses} />
        </div>
        
        <div className="lg:col-span-1">
          {/* Upcoming Classes */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-text-main">Upcoming Live Classes</h3>
              <button className="text-brand-primary text-sm font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {data && data.upcomingClasses && data.upcomingClasses.length > 0 ? (
                data.upcomingClasses.map((cls, idx) => {
                  const d = new Date(cls.date);
                  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  const dateNum = d.getDate();
                  return (
                    <div key={idx} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <div className="bg-brand-primary/10 text-brand-primary rounded-lg p-3 flex flex-col items-center justify-center min-w-[60px]">
                        <span className="text-xs font-bold">{month}</span>
                        <span className="text-lg font-black leading-none">{dateNum}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">{cls.title}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{cls.faculty ? cls.faculty.name : 'TBA'}</p>
                        <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {cls.time} - {cls.duration} min
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center border border-dashed rounded-lg">
                  No upcoming classes
                </div>
              )}
            </div>
            <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors">
              Schedule New Class
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Enrollments (Full Width) */}
      <div className="w-full">
        <RecentEnrollmentsTable data={data?.recentEnrollmentsList} />
      </div>
    </div>
  );
}
