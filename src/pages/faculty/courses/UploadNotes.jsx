import React, { useState } from 'react';
import { UploadCloud, File, Trash2, CheckCircle, FileText } from 'lucide-react';

export default function UploadNotes() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // handle files...
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Upload Form Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B1F4D]">Upload Course Notes</h2>
            <p className="text-sm text-[#60738A] mt-1">Upload PDF, DOCX, or PPTX materials for your students.</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Note Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. MRI Safety Protocol PDF"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Module Assignment</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all text-[#1A1A1A]">
                  <option value="">Select Module...</option>
                  <option value="m1">Module 1 - Introduction to Radiology</option>
                  <option value="m2">Module 2 - MRI Sequences</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Description (Optional)</label>
              <textarea 
                rows={3}
                placeholder="Add any instructions for students..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Upload File</label>
              <div 
                className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-[#C89B3C] bg-amber-50/50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <UploadCloud className="w-6 h-6 text-[#C89B3C]" />
                </div>
                <h4 className="text-sm font-bold text-[#0B1F4D] mb-1">Click to upload or drag and drop</h4>
                <p className="text-xs text-[#60738A]">PDF, DOCX, PPTX (max. 50MB)</p>
                <input type="file" className="hidden" />
                <button type="button" className="mt-4 px-5 py-2 bg-white border border-gray-200 text-[#0B1F4D] text-sm font-semibold rounded-lg shadow-sm hover:border-[#C89B3C] transition-colors">
                  Browse Files
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button type="button" className="px-5 py-2.5 text-sm font-semibold text-[#60738A] hover:bg-gray-50 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="button" className="px-6 py-2.5 text-sm font-bold text-white bg-[#0B1F4D] hover:bg-[#15347B] rounded-xl shadow-md transition-colors flex items-center gap-2">
                <UploadCloud className="w-4 h-4" /> Upload Notes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Uploaded Resources List */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
          <h3 className="text-lg font-bold text-[#0B1F4D] mb-5">Recent Uploads</h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#C89B3C]/40 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1A1A1A] truncate group-hover:text-[#0B1F4D] transition-colors">MRI_Safety_Guide_v{item}.pdf</h4>
                  <p className="text-xs text-[#60738A] mt-0.5">2.4 MB • Module 1</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 hover:border-red-200 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
