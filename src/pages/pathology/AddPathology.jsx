import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, FileText, LayoutList, Image as ImageIcon, Video, Upload, Plus, Trash2, GripVertical, Check, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Basic Info', icon: FileText },
  { id: 2, name: 'Key Findings', icon: LayoutList },
  { id: 3, name: 'Differential Diagnosis', icon: LayoutList },
  { id: 4, name: 'Key Images', icon: ImageIcon },
  { id: 5, name: 'Video Explanations', icon: Video }
];

export default function AddPathology() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      differentials: [{ name: '' }]
    }
  });

  const { fields: diffFields, append: appendDiff, remove: removeDiff } = useFieldArray({ control, name: "differentials" });

  const handleNext = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const onSubmit = (data) => {
    console.log(data);
    alert('Pathology content submitted successfully!');
    navigate('/pathology');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Disease Name *</label>
                <input {...register('name')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. Glioblastoma Multiforme" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20">
                  <option value="">Select Category</option>
                  <option value="neurology">Neurology</option>
                  <option value="chest">Chest</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="gastro">Gastrointestinal</option>
                  <option value="msk">Musculoskeletal</option>
                  <option value="oncology">Oncology</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Description Overview</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary focus-within:ring-brand-primary/20">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                    <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                    <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">U</span>
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-serif font-bold">List</span>
                  </div>
                  <textarea {...register('description')} rows={5} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="General description of the disease pathology..." />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Key Findings</h3>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mb-6">
              Detail the specific imaging findings, clinical features, and radiological hallmarks (e.g., Ring Enhancing Lesion, Ground Glass Opacity).
            </div>
            <div>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary focus-within:ring-brand-primary/20">
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                  <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                  <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">U</span>
                  <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-serif font-bold">List</span>
                </div>
                <textarea {...register('keyFindings')} rows={10} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="- CT shows hyperdense mass...&#10;- MRI T1 contrast reveals ring enhancement..." />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-text-main">Differential Diagnosis</h3>
              <button 
                type="button"
                onClick={() => appendDiff({ name: '' })}
                className="text-sm font-medium text-brand-primary hover:text-brand-accent flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Differential
              </button>
            </div>
            
            <div className="space-y-3">
              {diffFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 group">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                  <div className="flex-1">
                    <input 
                      {...register(`differentials.${index}.name`)} 
                      className="w-full px-3 py-1.5 border border-transparent bg-transparent text-sm font-medium focus:outline-none focus:border-brand-primary focus:bg-white rounded transition-colors" 
                      placeholder={`Differential ${index + 1} (e.g. Abscess, Metastasis)`} 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeDiff(index)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Key Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Image Category Dropzone */}
              {['CT Scans', 'MRI Images', 'X-Ray Images', 'Pathology Slides'].map(cat => (
                <div key={cat}>
                  <label className="block text-sm font-medium text-text-main mb-2">{cat}</label>
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                    <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                    <span className="text-xs font-medium">Drag & Drop Images</span>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Video Explanation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Direct Video Upload</label>
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                    <Upload className="w-6 h-6 mb-2 group-hover:text-brand-primary transition-colors" />
                    <span className="text-xs font-medium">Upload MP4 / MOV</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-500 uppercase tracking-wider font-bold">OR URL</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">External Video URL</label>
                  <input {...register('videoUrl')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Paste YouTube or Vimeo URL here..." />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Video Preview</label>
                <div className="aspect-video bg-black rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden group">
                  <Video className="w-8 h-8 text-gray-600" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <span className="text-xs font-medium bg-white/20 text-white px-2 py-1 rounded backdrop-blur-sm">No Video Uploaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/pathology')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Pathology Content</h1>
            <p className="text-sm text-text-muted mt-1">Submit disease information and radiological findings.</p>
          </div>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hidden md:block">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
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
                  <span className={clsx("text-[10px] font-bold absolute -bottom-5 w-max text-center uppercase tracking-wider", currentStep >= step.id ? "text-brand-primary" : "text-gray-400")}>
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
      
      {/* Mobile Step Indicator */}
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
            
            {currentStep < 5 ? (
              <button 
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="submit"
                className="px-6 py-2.5 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 flex items-center gap-2 shadow-sm shadow-brand-accent/30"
              >
                <Save className="w-4 h-4" /> Submit for Review
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
