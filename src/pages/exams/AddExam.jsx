import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, FileText, Settings, LayoutList, Check, ChevronRight, Search, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Exam Info', icon: FileText },
  { id: 2, name: 'Settings', icon: Settings },
  { id: 3, name: 'Question Assignment', icon: LayoutList }
];

export default function AddExam() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit } = useForm();
  
  // Mock State for Question Assignment
  const [availableQuestions] = useState([
    { id: 'Q-1045', text: 'Most common primary malignant brain tumor?', type: 'MCQ' },
    { id: 'Q-1046', text: 'Identify the structure in the attached CT.', type: 'Image-Based' },
    { id: 'Q-1047', text: '45-year-old female presents with RUQ pain...', type: 'Case-Based' },
  ]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleNext = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const onSubmit = (data) => {
    console.log(data);
    alert('Exam created successfully!');
    navigate('/exams');
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">1. Exam Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Exam Name *</label>
                <input {...register('examName')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. FRCR Part 2A Mock Exam 1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Exam Type *</label>
                <select {...register('examType')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="">Select Exam Type</option>
                  <option value="frcr1">FRCR Part 1</option>
                  <option value="frcr2a">FRCR Part 2A</option>
                  <option value="anatomy">Anatomy Quiz</option>
                  <option value="pathology">Pathology Quiz</option>
                  <option value="rapid">Rapid Reporting</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">2. Exam Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Duration (Minutes) *</label>
                <input type="number" {...register('duration')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. 60" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Total Questions *</label>
                <input type="number" {...register('totalQuestions')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. 100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Passing Percentage *</label>
                <input type="number" {...register('passingPercentage')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="e.g. 70" />
              </div>
            </div>

            <h4 className="text-sm font-bold text-text-main mb-3">Additional Rules</h4>
            <div className="space-y-3">
              {[
                { id: 'randomize', label: 'Randomize Questions' },
                { id: 'showResults', label: 'Show Results Immediately' },
                { id: 'allowRetake', label: 'Allow Retake' },
                { id: 'negativeMarking', label: 'Negative Marking' },
                { id: 'certificate', label: 'Certificate Eligible' },
              ].map(setting => (
                <label key={setting.id} className="flex items-center gap-3">
                  <input type="checkbox" {...register(setting.id)} className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                  <span className="text-sm font-medium text-text-main">{setting.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-lg font-bold text-text-main">3. Question Assignment</h3>
              <div className="text-sm font-medium">
                Selected: <span className="text-brand-primary font-bold">{selectedQuestions.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
              
              {/* Available Questions Pane */}
              <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                  <h4 className="font-bold text-text-main text-sm mb-3">Available Questions</h4>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search question bank..." className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30">
                  {availableQuestions.map(q => {
                    const isSelected = selectedQuestions.find(sq => sq.id === q.id);
                    if (isSelected) return null;
                    return (
                      <div key={q.id} className="p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-between gap-3 group">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-main truncate" title={q.text}>{q.text}</p>
                          <p className="text-[10px] text-gray-500">{q.id} • {q.type}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSelectedQuestions([...selectedQuestions, q])}
                          className="w-7 h-7 rounded-md bg-brand-primary/10 text-brand-primary flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Questions Pane */}
              <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                  <h4 className="font-bold text-text-main text-sm">Selected Questions in Exam</h4>
                  <p className="text-xs text-gray-500 mt-1">Drag to reorder questions.</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-blue-50/30">
                  {selectedQuestions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <LayoutList className="w-8 h-8 mb-2" />
                      <p className="text-sm font-medium">No questions selected yet</p>
                    </div>
                  ) : (
                    selectedQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3 bg-white border border-brand-primary/20 shadow-sm rounded-lg flex items-center justify-between gap-3 group">
                        <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-main truncate" title={q.text}>{q.text}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSelectedQuestions(selectedQuestions.filter(sq => sq.id !== q.id))}
                          className="w-7 h-7 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
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
            onClick={() => navigate('/exams')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Mock Exam</h1>
            <p className="text-sm text-text-muted mt-1">Configure exam settings and assign questions.</p>
          </div>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hidden md:block">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
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
              
              {currentStep < 3 ? (
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
                  <Save className="w-4 h-4" /> Publish Exam
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
