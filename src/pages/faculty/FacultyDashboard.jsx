import React from 'react';
import { 
  BookOpen, Video, Film, HelpCircle, FolderOpen, 
  Stethoscope, Activity, ShieldCheck, Clock, CheckCircle,
  PlusCircle, FileText, ChevronRight, TrendingUp, Users, Star
} from 'lucide-react';
import FacultyStatsWidget from '../../components/cards/FacultyStatsWidget';
import { 
  StudentEngagementChart, 
  CoursePerformanceChart, 
  ContentContributionsChart 
} from '../../components/charts/FacultyAnalyticsCharts';

const facultyStats = [
  { title: 'My Courses', value: '12', icon: BookOpen, color: 'bg-blue-100 text-blue-600', trend: 'up', trendValue: '2' },
  { title: 'Live Classes', value: '8', icon: Video, color: 'bg-indigo-100 text-indigo-600' },
  { title: 'Recorded Sessions', value: '56', icon: Film, color: 'bg-purple-100 text-purple-600', trend: 'up', trendValue: '5' },
  { title: 'MCQs Created', value: '1,250', icon: HelpCircle, color: 'bg-emerald-100 text-emerald-600', trend: 'up', trendValue: '120' },
  { title: 'Cases Uploaded', value: '320', icon: FolderOpen, color: 'bg-amber-100 text-amber-600' },
  { title: 'Pathology Topics', value: '145', icon: Stethoscope, color: 'bg-rose-100 text-rose-600' },
  { title: 'Anatomy Modules', value: '98', icon: Activity, color: 'bg-cyan-100 text-cyan-600' },
  { title: 'Pending Approvals', value: '12', icon: ShieldCheck, color: 'bg-orange-100 text-orange-600', statusBadge: 'Pending Review' },
];

const quickActions = [
  { title: 'Create New MCQ', icon: HelpCircle, desc: 'Add to question bank' },
  { title: 'Upload Radiology Case', icon: FolderOpen, desc: 'Add DICOM/Images' },
  { title: 'Add Anatomy Content', icon: Activity, desc: 'Create new module' },
  { title: 'Add Pathology Content', icon: Stethoscope, desc: 'Upload pathology topic' },
  { title: 'Upload Recording', icon: Film, desc: 'Share past sessions' },
  { title: 'Schedule Live Class', icon: Video, desc: 'Setup Zoom/Meet' },
];

