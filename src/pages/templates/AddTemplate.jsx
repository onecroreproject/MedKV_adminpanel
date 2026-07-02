import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, FileText, CheckSquare, AlignLeft } from 'lucide-react';

export default function AddTemplate() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert('Template created successfully!');
    navigate('/templates');
  };

  const defaultTemplateContent = `Study: 
Technique: 
Clinical History: 

Findings:
- 

Impression:
1. 

Recommendations:
- `;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/templates')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Reporting Template</h1>
            <p className="text-sm text-text-muted mt-1">Design a standardized radiology reporting structure.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/30"
          >
            <Save className="w-4 h-4" /> Publish Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">1. Basic Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Template Name *</label>
                  <input {...register('templateName')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. CT Brain Routine" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                  <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="">Select Category</option>
                    <option value="ct">CT</option>
                    <option value="mri">MRI</option>
                    <option value="us">Ultrasound</option>
                    <option value="doppler">Doppler</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Template Content */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">2. Template Content</h3>
            </div>
            <div className="p-6">
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
                {/* Rich Text Editor Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-3">
                  <div className="flex gap-1 border-r border-gray-200 pr-3">
                    <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                    <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                    <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">U</span>
                  </div>
                  <div className="flex gap-1 border-r border-gray-200 pr-3">
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">Heading 1</span>
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">Heading 2</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-xs font-serif font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">List</span>
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">Table</span>
                  </div>
                </div>
                <textarea 
                  {...register('content')} 
                  rows={20} 
                  defaultValue={defaultTemplateContent}
                  className="w-full px-6 py-4 text-sm focus:outline-none font-mono text-gray-700 leading-relaxed" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">3. Template Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { id: 'active', label: 'Active Template' },
                { id: 'forStudents', label: 'Available for Students' },
                { id: 'forFaculty', label: 'Available for Faculty' },
                { id: 'featured', label: 'Featured Template' },
              ].map(setting => (
                <label key={setting.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked {...register(setting.id)} className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                  <span className="text-sm font-medium text-text-main">{setting.label}</span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-xs text-text-muted leading-relaxed">
              <strong>Tip:</strong> Ensure you include sections for "Findings" and "Impression". Standardizing these fields helps students learn the correct radiological reporting structure.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
