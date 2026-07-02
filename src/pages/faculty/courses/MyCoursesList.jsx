import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, BarChart2, Clock, 
  Search, Filter, PlayCircle, FolderOpen
} from 'lucide-react';
import FacultyStatsWidget from '../../../components/cards/FacultyStatsWidget';
import { getCourses } from '../../../services/courseService';

export default function MyCoursesList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      // For now, assume all courses belong to the current faculty
      setCourses(res.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">My Courses</h1>
        <p className="text-[#60738A] text-sm">Manage assigned courses, monitor student progress, update learning materials, and track course performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <FacultyStatsWidget title="Total Courses" value="12" icon={BookOpen} color="bg-blue-100 text-blue-600" />
        <FacultyStatsWidget title="Total Students" value="4,540" icon={Users} color="bg-indigo-100 text-indigo-600" trend="up" trendValue="5%" />
        <FacultyStatsWidget title="Avg Completion" value="65%" icon={BarChart2} color="bg-emerald-100 text-emerald-600" trend="up" trendValue="2%" />
        <FacultyStatsWidget title="Learning Hours" value="12.5k" icon={Clock} color="bg-purple-100 text-purple-600" />
        <FacultyStatsWidget title="Active Courses" value="8" icon={PlayCircle} color="bg-amber-100 text-amber-600" />
        <FacultyStatsWidget title="Published Lessons" value="142" icon={FolderOpen} color="bg-cyan-100 text-cyan-600" />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text"
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:border-transparent outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-[#60738A] hover:bg-gray-100 transition-colors shrink-0">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-[#60738A] outline-none focus:ring-2 focus:ring-[#C89B3C]">
            <option value="all">All Categories</option>
            <option value="radiology">Radiology Imaging</option>
            <option value="exam">Exam Prep</option>
            <option value="anatomy">Anatomy</option>
          </select>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-[#60738A] outline-none focus:ring-2 focus:ring-[#C89B3C]">
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Course List */}
      {isLoading ? (
        <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B1F4D]"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                <span className="text-4xl text-gray-300">Image</span>
                <div className="absolute top-3 right-3 flex gap-2">
                  {course.status === 'Published' && <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Published</span>}
                  {course.status === 'Draft' && <span className="px-2.5 py-1 bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Draft</span>}
                  {course.status === 'Archived' && <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">Archived</span>}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold text-[#C89B3C] mb-2 uppercase tracking-wide">{course.category}</div>
                <h3 className="text-lg font-bold text-[#0B1F4D] mb-4 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">{course.title}</h3>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-[#60738A]">
                      <Users className="w-4 h-4" /> 0
                    </div>
                    <div className="flex items-center gap-1.5 text-[#60738A]">
                      <BarChart2 className="w-4 h-4" /> 0%
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-[#0B1F4D] h-1.5 rounded-full" style={{ width: `0%` }}></div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex gap-2">
                <button 
                  onClick={() => navigate(`/faculty-dashboard/courses/${course._id}`)}
                  className="flex-1 bg-[#0B1F4D] hover:bg-[#15347B] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Manage
                </button>
                <button 
                  onClick={() => navigate(`/faculty-dashboard/courses/${course._id}/notes`)}
                  className="px-3 py-2 bg-white border border-gray-200 text-[#60738A] hover:text-[#0B1F4D] hover:border-[#0B1F4D] rounded-lg transition-colors"
                  title="Upload Notes"
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