export default function FacultyDashboard() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1F4D] to-[#15347B] rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B3C] rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold tracking-wider uppercase text-blue-100">
                Senior Radiologist
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Active Status
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Welcome Back, Dr. Jenkins 👋</h1>
            <p className="text-blue-100 text-sm md:text-base max-w-2xl leading-relaxed">
              Manage your courses, educational content, and student engagement activities from one centralized workspace.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-semibold text-lg">{currentDate}</p>
            <p className="text-blue-200 text-sm mt-1">Ready for your 10:00 AM class?</p>
            <button className="mt-4 bg-[#C89B3C] hover:bg-[#D4A94A] text-[#0B1F4D] px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#C89B3C]/20 flex items-center gap-2 w-full md:w-auto justify-center">
              <Video className="w-4 h-4" /> Join Live Class
            </button>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Statistics Widgets */}
      <div>
        <h2 className="text-xl font-bold text-[#0B1F4D] mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#C89B3C]" /> Overview Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {facultyStats.map((stat, idx) => (
            <FacultyStatsWidget key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* 3. Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentEngagementChart />
        </div>
        <div className="lg:col-span-1">
          <ContentContributionsChart />
        </div>
      </div>

      {/* 4. Complex Grid Section (Performance, Quick Actions, Lists) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <CoursePerformanceChart />
          
          {/* Quick Actions Grid */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-[#C89B3C] hover:shadow-md bg-gray-50/50 hover:bg-white transition-all group text-center">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#C89B3C] group-hover:text-[#C89B3C] transition-colors shadow-sm">
                      <Icon className="w-5 h-5 text-[#60738A] group-hover:text-[#C89B3C]" />
                    </div>
                    <span className="font-semibold text-sm text-[#1A1A1A] group-hover:text-[#0B1F4D]">{action.title}</span>
                    <span className="text-[11px] text-[#60738A] mt-1">{action.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pending Approval Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#0B1F4D]">Content Awaiting Review</h3>
              <button className="text-sm font-semibold text-[#C89B3C] hover:text-[#0B1F4D] transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-text-muted">
                    <th className="pb-3 font-medium">Content Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Date Submitted</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="group">
                    <td className="py-3 font-medium text-[#1A1A1A]">Advanced MRI Brain Protocols</td>
                    <td className="py-3 text-[#60738A]">Radiology Case</td>
                    <td className="py-3 text-[#60738A]">Oct 24, 2026</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                        Pending Review
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[#C89B3C] font-semibold hover:text-[#0B1F4D]">View</button>
                    </td>
                  </tr>
                  <tr className="group">
                    <td className="py-3 font-medium text-[#1A1A1A]">Thoracic Anatomy Quiz 3</td>
                    <td className="py-3 text-[#60738A]">MCQ Module</td>
                    <td className="py-3 text-[#60738A]">Oct 22, 2026</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                        Changes Requested
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[#C89B3C] font-semibold hover:text-[#0B1F4D]">Review</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          
          {/* Faculty Performance Summary */}
          <div className="bg-[#0B1F4D] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-[#15347B]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C89B3C] rounded-full filter blur-[50px] opacity-20"></div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#C89B3C]" fill="currentColor" /> Performance Impact
            </h3>
            <div className="space-y-5 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-blue-200">Total Student Reach</span>
                  <span className="font-bold text-white">4,250</span>
                </div>
                <div className="w-full bg-[#15347B] rounded-full h-1.5">
                  <div className="bg-[#C89B3C] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-blue-200">Avg Course Rating</span>
                  <span className="font-bold text-white">4.8 / 5.0</span>
                </div>
                <div className="w-full bg-[#15347B] rounded-full h-1.5">
                  <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#15347B] flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Total Created</p>
                  <p className="text-xl font-bold mt-1">1,800+ Items</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#15347B] flex items-center justify-center border border-[#1C3E8A]">
                  <TrendingUp className="w-5 h-5 text-[#C89B3C]" />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Live Classes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-[#0B1F4D]">Upcoming Sessions</h3>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <PlusCircle className="w-5 h-5 text-[#C89B3C]" />
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#C89B3C]/50 hover:shadow-sm transition-all group">
                  <div className="bg-white border border-gray-200 rounded-xl p-2.5 flex flex-col items-center justify-center min-w-[56px] shadow-sm group-hover:border-[#C89B3C]">
                    <span className="text-[10px] font-bold text-[#60738A] uppercase">Oct</span>
                    <span className="text-lg font-black text-[#0B1F4D] leading-none mt-1">2{i}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1A1A1A] text-sm group-hover:text-[#0B1F4D]">FRCR Physics Revision Part {i}</h4>
                    <p className="text-xs text-[#60738A] mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> 10:00 AM - 12:00 PM
                    </p>
                    <button className="mt-2 text-xs font-semibold text-[#C89B3C] flex items-center hover:text-[#0B1F4D]">
                      Start Session <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-5">Recent Activity</h3>
            <div className="space-y-0">
              <div className="flex gap-4 relative">
                <div className="absolute left-[15px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="pb-5">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Created 50 new MCQs</p>
                  <p className="text-xs text-[#60738A] mt-1">Module: Thoracic Anatomy</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2 block">2 hours ago</span>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="absolute left-[15px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
                <div className="pb-5">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Completed Live Session</p>
                  <p className="text-xs text-[#60738A] mt-1">Course: FRCR Part 1</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2 block">Yesterday</span>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Uploaded 12 DICOM Cases</p>
                  <p className="text-xs text-[#60738A] mt-1">Library: Neuro Imaging</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2 block">Oct 21, 2026</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
