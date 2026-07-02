import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Filter, LayoutGrid, List as ListIcon, CheckCircle, XCircle, Activity, FileText, Edit, Trash2, Eye } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockPathology = [
  { id: 'PATH-001', name: 'Glioblastoma Multiforme', category: 'Neurology', uploadedBy: 'Dr. Sarah Connor', uploadDate: 'Oct 26, 2023', views: '2.1k', status: 'Approved' },
  { id: 'PATH-002', name: 'Pulmonary Embolism', category: 'Chest', uploadedBy: 'Dr. Emily Chen', uploadDate: 'Oct 25, 2023', views: '850', status: 'Approved' },
  { id: 'PATH-003', name: 'Hepatocellular Carcinoma', category: 'Hepatobiliary', uploadedBy: 'Dr. John Doe', uploadDate: 'Oct 24, 2023', views: '-', status: 'Pending Review' },
  { id: 'PATH-004', name: 'Osteosarcoma', category: 'Musculoskeletal', uploadedBy: 'Dr. Samuel Reefath', uploadDate: 'Oct 20, 2023', views: '-', status: 'Draft' },
];

export default function PathologyList() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' or 'grid'
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending Review': return 'warning';
      case 'Rejected': return 'danger';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  const filteredData = activeTab === 'pending' 
    ? mockPathology.filter(item => item.status === 'Pending Review')
    : mockPathology;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Pathology Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage disease libraries, radiological findings, and educational videos.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {activeTab === 'all' && (
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
                title="List View"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white text-text-main shadow-sm' : 'text-gray-500 hover:text-text-main'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/pathology/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Disease
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200 w-full sm:w-fit">
        <button
          onClick={() => { setActiveTab('all'); setView('list'); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === 'all' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-text-main'
          }`}
        >
          All Content
        </button>
        <button
          onClick={() => { setActiveTab('pending'); setView('list'); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
            activeTab === 'pending' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-text-main'
          }`}
        >
          Pending Approval
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {mockPathology.filter(item => item.status === 'Pending Review').length}
          </span>
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Disease Name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Category</option>
            <option value="neuro">Neurology</option>
            <option value="chest">Chest</option>
          </select>
          {activeTab === 'all' && (
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
              <option value="">Status</option>
              <option value="approved">Approved</option>
              <option value="draft">Draft</option>
            </select>
          )}
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {view === 'list' ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
              <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </th>
                  <th className="px-6 py-4">Disease Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/pathology/${item.id}`)}>
                          <Activity className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <button 
                            onClick={() => navigate(`/pathology/${item.id}`)}
                            className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                          >
                            {item.name}
                          </button>
                          <p className="text-xs text-text-muted mt-0.5">{item.id} • Uploaded {item.uploadDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-main">
                      {item.uploadedBy}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {activeTab === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Approve">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Review Details" onClick={() => navigate(`/pathology/${item.id}`)}>
                            <FileText className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="View Pathology" onClick={() => navigate(`/pathology/${item.id}`)}>
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Pathology">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Pathology">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => navigate(`/pathology/${item.id}`)}>
              {/* Thumbnail Area */}
              <div className="relative h-40 bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors"></div>
                
                {/* Mock Scan Background */}
                <div className="absolute inset-0 bg-[url('https://placehold.co/400x300/f8fafc/cbd5e1.png?text=Pathology+Image')] bg-cover bg-center opacity-40 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"></div>

                <div className="absolute top-2 right-2 z-10">
                  <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-4 border-t-2 border-transparent group-hover:border-brand-accent transition-colors">
                <h3 className="font-bold text-text-main text-sm line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-text-muted mb-3">{item.category}</p>
                
                <p className="text-xs text-text-muted line-clamp-2 italic mb-3">
                  Key finding: Ring enhancing lesion with surrounding edema and mass effect.
                </p>

                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-400 pt-3 border-t border-gray-50">
                  <span>{item.uploadedBy}</span>
                  <span>{item.views} VIEWS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
