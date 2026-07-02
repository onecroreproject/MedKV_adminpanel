import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, FileText, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export default function AddQuestion() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert('Question created successfully!');
    navigate('/mcq');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/mcq')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create New Question</h1>
            <p className="text-sm text-text-muted mt-1">Add a new question to the assessment database.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 shadow-sm"
          >
            <Save className="w-4 h-4" /> Publish Question
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Question Details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-primary" />
            <h3 className="font-bold text-text-main">1. Question Details</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Question Text *</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">B</span>
                  <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">I</span>
                  <span className="text-xs font-serif px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">x²</span>
                </div>
                <textarea {...register('questionText')} rows={4} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Enter the complete question here..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Category *</label>
                <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="">Select Category</option>
                  <option value="frcr1">FRCR Part 1</option>
                  <option value="frcr2a">FRCR Part 2A</option>
                  <option value="anatomy">Anatomy</option>
                  <option value="pathology">Pathology</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Question Type *</label>
                <select {...register('type')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="mcq">MCQ (Single Best Answer)</option>
                  <option value="image">Image-Based Question</option>
                  <option value="spot">Spot Diagnosis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Difficulty *</label>
                <select {...register('difficulty')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Answer Options */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-text-main flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-primary" /> 2. Answer Options
            </h3>
            <span className="text-xs text-text-muted">Select the correct answer using the radio button</span>
          </div>
          <div className="p-6 space-y-4">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt} className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg hover:border-brand-primary/30 transition-colors group">
                <div className="pt-2">
                  <input type="radio" name="correctAnswer" value={opt} className="w-4 h-4 text-brand-primary border-gray-300 focus:ring-brand-primary cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Option {opt}</label>
                  <input {...register(`option${opt}`)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder={`Enter Option ${opt}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Explanation */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text-main">3. Detailed Explanation</h3>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary">
              <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">B</span>
                <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer">I</span>
                <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Image</span>
              </div>
              <textarea {...register('explanation')} rows={6} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Provide a detailed explanation for the correct and incorrect options..." />
            </div>
          </div>
        </div>

        {/* Section 4: Image Support (Optional) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text-main flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-primary" /> 4. Image Support (Optional)</h3>
          </div>
          <div className="p-6">
            <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
              <Upload className="w-8 h-8 mb-3 group-hover:text-brand-primary transition-colors" />
              <span className="text-sm font-medium text-text-main">Click to upload or drag & drop</span>
              <span className="text-xs mt-1">Supports MRI, CT, Ultrasound, X-Ray</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
