import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlignLeft, MessageSquare, Phone, Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export default function GeneralCMSEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'about');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleSave = () => {
    alert(`${activeTab} content saved successfully!`);
    navigate('/cms');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <button 
          onClick={() => navigate('/cms')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to CMS
        </button>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'about' ? 'text-brand-primary border-b-2 border-brand-primary bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <AlignLeft className="w-4 h-4" /> About Us
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'testimonials' ? 'text-brand-primary border-b-2 border-brand-primary bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare className="w-4 h-4" /> Testimonials
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'contact' ? 'text-brand-primary border-b-2 border-brand-primary bg-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Phone className="w-4 h-4" /> Contact & Footer
          </button>
        </div>

        <div className="p-8">
          
          {/* About Us Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">About Title</label>
                <input defaultValue="Empowering the Next Generation of Radiologists" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Main Description</label>
                <textarea rows={5} defaultValue="Dr. Sam Reefath Radiology Academy is committed to providing world-class medical education. Our comprehensive courses..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary leading-relaxed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Vision Statement</label>
                  <textarea rows={3} defaultValue="To be the global leader in radiology education..." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Mission Statement</label>
                  <textarea rows={3} defaultValue="Equipping medical professionals with the skills needed to excel..." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary/20">
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mock Testimonial Card */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sm text-text-main">Dr. Sarah Connor <span className="text-gray-400 font-normal text-xs ml-1">(FRCR Candidate)</span></div>
                    <div className="flex gap-1 text-brand-accent text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-gray-600 mb-4 flex-1">"The FRCR Part 2A course was instrumental in my success. The mock exams are incredibly close to the real thing."</p>
                  <div className="flex justify-end gap-2 border-t border-gray-200 pt-3 mt-auto">
                    <button className="p-1.5 text-gray-400 hover:text-brand-primary"><Edit className="w-4 h-4"/></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Academy Name</label>
                  <input defaultValue="Dr. Sam Reefath Radiology Academy" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
                  <input defaultValue="info@reefathradiology.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Phone Number</label>
                  <input defaultValue="+44 20 7123 4567" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">WhatsApp Number</label>
                  <input defaultValue="+44 7700 900077" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Physical Address</label>
                <textarea rows={2} defaultValue="123 Medical Lane, London, UK, W1G 9HQ" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-text-main mb-4">Footer Configuration</h4>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Copyright Text</label>
                  <input defaultValue="© 2023 Dr. Sam Reefath Radiology Academy. All rights reserved." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
