import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Search, Filter, FileText, Edit, Trash2, Library, AlertCircle, Activity, LayoutGrid, List } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockProtocols = [
  { id: 'PROT-001', name: 'CT Brain Stroke Protocol', category: 'CT Protocols', uploadDate: 'Oct 26, 2023', author: 'Dr. Sarah Connor', size: '2.4 MB', status: 'Active' },
  { id: 'PROT-002', name: 'MRI Spine Contrast Guideline', category: 'MRI Protocols', uploadDate: 'Oct 25, 2023', author: 'Dr. Emily Chen', size: '1.8 MB', status: 'Active' },
  { id: 'PROT-003', name: 'Ultrasound FAST Scan', category: 'Emergency Guidelines', uploadDate: 'Oct 24, 2023', author: 'Dr. John Doe', size: '3.1 MB', status: 'Draft' },
  { id: 'PROT-004', name: 'Doppler Renal Artery', category: 'Ultrasound Protocols', uploadDate: 'Oct 20, 2023', author: 'Dr. Samuel Reefath', size: '1.2 MB', status: 'Archived' },
];

export default function ProtocolList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Protocols & Guidelines</h1>
          <p className="text-sm text-text-muted mt-1">Manage imaging procedures, emergency guidelines, and clinical references.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Activity className="w-4 h-4" /> View Analytics
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors">
            <Upload className="w-4 h-4" /> Upload PDF
          </button>
          <button 
            onClick={() => navigate('/protocols/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Protocol
          </button>
        </div>
      </div>

      {/* Statistics & Categories Header */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Protocols', value: '156', icon: Library, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'CT Protocols', value: '45', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'MRI Protocols', value: '52', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Ultrasound', value: '38', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Emergency', value: '21', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
          { label: 'Total Downloads', value: '4.2k', icon: Download, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-text-main">{stat.value}</span>
            </div>
            <p className="text-xs font-medium text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search protocols by name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Category</option>
            <option value="ct">CT Protocols</option>
            <option value="mri">MRI Protocols</option>
            <option value="us">Ultrasound</option>
            <option value="emergency">Emergency</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Protocol Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4 text-center">File Size</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockProtocols.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/protocols/${item.id}`)}>
                        <FileText className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <button 
                          onClick={() => navigate(`/protocols/${item.id}`)}
                          className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                        >
                          {item.name}
                        </button>
                        <p className="text-xs text-text-muted mt-0.5">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {item.uploadDate}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {item.author}
                  </td>
                  <td className="px-6 py-4 text-center text-text-muted font-mono">
                    {item.size}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Protocol" onClick={() => navigate(`/protocols/${item.id}`)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Protocol">
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
