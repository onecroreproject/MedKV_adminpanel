import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Edit, Globe, Activity, AlertCircle, FileX, CheckCircle, PieChart, TrendingUp, Download } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockSEOData = [
  { id: 'SEO-101', page: 'FRCR Part 1 Radiology Course', type: 'Course', title: 'FRCR Part 1 Course | Dr. Sam Reefath Academy', slug: '/courses/frcr-part-1', status: 'Optimized', updated: 'Oct 26, 2023' },
  { id: 'SEO-102', page: 'MRI Brain Tumor Case Study', type: 'Case Library', title: 'MRI Brain Tumor Case | Radiology Library', slug: '/cases/mri-brain-tumor', status: 'Needs Review', updated: 'Oct 25, 2023' },
  { id: 'SEO-103', page: 'Introduction to Neuroanatomy', type: 'Blog', title: 'Missing Meta Title', slug: '/blog/intro-to-neuroanatomy', status: 'Missing Metadata', updated: 'Oct 24, 2023' },
  { id: 'SEO-104', page: 'About Us', type: 'Static Page', title: 'About Dr. Sam Reefath Radiology Academy', slug: '/about', status: 'Optimized', updated: 'Sep 10, 2023' },
  { id: 'SEO-105', page: 'General Pathology MCQs', type: 'MCQs', title: 'Draft', slug: '/mcqs/general-pathology', status: 'Draft', updated: 'Oct 26, 2023' },
];

export default function SEODashboard() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Optimized': return 'success';
      case 'Needs Review': return 'warning';
      case 'Missing Metadata': return 'danger';
      case 'Draft': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">SEO Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage search engine optimization settings and metadata for public content.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors">
            <PieChart className="w-4 h-4" /> SEO Report
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Optimized Pages', value: '142', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Completion Rate', value: '78%', icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Missing Meta', value: '24', icon: FileX, color: 'text-red-600', bg: 'bg-red-100' },
          { label: 'Needs Review', value: '15', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'OG Configured', value: '110', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-main">{stat.value}</p>
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search page title, slug, or content type..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Content Type</option>
            <option value="courses">Courses</option>
            <option value="blogs">Blogs</option>
            <option value="cases">Case Library</option>
            <option value="static">Static Pages</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">SEO Status</option>
            <option value="optimized">Optimized</option>
            <option value="review">Needs Review</option>
            <option value="missing">Missing Metadata</option>
            <option value="draft">Draft</option>
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
                <th className="px-6 py-4">Page Name / Type</th>
                <th className="px-6 py-4">Meta Title</th>
                <th className="px-6 py-4">URL Slug</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockSEOData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/seo/edit/${item.id}`)}
                      className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                    >
                      {item.page}
                    </button>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{item.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${item.status === 'Missing Metadata' ? 'text-red-500 italic' : 'text-gray-700'}`}>
                      {item.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {item.updated}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/seo/edit/${item.id}`)}
                        className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded hover:bg-brand-primary/90 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit SEO
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
