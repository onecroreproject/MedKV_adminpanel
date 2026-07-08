import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, MoreVertical, Search, Filter, BookOpen, Users, DollarSign, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getCourses, deleteCourse } from '../../services/courseService';
import { getCategories } from '../../services/categoryService';

export default function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };


  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };


  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || course.status?.toLowerCase() === statusFilter.toLowerCase();
    const catString = course.category?.name || course.category;
    const matchesCat = !categoryFilter || catString?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCat;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Unpublished': return 'danger';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Course Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage educational programs, modules, and publishing status.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/courses/add')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Create Course
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Courses by Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Faculty</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm border border-brand-primary/20 shrink-0">
                          {course.title ? course.title.substring(0, 2).toUpperCase() : 'CO'}
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                          >
                            {course.title}
                          </button>
                          <p className="text-xs text-text-muted mt-0.5">ID: {course._id.substring(course._id.length - 6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                        {course.category?.name || course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{course.instructor?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 font-medium text-text-main">
                      {course.originalPrice && <span className="text-gray-400 line-through text-xs mr-2">₹{course.originalPrice}</span>}
                      ₹{course.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Users className="w-4 h-4" />
                        {0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={getStatusColor(course.status)}>{course.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/courses/${course._id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-primary transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/courses/${course._id}/curriculum`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-primary transition-colors"
                          title="Curriculum"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course._id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
