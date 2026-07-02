import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, BarChart2, Star, BookOpen, Clock, TrendingUp, CheckCircle, PlusCircle, PlayCircle, FolderOpen } from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';

export default function CourseOverview() {
  const { course } = useOutletContext();

  return (
    <div className="space-y-6">
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FacultyStatsWidget title="Total Students" value="1,250" icon={Users} color="bg-blue-100 text-blue-600" trend="up" trendValue="12%" />
        <FacultyStatsWidget title="Completion Rate" value="68%" icon={CheckCircle} color="bg-emerald-100 text-emerald-600" trend="up" trendValue="4%" />
        <FacultyStatsWidget title="Average Rating" value="4.8" icon={Star} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Total Lessons" value="34" icon={BookOpen} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Performance Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-5 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C89B3C]" /> Course Performance Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#60738A] font-medium">Student Satisfaction Score</span>
                    <span className="font-bold text-[#0B1F4D]">96%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#60738A] font-medium">Engagement Score</span>
                    <span className="font-bold text-[#0B1F4D]">82%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#60738A] font-medium">Completion Score</span>
                    <span className="font-bold text-[#0B1F4D]">68%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#C89B3C] h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-amber-600" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs text-[#60738A] font-semibold uppercase tracking-wider">Highest Rated Lesson</p>
                    <p className="text-sm font-bold text-[#0B1F4D]">Module 2: T1 & T2 Sequencing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <PlayCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[#60738A] font-semibold uppercase tracking-wider">Most Viewed Lesson</p>
                    <p className="text-sm font-bold text-[#0B1F4D]">Module 1: MRI Safety Basics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Course Activities */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-6">Recent Course Activities</h3>
            
            <div className="space-y-0">
              <div className="flex gap-4 relative">
                <div className="absolute left-[15px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-[#1A1A1A]">New Enrollment</p>
                  <p className="text-xs text-[#60738A] mt-1">Dr. Emma Watson enrolled in course</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5 block">10 mins ago</span>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="absolute left-[15px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <FolderOpen className="w-4 h-4 text-amber-600" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Notes Uploaded</p>
                  <p className="text-xs text-[#60738A] mt-1">"MRI Artifacts Guide v2.pdf" added</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5 block">2 hours ago</span>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="absolute left-[15px] top-6 bottom-[-16px] w-px bg-gray-200"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-[#1A1A1A]">Student Completed Lesson</p>
                  <p className="text-xs text-[#60738A] mt-1">5 students completed Module 1</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5 block">Yesterday</span>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <PlusCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">Lesson Updated</p>
                  <p className="text-xs text-[#60738A] mt-1">Module 3 video was replaced</p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1.5 block">Oct 24, 2026</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
