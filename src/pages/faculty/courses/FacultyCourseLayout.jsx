import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Layers, Users, 
  BarChart2, FileUp, Star, Clock, MoreVertical
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getCourseById } from '../../../services/courseService';

export default function FacultyCourseLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await getCourseById(id);
      setCourse(res.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const tabs = [
    { name: 'Overview', path: '.', icon: BookOpen },
    { name: 'Curriculum', path: 'curriculum', icon: Layers },
    { name: 'Students', path: 'students', icon: Users },
    { name: 'Analytics', path: 'analytics', icon: BarChart2 },
    { name: 'Upload Notes', path: 'notes', icon: FileUp },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Course Header Banner */}
      {isLoading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1F4D]"></div></div>
      ) : !course ? (
        <div className="flex justify-center p-10 text-gray-500">Course not found.</div>
      ) : (
      <>
      <div className="bg-[#0B1F4D] px-6 sm:px-10 py-8 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B3C] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/faculty-dashboard/courses')}
            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Courses
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded text-xs font-semibold tracking-wide uppercase text-blue-100">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
                  Active
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-blue-100 text-sm max-w-2xl leading-relaxed mb-6">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-200 font-medium">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#C89B3C]" fill="currentColor" />
                  <span className="text-white">5.0</span>
                  <span>(0 reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C89B3C]" />
                  <span className="text-white">0</span>
                  <span>Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C89B3C]" />
                  <span className="text-white">Self-paced</span>
                  <span>Content</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center">
                Preview Course
              </button>
              <button className="bg-[#C89B3C] hover:bg-[#D4A94A] text-[#0B1F4D] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg flex items-center justify-center">
                Publish Updates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <nav className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  end={tab.path === '.'}
                  className={({ isActive }) => twMerge(
                    clsx(
                      "flex items-center gap-2 py-4 px-2 sm:px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors",
                      isActive 
                        ? "border-[#C89B3C] text-[#0B1F4D]" 
                        : "border-transparent text-[#60738A] hover:text-[#0B1F4D] hover:border-gray-300"
                    )
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx("w-4 h-4", isActive ? "text-[#C89B3C]" : "")} />
                      {tab.name}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-8">
          <Outlet context={{ course }} />
        </div>
      </div>
      </>
      )}
    </div>
  );
}
