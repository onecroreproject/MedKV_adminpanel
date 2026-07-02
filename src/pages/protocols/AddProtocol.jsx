import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, FileText, Settings, UploadCloud, File, X, CheckSquare, AlignLeft } from 'lucide-react';

export default function AddProtocol() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [uploadedFile, setUploadedFile] = useState(null);

  const onSubmit = (data) => {
    console.log(data, uploadedFile);
    alert('Protocol created successfully!');
    navigate('/protocols');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/protocols')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create New Protocol</h1>
            <p className="text-sm text-text-muted mt-1">Upload and configure a new imaging guideline or protocol.</p>
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
            <Save className="w-4 h-4" /> Publish Protocol
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
                  <label className="block text-sm font-medium text-text-main mb-1.5">Protocol Name *</label>
                  <input {...register('protocolName')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. CT Brain Stroke Protocol" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                  <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="">Select Category</option>
                    <option value="ct">CT Protocols</option>
                    <option value="mri">MRI Protocols</option>
                    <option value="us">Ultrasound Protocols</option>
                    <option value="emergency">Emergency Guidelines</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" /> Description / Notes
                </label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
                  {/* Rich Text Editor Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-3">
                    <div className="flex gap-1 border-r border-gray-200 pr-3">
                      <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                      <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-xs font-serif font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">List</span>
                      <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">Table</span>
                    </div>
                  </div>
                  <textarea 
                    {...register('description')} 
                    rows={6} 
                    className="w-full px-4 py-3 text-sm focus:outline-none text-gray-700 leading-relaxed" 
                    placeholder="Enter protocol description, specific scanning parameters, or clinical indications..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Document Management (PDF Upload) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">2. Document Management (PDF)</h3>
            </div>
            <div className="p-6">
              {!uploadedFile ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-12 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group cursor-pointer">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileUpload} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-1">Upload Protocol PDF</h4>
                  <p className="text-sm text-text-muted mb-4 text-center">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-gray-400">Supported formats: PDF (Max size: 50MB)</p>
                </div>
              ) : (
                <div className="border border-brand-primary/20 bg-blue-50/30 rounded-xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-red-500">
                      <File className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main">{uploadedFile.name}</h4>
                      <p className="text-xs text-text-muted mt-1">{uploadedFile.size} • Uploaded just now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm font-medium text-brand-primary hover:text-brand-accent">Preview</button>
                    <button 
                      onClick={() => setUploadedFile(null)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">3. Access Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { id: 'forStudents', label: 'Available for Students' },
                { id: 'forFaculty', label: 'Available for Faculty' },
                { id: 'featured', label: 'Featured Protocol' },
                { id: 'allowDownload', label: 'Download Allowed' },
              ].map(setting => (
                <label key={setting.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked {...register(setting.id)} className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                  <span className="text-sm font-medium text-text-main">{setting.label}</span>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
               <label className="block text-xs font-bold text-text-main uppercase tracking-wider mb-2">Protocol Status</label>
               <select {...register('status')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
