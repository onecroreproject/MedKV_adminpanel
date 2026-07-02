import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Bell, Mail, Smartphone, Users, CheckCircle2, Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockNotifications = [
  { id: 'NOT-001', title: 'System Maintenance Scheduled', type: 'Website', audience: 'All Students', sentAt: 'Oct 26, 2023, 10:00 AM', status: 'Sent' },
  { id: 'NOT-002', title: 'New FRCR Mock Exam Available', type: 'Email', audience: 'Selected Students', sentAt: 'Oct 25, 2023, 02:30 PM', status: 'Sent' },
  { id: 'NOT-003', title: 'Faculty Meeting Reminder', type: 'SMS', audience: 'Faculty', sentAt: 'Oct 24, 2023, 09:00 AM', status: 'Draft' },
  { id: 'NOT-004', title: 'Course Material Updated', type: 'Website', audience: 'All Students', sentAt: 'Oct 22, 2023, 11:15 AM', status: 'Sent' },
];

export default function NotificationList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Sent': return 'success';
      case 'Draft': return 'warning';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Website': return <Bell className="w-5 h-5 text-brand-primary" />;
      case 'Email': return <Mail className="w-5 h-5 text-blue-500" />;
      case 'SMS': return <Smartphone className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-brand-primary" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Notifications</h1>
          <p className="text-sm text-text-muted mt-1">Manage and send announcements to students and faculty.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => navigate('/notifications/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Create Notification
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sent', value: '1,245', icon: CheckCircle2, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Website Alerts', value: '850', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Emails Sent', value: '320', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'SMS Sent', value: '75', icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-100' },
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
            placeholder="Search notifications..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Type</option>
            <option value="website">Website</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="sent">Sent</option>
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
                <th className="px-6 py-4">Notification Title</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Target Audience</th>
                <th className="px-6 py-4">Date / Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockNotifications.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <span className="font-semibold text-text-main">{item.title}</span>
                        <p className="text-xs text-text-muted mt-0.5">ID: {item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {item.type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Users className="w-4 h-4" />
                      <span>{item.audience}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {item.sentAt}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="View Notification" onClick={() => navigate(`/notifications/${item.id}`)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Notification">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Notification">
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
