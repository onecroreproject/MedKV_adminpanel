import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, LayoutTemplate, MessageSquare, Phone, AlignLeft, Users, CheckCircle2, Navigation } from 'lucide-react';

export default function CMSDashboard() {
  const navigate = useNavigate();

  const cmsSections = [
    { title: 'Homepage Banners & Hero', icon: LayoutTemplate, path: '/cms/homepage', desc: 'Manage main landing page banners, hero images, and primary calls-to-action.', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { title: 'About Us Content', icon: AlignLeft, path: '/cms/general?tab=about', desc: 'Update academy mission, vision, and the main about description.', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Testimonials', icon: MessageSquare, path: '/cms/general?tab=testimonials', desc: 'Manage student reviews, ratings, and success stories.', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Contact & Footer Info', icon: Phone, path: '/cms/general?tab=contact', desc: 'Update address, phone numbers, map links, and footer links.', color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Website CMS Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage public website content without developer intervention.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors">
            <Layout className="w-4 h-4" /> Live Website Preview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Published Content', value: '45 Pages', icon: CheckCircle2, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Homepage Sections', value: '8 Active', icon: LayoutTemplate, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Testimonials', value: '12 Live', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Faculty Profiles', value: '24 Profiles', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
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

      <div>
        <h2 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-brand-primary" /> Content Editors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cmsSections.map((section) => (
            <div 
              key={section.title} 
              onClick={() => navigate(section.path)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-brand-primary/30 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${section.bg} ${section.color} group-hover:scale-110 transition-transform`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-main group-hover:text-brand-primary transition-colors">{section.title}</h3>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">{section.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
