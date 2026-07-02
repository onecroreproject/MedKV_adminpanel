import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertCircle, FileText, FileQuestion, BookOpen, User } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockApprovals = [
  { id: 'APP-801', title: 'Neuroanatomy Module Update', type: 'Anatomy Content', author: 'Dr. Sarah Connor', date: 'Oct 26, 2023', status: 'Pending Review' },
  { id: 'APP-802', title: 'MRI Spine Contrast Quiz', type: 'MCQs', author: 'Dr. Emily Chen', date: 'Oct 25, 2023', status: 'Changes Requested' },
  { id: 'APP-803', title: 'Rare Brain Tumor Case', type: 'Cases', author: 'Dr. John Doe', date: 'Oct 24, 2023', status: 'Approved' },
  { id: 'APP-804', title: 'Basic Ultrasound Physics Draft', type: 'Faculty Articles', author: 'Dr. Alice Smith', date: 'Oct 20, 2023', status: 'Rejected' },
];

export default function ApprovalList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending Review': return 'warning';
      case 'Rejected': return 'danger';
      case 'Changes Requested': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Cases': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'MCQs': return <FileQuestion className="w-5 h-5 text-purple-500" />;
      case 'Anatomy Content': return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'Pathology Content': return <BookOpen className="w-5 h-5 text-rose-500" />;
      case 'Faculty Articles': return <FileText className="w-5 h-5 text-brand-primary" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Content Approval Management</h1>
          <p className="text-sm text-text-muted mt-1">Review and moderate educational content before publishing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Pending Approvals', value: '24', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Approved Content', value: '1,842', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Rejected Content', value: '45', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'Requires Changes', value: '12', icon: AlertCircle, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Today\'s Subs', value: '8', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-main">{stat.value}</p>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search content title or author..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Content Type</option>
            <option value="cases">Cases</option>
            <option value="mcq">MCQs</option>
            <option value="anatomy">Anatomy Content</option>
            <option value="pathology">Pathology Content</option>
            <option value="articles">Faculty Articles</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="changes">Changes Requested</option>
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
                <th className="px-6 py-4">Content Title</th>
                <th className="px-6 py-4">Content Type</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockApprovals.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/approvals/${item.id}`)}
                      className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                    >
                      {item.title}
                    </button>
                    <p className="text-xs text-text-muted mt-0.5">ID: {item.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <span className="font-medium text-gray-700">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <User className="w-4 h-4" />
                      <span>{item.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'Pending Review' && (
                        <button 
                          onClick={() => navigate(`/approvals/${item.id}`)}
                          className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded hover:bg-brand-primary/90"
                        >
                          Review Now
                        </button>
                      )}
                      {item.status !== 'Pending Review' && (
                        <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-text-main rounded hover:bg-gray-50 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                      )}
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
