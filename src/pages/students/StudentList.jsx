import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, MoreVertical, Search, Filter, Mail, Phone, Calendar, Edit, Trash2, Ban, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getStudents } from '../../services/studentService';
import { getCourses } from '../../services/courseService';
import { exportToCSV } from '../../utils/exportUtils';
import { createPortal } from 'react-dom';

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courses, setCourses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [portalsReady, setPortalsReady] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          getStudents(),
          getCourses()
        ]);
        setStudents(studentsRes.data || []);
        setCourses(coursesRes.data || []);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPortalsReady(true);
    return () => setPortalsReady(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Suspended': return 'danger';
      case 'Expired': return 'danger';
      default: return 'default';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phoneNumber?.includes(searchQuery);
    
    const studentStatus = student.isActive !== false ? 'active' : 'inactive';
    const matchesStatus = 
      !statusFilter ? true
      : statusFilter === 'not-enrolled' ? (!student.enrolledCourses || student.enrolledCourses.length === 0)
      : studentStatus === statusFilter;
    
    const matchesCourse = 
      !courseFilter ? true 
      : student.enrolledCourses?.some(c => c.course && c.course._id === courseFilter);

    const studentDate = new Date(student.createdAt);
    const start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);
    
    const matchesStartDate = !start || studentDate >= start;
    const matchesEndDate = !end || studentDate <= end;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesStartDate && matchesEndDate;
  });

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleExport = () => {
    const exportData = filteredStudents.map(student => ({
      name: student.name || '',
      email: student.email || '',
      phoneNumber: student.phoneNumber || '',
      isActive: student.isActive !== false ? 'Active' : 'Inactive',
      createdAt: new Date(student.createdAt).toLocaleDateString(),
      enrolledCoursesCount: student.enrolledCourses?.length || 0,
      enrolledCoursesNames: student.enrolledCourses?.map(c => c.course?.title).filter(Boolean).join(', ') || '',
      averageProgress: student.enrolledCourses?.length ? 
        Math.round(student.enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / student.enrolledCourses.length) + '%' : '0%'
    }));

    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Phone Number', key: 'phoneNumber' },
      { label: 'Active Status', key: 'isActive' },
      { label: 'Registered Date', key: 'createdAt' },
      { label: 'Enrolled Courses Count', key: 'enrolledCoursesCount' },
      { label: 'Enrolled Courses Names', key: 'enrolledCoursesNames' },
      { label: 'Average Progress', key: 'averageProgress' }
    ];
    exportToCSV(exportData, headers, 'students_export.csv');
  };

  return (
    <div className="space-y-6">
      {portalsReady && document.getElementById('topbar-title-portal') && createPortal(
        <span>Student Management</span>,
        document.getElementById('topbar-title-portal')
      )}

      {portalsReady && document.getElementById('topbar-search-portal') && createPortal(
        <div className="flex-1 min-w-[250px] w-full">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Mobile..." 
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
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors">
            <Plus className="w-4 h-4 text-brand-accent" /> Add Student
          </button>
        </>,
        document.getElementById('topbar-actions-portal')
      )}

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col xl:flex-row gap-4">
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="not-enrolled">Not Enrolled</option>
          </select>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary"
              title="Start Date"
            />
            <span className="text-text-muted text-sm">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary"
              title="End Date"
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto min-h-[350px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Reg. Date</th>
                <th className="px-6 py-4">Courses & Progress</th>
                <th className="px-6 py-4">Account Status</th>
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
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold text-sm border border-brand-primary/20 uppercase">
                          {student.name ? student.name.substring(0, 2) : 'ST'}
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/students/${student._id}`)}
                            className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                          >
                            {student.name || 'Unknown Student'}
                          </button>
                          <p className="text-xs text-text-muted mt-0.5">ID: {student._id.substring(student._id.length - 6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {student.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {student.phoneNumber || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-sm">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium">
                          {student.enrolledCourses?.length || 0} Enrolled
                        </span>
                        {student.enrolledCourses?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                            {student.enrolledCourses.map((c, i) => c.course && (
                              <span key={i} className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full truncate max-w-[180px]">
                                {c.course.title}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5">
                            <div 
                              className="bg-brand-primary h-1.5 rounded-full" 
                              style={{ width: `${student.enrolledCourses?.length ? Math.round(student.enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / student.enrolledCourses.length) : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-text-muted">
                            {student.enrolledCourses?.length ? Math.round(student.enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / student.enrolledCourses.length) : 0}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={student.isActive !== false ? "success" : "warning"}>
                        {student.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/students/${student._id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-brand-primary hover:text-brand-primary/80 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {}}
                          className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-500 hover:text-yellow-600 transition-colors"
                          title="Suspend Student"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {}}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-colors"
                          title="Delete Account"
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
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-text-muted">Showing 1 to {filteredStudents.length} of {students.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-muted hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-sm font-medium">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-main hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-main hover:bg-gray-50">3</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-text-main hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
