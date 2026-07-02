import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Search, Filter, FileCheck, Eye, Award, CheckCircle2, Clock, XCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockCertificates = [
  { id: 'CERT-1045', student: 'Alice Johnson', course: 'FRCR Part 2A Comprehensive', issueDate: 'Oct 26, 2023', status: 'Issued' },
  { id: 'CERT-1046', student: 'Bob Smith', course: 'Neuroanatomy Masterclass', issueDate: '-', status: 'Pending' },
  { id: 'CERT-1047', student: 'Charlie Davis', course: 'Rapid Reporting Set A', issueDate: 'Oct 24, 2023', status: 'Issued' },
  { id: 'CERT-1048', student: 'Diana Miller', course: 'Basic Ultrasound Physics', issueDate: 'Oct 20, 2023', status: 'Revoked' },
];

export default function CertificateList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Issued': return 'success';
      case 'Pending': return 'warning';
      case 'Revoked': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Certificate Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage student course completions and generate official certificates.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/certificates/template')}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors"
          >
            <Upload className="w-4 h-4" /> Manage Templates
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export All
          </button>
          <button 
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Generate Certificate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Issued', value: '4,521', icon: Award, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Generated Today', value: '12', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Active Templates', value: '8', icon: FileCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Pending Requests', value: '34', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-0.5">{stat.label}</p>
              <p className="text-xl font-bold text-text-main">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by student name, ID or course..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Course Name</option>
            <option value="frcr">FRCR Part 2A</option>
            <option value="anatomy">Neuroanatomy</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="issued">Issued</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
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
                <th className="px-6 py-4">Certificate ID</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCertificates.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-500">
                    {item.status === 'Pending' ? '-' : item.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-text-main">
                    {item.student}
                  </td>
                  <td className="px-6 py-4">
                    {item.course}
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {item.issueDate}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.status === 'Pending' ? (
                        <button className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded hover:bg-brand-primary/90 mr-2">Generate</button>
                      ) : (
                        <>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="View Certificate" onClick={() => navigate(`/certificates/${item.id}`)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Download PDF">
                            <Download className="w-4 h-4" />
                          </button>
                        </>
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
