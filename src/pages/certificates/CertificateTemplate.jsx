import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Eye, Settings, Image as ImageIcon, CheckSquare } from 'lucide-react';

export default function CertificateTemplate() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      courseName: 'FRCR Part 2A Comprehensive',
      completionCriteria: '100% Course Completion',
      showLogo: true,
      showSignature: true,
      dynamicStudentName: true,
      dynamicCourseName: true,
      dynamicDate: true
    }
  });

  const onSubmit = (data) => {
    console.log(data);
    alert('Template saved successfully!');
    navigate('/certificates');
  };

  const watchCourse = watch('courseName');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/certificates')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Certificate Template Management</h1>
            <p className="text-sm text-text-muted mt-1">Design and configure official course completion certificates.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Eye className="w-4 h-4" /> Full Preview
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/30"
          >
            <Save className="w-4 h-4" /> Save Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Left Form Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main flex items-center gap-2 mb-4"><Settings className="w-4 h-4 text-brand-primary"/> Template Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Course Name</label>
                <input {...register('courseName')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Completion Criteria</label>
                <select {...register('completionCriteria')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="100% Course Completion">100% Course Completion</option>
                  <option value="Minimum Quiz Score">Minimum Quiz Score (70%)</option>
                  <option value="Course + Mock Exam Completion">Course + Mock Exam Completion</option>
                  <option value="Faculty Approval Required">Faculty Approval Required</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Background Design</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-gray-100 cursor-pointer transition-colors text-gray-500">
                  <ImageIcon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium text-center">Upload Template Background (PNG/JPG)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main flex items-center gap-2 mb-4"><CheckSquare className="w-4 h-4 text-brand-primary"/> Display Elements</h3>
            <div className="space-y-3">
              {[
                { id: 'showLogo', label: 'Academy Logo Placement' },
                { id: 'showSignature', label: 'Authorized Signature Placement' },
                { id: 'dynamicStudentName', label: 'Dynamic Student Name' },
                { id: 'dynamicCourseName', label: 'Dynamic Course Name' },
                { id: 'dynamicDate', label: 'Dynamic Completion Date' },
              ].map(setting => (
                <label key={setting.id} className="flex items-center gap-3">
                  <input type="checkbox" {...register(setting.id)} className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                  <span className="text-sm font-medium text-text-main">{setting.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview Mockup */}
        <div className="lg:col-span-2 xl:col-span-3">
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden flex flex-col min-h-[700px]">
            <div className="bg-gray-800 text-gray-300 px-4 py-2 flex items-center justify-between text-xs font-mono border-b border-gray-700">
              <span>Preview: Live Certificate Generation</span>
              <span>Landscape (A4)</span>
            </div>
            
            <div className="flex-1 bg-gray-950 p-8 flex justify-center items-center overflow-auto">
              
              {/* Certificate Canvas Mockup */}
              <div className="bg-white shadow-2xl relative" style={{ width: '842px', height: '595px' }}>
                {/* Decorative Borders */}
                <div className="absolute inset-4 border-[12px] border-brand-accent/20"></div>
                <div className="absolute inset-6 border border-brand-primary/10"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center text-center px-24 py-16">
                  
                  {/* Logo Placeholder */}
                  <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 border-2 border-brand-primary rounded-full flex items-center justify-center bg-white shadow-sm">
                      <span className="text-brand-primary font-bold text-2xl font-serif">SR</span>
                    </div>
                  </div>

                  <h1 className="text-4xl font-serif font-bold text-brand-primary uppercase tracking-widest mb-2">Certificate of Completion</h1>
                  <p className="text-sm font-bold tracking-[0.2em] text-brand-accent uppercase mb-12">Dr. Sam Reefath Radiology Academy</p>

                  <p className="text-gray-500 italic mb-4">This is to proudly certify that</p>
                  
                  <h2 className="text-5xl font-serif text-gray-900 border-b-2 border-gray-300 pb-2 px-12 mb-6">
                    [Student Full Name]
                  </h2>

                  <p className="text-gray-500 italic mb-2">has successfully completed the requirements for the course</p>
                  
                  <h3 className="text-2xl font-bold text-brand-primary mb-12">
                    {watchCourse || '[Course Name]'}
                  </h3>

                  {/* Footer Elements */}
                  <div className="flex justify-between w-full mt-auto px-8">
                    <div className="flex flex-col items-center">
                      <div className="text-xl font-medium text-gray-800 mb-1">October 26, 2023</div>
                      <div className="w-40 border-t border-gray-400"></div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">Date of Completion</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      {/* Signature Mock */}
                      <div className="font-['Brush_Script_MT',cursive] text-4xl text-brand-primary mb-1 -mt-4 opacity-80">Dr. Sam Reefath</div>
                      <div className="w-48 border-t border-gray-400"></div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">Course Director</div>
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
