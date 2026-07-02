import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, FileText, LayoutList, ImageIcon, Video, Upload, Check, ChevronRight, BookOpen, Search as SearchIcon, BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Basic & Clinical', icon: FileText },
  { id: 2, name: 'Diagnosis & Discussion', icon: LayoutList },
  { id: 3, name: 'Image Uploads', icon: ImageIcon },
  { id: 4, name: 'Education & SEO', icon: SearchIcon }
];

export default function AddCase() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, control } = useForm();

  const handleNext = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const onSubmit = (data) => {
    console.log(data);
    alert('Case created successfully!');
    navigate('/cases');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            {/* Section: Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">1. Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Case Title *</label>
                  <input {...register('title')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. Acoustic Neuroma" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Case Slug (Auto Generated)</label>
                  <input disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed" placeholder="acoustic-neuroma" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                  <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="">Select Category</option>
                    <option value="neuro">Neuro Imaging</option>
                    <option value="chest">Chest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Modality *</label>
                  <select {...register('modality')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="mri">MRI</option>
                    <option value="ct">CT</option>
                    <option value="us">Ultrasound</option>
                    <option value="xr">X-Ray</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Case Difficulty *</label>
                  <select {...register('difficulty')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Faculty / Author *</label>
                  <select {...register('faculty')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="">Select Faculty</option>
                    <option value="sarah">Dr. Sarah Connor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Status</label>
                  <select {...register('status')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Clinical Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">2. Clinical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Clinical History *</label>
                  <textarea {...register('history')} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Brief clinical history..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Patient Age</label>
                  <input {...register('age')} type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. 45" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Patient Gender</label>
                  <select {...register('gender')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="">Select</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                    <option value="o">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Presenting Symptoms</label>
                  <input {...register('symptoms')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. Unilateral hearing loss, tinnitus" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Examination Findings</label>
                  <input {...register('examFindings')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Key physical examination findings..." />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            {/* Section: Diagnosis */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">3. Diagnosis Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Primary Diagnosis *</label>
                  <input {...register('primaryDiagnosis')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. Acoustic Neuroma" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Final Diagnosis</label>
                  <input {...register('finalDiagnosis')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Pathology proven final diagnosis" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Differential Diagnosis</label>
                  <input {...register('diffDiagnosis')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Comma separated list (e.g. Meningioma, Epidermoid cyst)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Diagnostic Pearls</label>
                  <textarea {...register('diagnosticPearls')} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Key tips for recognizing this pathology..." />
                </div>
              </div>
            </div>

            {/* Section: Discussion */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">4. Discussion Section</h3>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Imaging Findings</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">B</span>
                    <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">I</span>
                    <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">U</span>
                  </div>
                  <textarea {...register('imagingFindings')} rows={4} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Detailed imaging findings per modality..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Discussion *</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">B</span>
                    <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">I</span>
                  </div>
                  <textarea {...register('discussion')} rows={5} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Comprehensive discussion of the case, pathology, and treatment..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">References / Related Resources</label>
                <textarea {...register('references')} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="List of references or journal links..." />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">5. Image Upload Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* MRI */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">MRI Images</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-xs font-medium">Upload Multiple MRI Slices</span>
                </div>
                <input className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-primary" placeholder="Image Caption (e.g. Axial T1 C+)" />
              </div>

              {/* CT */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">CT Images</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-xs font-medium">Upload Multiple CT Slices</span>
                </div>
                <input className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-primary" placeholder="Image Caption" />
              </div>

              {/* Ultrasound */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Ultrasound Images</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-xs font-medium">Upload US Images</span>
                </div>
                <input className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-primary" placeholder="Image Caption" />
              </div>

              {/* X-Ray */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">X-Ray Images</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-xs font-medium">Upload X-Ray Images</span>
                </div>
                <input className="w-full mt-2 px-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-primary" placeholder="Image Caption" />
              </div>

              {/* Additional Media */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-2">Additional Media (DICOM / Annotated / Video)</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                  <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                  <span className="text-xs font-medium">Drag & Drop specialized files here</span>
                </div>
              </div>

            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            {/* Section: Educational Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">6. Educational Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Case Summary / Teaching Notes</label>
                  <textarea {...register('teachingNotes')} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Summarize the core educational value of this case..." />
                </div>
                
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-bold text-sm text-text-main mb-3">Quiz Question</h4>
                  <div className="space-y-3">
                    <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-white" placeholder="Question Text" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm bg-white" placeholder="Option A" />
                      <input className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm bg-white" placeholder="Option B" />
                    </div>
                    <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-white" placeholder="Explanation for correct answer..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: SEO & Metadata */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">7. SEO & Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Meta Title</label>
                  <input {...register('metaTitle')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="SEO Title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Keywords & Tags</label>
                  <input {...register('tags')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Comma separated tags" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Meta Description</label>
                  <textarea {...register('metaDesc')} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="SEO Description" />
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/cases')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Case Library Content</h1>
            <p className="text-sm text-text-muted mt-1">Submit a new radiology case for the educational library.</p>
          </div>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hidden md:block">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2 relative z-10 bg-white px-2">
                  <div 
                    className={clsx(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      currentStep === step.id ? "bg-brand-primary text-white shadow-[0_0_0_4px_rgba(11,31,77,0.1)]" :
                      currentStep > step.id ? "bg-status-success text-white" : "bg-gray-100 text-gray-400"
                    )}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={clsx("text-xs font-bold absolute -bottom-5 w-max text-center uppercase tracking-wider", currentStep >= step.id ? "text-brand-primary" : "text-gray-400")}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={clsx("h-1 w-full -mx-4 z-0", currentStep > step.id ? "bg-status-success" : "bg-gray-100")}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      <div className="md:hidden text-center text-sm font-bold text-brand-primary">
        Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.name}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-2.5 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-3">
              <button 
                type="button"
                className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Save Draft
              </button>
              
              {currentStep < 4 ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 flex items-center gap-2 shadow-sm shadow-brand-accent/30"
                >
                  <Save className="w-4 h-4" /> Publish Case
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
