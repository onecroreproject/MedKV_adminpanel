import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Filter, LayoutGrid, List as ListIcon, BrainCircuit, Activity, HeartPulse, Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockAnatomy = [
  { id: 'AN-001', title: 'Neuro Anatomy: Brain Stem', category: 'Neuro Anatomy', creator: 'Dr. Sarah Connor', uploadDate: 'Oct 26, 2023', labels: 45, quizzes: 12, status: 'Published', icon: BrainCircuit },
  { id: 'AN-002', title: 'Thorax CT Anatomy', category: 'Thorax', creator: 'Dr. Emily Chen', uploadDate: 'Oct 25, 2023', labels: 82, quizzes: 20, status: 'Published', icon: HeartPulse },
  { id: 'AN-003', title: 'Abdominal MRI Variations', category: 'Abdomen', creator: 'Dr. John Doe', uploadDate: 'Oct 24, 2023', labels: 30, quizzes: 5, status: 'Draft', icon: Activity },
  { id: 'AN-004', title: 'Upper Limb Musculoskeletal', category: 'Musculoskeletal', creator: 'Dr. Samuel Reefath', uploadDate: 'Oct 20, 2023', labels: 110, quizzes: 25, status: 'Archived', icon: Activity },
];

export default function AnatomyList() {
  const navigate = useNavigate();
  const [view, setView] = useState('list'); // 'list' or 'grid'

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Anatomy Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage CT/MRI anatomy studies, labeled structures, and quizzes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/anatomy/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Anatomy
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Anatomy Title..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Category</option>
            <option value="neuro">Neuro Anatomy</option>
            <option value="thorax">Thorax</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> More Filters
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
                  <th className="px-6 py-4">Anatomy Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Labels</th>
                  <th className="px-6 py-4 text-center">Quizzes</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockAnatomy.map((item) => {
                  const Icon = item.icon;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20 shrink-0 cursor-pointer" onClick={() => navigate(`/anatomy/${item.id}`)}>
                            <Icon className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div>
                            <button 
                              onClick={() => navigate(`/anatomy/${item.id}`)}
                              className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                            >
                              {item.title}
                            </button>
                            <p className="text-xs text-text-muted mt-0.5">Uploaded {item.uploadDate} by {item.creator}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-medium text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-text-main">
                        {item.labels}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-text-main">
                        {item.quizzes}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="View Anatomy" onClick={() => navigate(`/anatomy/${item.id}`)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Anatomy">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Anatomy">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockAnatomy.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => navigate(`/anatomy/${item.id}`)}>
                {/* Thumbnail Area */}
                <div className="relative h-40 bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-brand-primary/10 transition-colors"></div>
                  <Icon className="w-16 h-16 text-brand-primary/20 group-hover:text-brand-primary/40 transition-colors transform group-hover:scale-110" />
                  
                  {/* Mock Scans Background */}
                  <div className="absolute inset-0 bg-[url('https://placehold.co/400x300/f8fafc/cbd5e1.png?text=CT/MRI+Scan')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>

                  <div className="absolute top-2 right-2 z-10">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-4 border-t-2 border-transparent group-hover:border-brand-accent transition-colors">
                  <h3 className="font-bold text-text-main text-sm line-clamp-2 mb-1 group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-muted mb-3">{item.category}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <span><strong className="text-text-main">{item.labels}</strong> Labels</span>
                      <span><strong className="text-text-main">{item.quizzes}</strong> Quizzes</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
