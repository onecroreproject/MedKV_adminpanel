import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, X, Check, ChevronRight, Upload, BrainCircuit, Image as ImageIcon, Crosshair, HelpCircle, Plus, Trash2, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Basic Info', icon: BrainCircuit },
  { id: 2, name: 'Image Management', icon: ImageIcon },
  { id: 3, name: 'Label Management', icon: Crosshair },
  { id: 4, name: 'Quiz Management', icon: HelpCircle }
];

export default function AddAnatomy() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      labels: [{ name: '', description: '' }],
      quizzes: [{ question: '', options: ['', '', '', ''], correctOption: '0' }]
    }
  });

  const { fields: labelFields, append: appendLabel, remove: removeLabel } = useFieldArray({ control, name: "labels" });
  const { fields: quizFields, append: appendQuiz, remove: removeQuiz } = useFieldArray({ control, name: "quizzes" });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data) => {
    console.log(data);
    alert('Anatomy Module created successfully!');
    navigate('/anatomy');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Anatomy Title *</label>
                <input {...register('title')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. Brain Stem Structure" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20">
                  <option value="">Select Category</option>
                  <option value="neuro">Neuro Anatomy</option>
                  <option value="headneck">Head & Neck</option>
                  <option value="thorax">Thorax</option>
                  <option value="abdomen">Abdomen</option>
                  <option value="pelvis">Pelvis</option>
                  <option value="msk">Musculoskeletal</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Description</label>
                <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary focus-within:ring-brand-primary/20">
                  <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                    <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                    <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                    <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">U</span>
                    <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100 font-serif font-bold">List</span>
                  </div>
                  <textarea {...register('description')} rows={5} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Detailed description of the anatomy content..." />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Medical Image Management</h3>
            <div className="space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                Upload high-resolution CT or MRI scans (JPG, PNG, WEBP, or DICOM preview images). You can upload multiple slices for a single study.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">CT Image Upload</label>
                  <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                    <Upload className="w-8 h-8 mb-2 group-hover:text-brand-primary transition-colors" />
                    <span className="text-sm font-medium">Drag & Drop CT Scans</span>
                    <span className="text-xs mt-1">Select multiple files to upload slices.</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">MRI Image Upload</label>
                  <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                    <Upload className="w-8 h-8 mb-2 group-hover:text-brand-primary transition-colors" />
                    <span className="text-sm font-medium">Drag & Drop MRI Scans</span>
                    <span className="text-xs mt-1">Select multiple files to upload slices.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2 flex items-center gap-2">
              Label Management <span className="text-xs font-normal text-text-muted bg-gray-100 px-2 py-0.5 rounded ml-2">Interactive Marker Placement</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mock Interactive Canvas */}
              <div className="lg:col-span-2">
                <div className="bg-gray-100 border border-gray-200 rounded-xl aspect-[4/3] relative flex items-center justify-center overflow-hidden group cursor-crosshair">
                  <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/1e293b/0b1f4d.png?text=CT/MRI+Scan+View')] bg-cover bg-center mix-blend-multiply opacity-80"></div>
                  <span className="relative z-10 bg-black/60 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none group-hover:opacity-0 transition-opacity">
                    Click anywhere on the image to place a label marker
                  </span>
                  
                  {/* Mock Placed Markers */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-brand-accent rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform flex items-center justify-center">
                    <div className="absolute -top-8 bg-white text-text-main text-xs font-bold px-2 py-1 rounded shadow whitespace-nowrap">Corpus Callosum</div>
                  </div>
                  <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-brand-accent rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform flex items-center justify-center">
                    <div className="absolute -top-8 bg-white text-text-main text-xs font-bold px-2 py-1 rounded shadow whitespace-nowrap">Cerebellum</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Crosshair className="w-3.5 h-3.5" /> Drag markers to reposition</span>
                  <span>Zoom: 100%</span>
                </div>
              </div>

              {/* Label List Sidebar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-main text-sm">Anatomy Labels</h4>
                  <button 
                    type="button"
                    onClick={() => appendLabel({ name: '', description: '' })}
                    className="text-xs font-medium text-brand-primary hover:text-brand-accent flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Label
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {labelFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-white border border-gray-200 rounded-xl relative group">
                      <button 
                        type="button" 
                        onClick={() => removeLabel(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                          <input 
                            {...register(`labels.${index}.name`)} 
                            className="w-full text-sm font-bold border-b border-gray-200 focus:border-brand-primary focus:outline-none pb-1 bg-transparent placeholder:font-normal" 
                            placeholder="Label Name (e.g. Liver)" 
                          />
                        </div>
                        <textarea 
                          {...register(`labels.${index}.description`)} 
                          rows={2} 
                          className="w-full text-xs text-text-muted bg-gray-50 border border-gray-200 rounded p-2 focus:outline-none focus:border-brand-primary" 
                          placeholder="Brief description or clinical relevance..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                Quiz Management
              </h3>
              <button 
                type="button"
                onClick={() => appendQuiz({ question: '', options: ['', '', '', ''], correctOption: '0' })}
                className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/20 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>
            
            <div className="space-y-6">
              {quizFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 relative">
                  <div className="absolute top-6 right-6">
                    <button 
                      type="button"
                      onClick={() => removeQuiz(index)}
                      className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-text-main mb-4 flex items-center gap-2">
                    <span className="bg-brand-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                    Question Setup
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Question Text</label>
                      <input 
                        {...register(`quizzes.${index}.question`)} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-white" 
                        placeholder="e.g. Identify the structure marked by the red arrow." 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['Option A', 'Option B', 'Option C', 'Option D'].map((optLabel, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            {...register(`quizzes.${index}.correctOption`)} 
                            value={String(optIdx)} 
                            className="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300" 
                            title="Mark as correct answer"
                          />
                          <input 
                            {...register(`quizzes.${index}.options.${optIdx}`)} 
                            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary bg-white" 
                            placeholder={optLabel} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
            onClick={() => navigate('/anatomy')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Anatomy Content</h1>
            <p className="text-sm text-text-muted mt-1">Design an interactive anatomy learning module.</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
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
                  <span className={clsx("text-xs font-bold hidden sm:block absolute -bottom-6 w-max text-center", currentStep >= step.id ? "text-brand-primary" : "text-gray-400")}>
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

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8 mt-12">
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
            
            {currentStep < 4 ? (
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
                <Save className="w-4 h-4" /> Publish Module
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
