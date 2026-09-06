import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, MoreVertical, Search, Filter, Mail, Award, BookOpen, Edit, Trash2, Ban, Upload } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ImportModal from '../../components/common/ImportModal';
import { getFaculty } from '../../services/facultyService';
import { exportToCSV } from '../../utils/exportUtils';

export default function FacultyList() {
  const navigate = useNavigate();
  const [facultyList, setFacultyList] = useState([]);
  const [portalsReady, setPortalsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  
  useEffect(() => {
    setPortalsReady(true);
    return () => setPortalsReady(false);
  }, []);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await getFaculty();
        setFacultyList(response.data || []);
      } catch (err) {
        setError('Failed to fetch faculty.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);


  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Suspended': return 'danger';
      default: return 'default';
    }
  };

  const filteredFaculty = facultyList.filter(faculty => {
    const matchesSearch = !searchQuery || 
      faculty.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const facultyStatus = faculty.isActive !== false ? 'active' : 'inactive';
    const matchesStatus = !statusFilter || facultyStatus === statusFilter;
    
    // Using simple inclusion for spec filter as example
    const matchesSpec = !specFilter || faculty.specialization?.toLowerCase().includes(specFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSpec;
  });


  const handleExport = () => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Email', key: 'email' },
      { label: 'Specialization', key: 'specialization' },
      { label: 'Status', key: 'isActive' }
    ];
    exportToCSV(filteredFaculty, headers, 'faculty_export.csv');
  };

  const handleImport = async (data) => {
    try {
      console.log("Importing faculty: ", data);
      alert(`Successfully simulated import of ${data.length} faculty! Backend endpoint required for real data insertion.`);
    } catch (err) {
      alert("Error importing data");
    }
  };

  return (
    <div className="space-y-6">
      {portalsReady && document.getElementById('topbar-title-portal') && createPortal(
        <span>Faculty Management</span>,
        document.getElementById('topbar-title-portal')
      )}


      {portalsReady && document.getElementById('topbar-search-portal') && createPortal(
        <div className="flex-1 min-w-[250px] w-full">
          <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Faculty by Name or Email..." 
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
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/faculty/add')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Faculty
          </button>
        </>,
        document.getElementById('topbar-actions-portal')
      )}

      

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select 
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Specializations</option>
            <option value="radiophysics">Radiophysics</option>
            <option value="anatomy">Anatomy</option>
            <option value="pathology">Pathology</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> More Filters
          </button>
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
                <th className="px-6 py-4">Faculty Member</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Courses</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No faculty found.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((faculty) => (
                  <tr key={faculty._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold text-sm border border-brand-primary/20 uppercase">
                          {faculty.name ? faculty.name.substring(0, 2) : 'FC'}
                        </div>
                        <div>
                          <span className="font-semibold text-text-main">{faculty.name || 'Unknown Faculty'}</span>
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-text-muted">
                            <Mail className="w-3 h-3" /> {faculty.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Award className="w-4 h-4 text-brand-accent" /> {faculty.specialization || 'Not Specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{faculty.experience || '0 Years'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium text-xs">
                        <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                        0 Courses
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={faculty.isActive !== false ? "success" : "warning"}>
                        {faculty.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/faculty/${faculty._id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-primary transition-colors"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 hover:bg-yellow-50 rounded-lg text-gray-500 hover:text-yellow-600 transition-colors"
                          title="Suspend Faculty"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
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
        {/* Pagination Dummy */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-text-muted">
          <span>Showing {filteredFaculty.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-brand-primary text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
        entityName="Faculty" 
      />
    </div>
  );
}
