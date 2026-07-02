import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, LayoutTemplate, Image as ImageIcon, Link as LinkIcon, Edit, Plus, Monitor, Smartphone, Tablet } from 'lucide-react';

export default function HomepageEditor() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      heading: 'Master Radiology with Expert-Led Courses',
      subheading: 'Join Dr. Sam Reefath Academy and elevate your clinical skills with our premium FRCR and Anatomy modules.',
      btnPrimary: 'Explore Courses',
      btnSecondary: 'Join Free Trial'
    }
  });
  
  const [previewMode, setPreviewMode] = useState('desktop');

  const heading = watch('heading');
  const subheading = watch('subheading');
  const btnPrimary = watch('btnPrimary');
  const btnSecondary = watch('btnSecondary');

  const onSubmit = (data) => {
    console.log(data);
    alert('Homepage sections saved & published!');
    navigate('/cms');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <button 
          onClick={() => navigate('/cms')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to CMS Dashboard
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm"
          >
            <Save className="w-4 h-4" /> Publish Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-brand-primary"/> Hero Section Details</h3>
            </div>
            
            <form className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Main Heading</label>
                <input 
                  {...register('heading')} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Sub Heading / Description</label>
                <textarea 
                  {...register('subheading')} 
                  rows={3} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 leading-relaxed" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Primary Button Text</label>
                  <input {...register('btnPrimary')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Secondary Button Text</label>
                  <input {...register('btnSecondary')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Hero Background Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors">
                  <ImageIcon className="w-8 h-8 text-brand-primary/50 mb-2" />
                  <span className="text-sm font-medium text-text-main">Click to upload new hero image</span>
                  <span className="text-xs text-gray-400 mt-1">Recommended size: 1920x1080px (WebP/JPG)</span>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 text-center">
            <p className="text-sm text-text-muted mb-4">Want to manage the slider banners instead?</p>
            <button className="mx-auto flex items-center gap-2 px-4 py-2 border border-brand-primary text-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary/10 transition-colors">
              <Plus className="w-4 h-4" /> Add Slider Banner
            </button>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-text-main text-sm">Live Preview</h3>
              <div className="flex bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}><Monitor className="w-4 h-4"/></button>
                <button onClick={() => setPreviewMode('tablet')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}><Tablet className="w-4 h-4"/></button>
                <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}><Smartphone className="w-4 h-4"/></button>
              </div>
            </div>

            <div className="p-6 bg-gray-100 flex justify-center items-center min-h-[500px] overflow-hidden">
              
              {/* Responsive Mockup Container */}
              <div 
                className={`bg-brand-primary text-white shadow-xl overflow-hidden transition-all duration-300 relative ${
                  previewMode === 'desktop' ? 'w-full aspect-[16/9] rounded-xl' :
                  previewMode === 'tablet' ? 'w-[400px] aspect-[3/4] rounded-2xl border-8 border-gray-800' :
                  'w-[280px] aspect-[9/16] rounded-[2rem] border-[12px] border-gray-800'
                }`}
              >
                {/* Mockup Navbar */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                  <div className="w-20 h-4 bg-white/20 rounded"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-2 bg-white/20 rounded hidden sm:block"></div>
                    <div className="w-8 h-2 bg-white/20 rounded hidden sm:block"></div>
                  </div>
                </div>

                {/* Mockup Hero Content */}
                <div className={`p-6 md:p-8 flex flex-col justify-center h-full ${previewMode === 'mobile' ? 'text-center items-center' : 'text-left'}`}>
                  <div className="max-w-md">
                    <h1 className={`font-bold leading-tight mb-3 ${previewMode === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
                      {heading || 'Main Heading Goes Here'}
                    </h1>
                    <p className={`text-white/80 leading-relaxed mb-6 ${previewMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                      {subheading || 'Subheading or description goes here...'}
                    </p>
                    <div className={`flex gap-3 ${previewMode === 'mobile' ? 'flex-col w-full' : 'flex-row'}`}>
                      <div className="bg-brand-accent text-brand-primary px-4 py-2 rounded font-bold text-xs text-center">
                        {btnPrimary || 'Button 1'}
                      </div>
                      <div className="bg-transparent border border-white text-white px-4 py-2 rounded font-bold text-xs text-center">
                        {btnSecondary || 'Button 2'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
