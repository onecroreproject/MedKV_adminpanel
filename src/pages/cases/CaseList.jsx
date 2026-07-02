import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Search, Filter, MoreVertical, LayoutGrid, List as ListIcon, Activity, Stethoscope, Copy, Trash2, Edit, Archive } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockCases = [
  { id: 'CAS-001', title: 'Acoustic Neuroma', category: 'Neuro Imaging', modality: 'MRI', diff: 'Intermediate', faculty: 'Dr. Sarah Connor', uploadDate: 'Oct 26, 2023', status: 'Published' },
  { id: 'CAS-002', title: 'Pulmonary Embolism', category: 'Chest', modality: 'CT', diff: 'Beginner', faculty: 'Dr. Emily Chen', uploadDate: 'Oct 25, 2023', status: 'Published' },
  { id: 'CAS-003', title: 'Hepatocellular Carcinoma', category: 'Abdomen', modality: 'Ultrasound', diff: 'Advanced', faculty: 'Dr. John Doe', uploadDate: 'Oct 24, 2023', status: 'Draft' },
  { id: 'CAS-004', title: 'Osteosarcoma Femur', category: 'Musculoskeletal', modality: 'X-Ray', diff: 'Intermediate', faculty: 'Dr. Samuel Reefath', uploadDate: 'Oct 20, 2023', status: 'Archived' },
];

export default function CaseList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  const getDiffColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Case Library Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage clinical radiology cases, diagnostic pearls, and imaging libraries.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export Cases
          </button>
          <button 
            onClick={() => navigate('/cases/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Case
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Case Title or ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Category</option>
            <option value="neuro">Neuro Imaging</option>
            <option value="chest">Chest</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Modality</option>
            <option value="mri">MRI</option>
            <option value="ct">CT</option>
            <option value="xray">X-Ray</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden pb-32">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Case Info</th>
                <th className="px-6 py-4">Modality</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Faculty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/cases/${item.id}`)}>
                        <Stethoscope className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <button 
                          onClick={() => navigate(`/cases/${item.id}`)}
                          className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                        >
                          {item.title}
                        </button>
                        <p className="text-xs text-text-muted mt-0.5">{item.id} • {item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                      {item.modality}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getDiffColor(item.diff)}>{item.diff}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-main">
                    {item.faculty}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Case">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Duplicate Case">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500" title="Archive Case">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600" title="Delete Case">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
