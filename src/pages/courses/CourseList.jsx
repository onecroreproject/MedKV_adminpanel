import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, MoreVertical, Search, Filter, BookOpen, Users, DollarSign, Edit, Trash2, Eye, Check, Ban } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getCourses, deleteCourse, updateCourse } from '../../services/courseService';
import { getCategories } from '../../services/categoryService';
import { exportToCSV } from '../../utils/exportUtils';
import Pagination from '../../components/common/Pagination';

export default function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [portalsReady, setPortalsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    setPortalsReady(true);
    return () => setPortalsReady(false);
  }, []);

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

  const handleStatusToggle = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: newStatus } : c));
      await updateCourse(courseId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update course status:', error);
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: currentStatus } : c));
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Unpublished': return 'danger';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const handleExport = () => {
    const exportData = filteredCourses.map(course => ({
      title: course.title,
      category: course.category?.name || course.category,
      instructor: course.instructor?.name || 'Unknown',
      price: course.price,
      students: course.studentCount || 0,
      status: course.status,
      createdAt: new Date(course.createdAt).toLocaleDateString()
    }));

    const headers = [
      { label: 'Course Title', key: 'title' },
      { label: 'Category', key: 'category' },
      { label: 'Instructor', key: 'instructor' },
      { label: 'Price', key: 'price' },
      { label: 'Students Enrolled', key: 'students' },
      { label: 'Status', key: 'status' },
      { label: 'Created At', key: 'createdAt' }
    ];
    exportToCSV(exportData, headers, 'courses_export.csv');
  };

  return (
    <div className="space-y-6">

      {portalsReady && document.getElementById('topbar-title-portal') && createPortal(
        <span>Course Management</span>,
        document.getElementById('topbar-title-portal')
      )}


      {portalsReady && document.getElementById('topbar-search-portal') && createPortal(
        <div className="flex-1 min-w-[250px] w-full">
          <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Courses by Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-gray-50"
          />
          </div>
        </div>,
        document.getElementById('topbar-search-portal')
      )}


      {portalsReady && document.getElementById('topbar-actions-portal') && createPortal(
        <>
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/courses/add')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Create Course
          </button>
        </>,
        document.getElementById('topbar-actions-portal')
      )}

      

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          
          {/* Modern Count Badge */}
          <div className="flex items-center w-full md:w-auto justify-end">
            <div className="bg-brand-primary/5 border border-brand-primary/10 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
              <span className="text-text-muted text-sm font-medium">Showing</span>
              <span className="text-brand-primary font-bold text-sm bg-white px-2 py-0.5 rounded border border-brand-primary/20 shadow-sm">{filteredCourses.length}</span>
              <span className="text-text-muted text-sm font-medium">Courses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold text-sm border border-brand-primary/20 uppercase">
                            {course.title ? course.title.substring(0, 2) : 'CO'}
                          </div>
                          {course.status === 'Published' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm" title="Published">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left line-clamp-2 whitespace-normal max-w-[250px]"
                            title={course.title}
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
                    <td className="px-6 py-4 font-medium text-text-main">
                      {course.originalPrice && <span className="text-gray-400 line-through text-xs mr-2">₹{course.originalPrice}</span>}
                      ₹{course.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Users className="w-4 h-4" />
                        {course.studentCount || 0}
                      </div>
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
                          onClick={() => handleStatusToggle(course._id, course.status)}
                          className={`p-2 rounded-lg transition-colors ${course.status === 'Published' ? 'hover:bg-yellow-50 text-yellow-500 hover:text-yellow-600' : 'hover:bg-green-50 text-green-500 hover:text-green-600'}`}
                          title={course.status === 'Published' ? "Unpublish Course" : "Publish Course"}
                        >
                          {course.status === 'Published' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredCourses.length}
        />
      </div>
    </div>
  );
}
