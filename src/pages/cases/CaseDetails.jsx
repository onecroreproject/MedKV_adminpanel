import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, FileText, ImageIcon, Settings, SlidersHorizontal, BookOpen } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const caseData = {
    id: id || 'CAS-001',
    title: 'Acoustic Neuroma',
    category: 'Neuro Imaging',
    modality: 'MRI',
    diff: 'Intermediate',
    faculty: 'Dr. Sarah Connor',
    status: 'Published',
    clinicalHistory: 'A 45-year-old female presents with progressive right-sided hearing loss and occasional tinnitus over the last 6 months. No history of trauma. Neurological examination is unremarkable except for decreased hearing in the right ear.',
    findings: 'There is an intensely enhancing mass at the right cerebellopontine angle extending into the internal auditory canal. The mass causes widening of the IAC.',
    diagnosis: 'Vestibular Schwannoma (Acoustic Neuroma)',
    differentials: ['Meningioma', 'Epidermoid Cyst', 'Arachnoid Cyst'],
    pearls: 'The "ice cream on cone" appearance is classic for vestibular schwannoma extending from the CPA into the IAC.'
  };

  const getDiffColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/cases')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Library
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit Case
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-500 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Meta */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge status="success">{caseData.status}</Badge>
              <Badge status={getDiffColor(caseData.diff)}>{caseData.diff}</Badge>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider">{caseData.modality}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">{caseData.title}</h1>
            <p className="text-sm text-text-muted mt-1">Author: {caseData.faculty} • Category: {caseData.category}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="text-right">
              <p className="font-bold text-text-main">Oct 26, 2023</p>
              <p className="text-xs">Published</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Clinical & Diagnosis */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main flex items-center gap-2"><FileText className="w-4 h-4 text-brand-primary" /> Clinical Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Clinical History</h4>
                <p className="text-sm text-text-main leading-relaxed">{caseData.clinicalHistory}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Patient</h4>
                  <p className="text-sm text-text-main">45 y/o, Female</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Symptoms</h4>
                  <p className="text-sm text-text-main">Hearing loss</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main flex items-center gap-2"><Settings className="w-4 h-4 text-brand-primary" /> Diagnosis & Findings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Imaging Findings</h4>
                <p className="text-sm text-text-main leading-relaxed">{caseData.findings}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Final Diagnosis</h4>
                <p className="text-lg font-bold text-emerald-600">{caseData.diagnosis}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Differential Diagnosis</h4>
                <ul className="list-disc list-inside text-sm text-text-main">
                  {caseData.differentials.map(d => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                <h4 className="text-xs uppercase tracking-wider font-bold text-amber-800 mb-1">Diagnostic Pearl</h4>
                <p className="text-sm text-amber-900 italic">{caseData.pearls}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Imaging & Media */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-primary" /> Image Comparison Slider (Mockup)</h3>
              <div className="flex gap-2">
                <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded">T1 Pre-Contrast</span>
                <span className="text-xs font-bold px-2 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded">T1 Post-Contrast</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              {/* Interactive Slider Mockup */}
              <div className="w-full aspect-[16/7] relative rounded-xl overflow-hidden bg-black cursor-ew-resize group shadow-lg border border-gray-200">
                {/* Image 1 (Left) */}
                <div className="absolute inset-0 bg-[url('https://placehold.co/1200x600/1e293b/0f172a.png?text=Pre-Contrast')] bg-cover bg-center"></div>
                
                {/* Image 2 (Right - Cropped via width) */}
                <div className="absolute inset-y-0 right-0 bg-[url('https://placehold.co/1200x600/0b1f4d/1e3a8a.png?text=Post-Contrast')] bg-cover bg-right" style={{ width: '40%' }}></div>
                
                {/* Slider Handle */}
                <div className="absolute inset-y-0 right-[40%] w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] flex items-center justify-center transform translate-x-1/2 group-hover:bg-brand-accent transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-text-muted mt-3">Drag slider left/right to compare imaging sequences.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-primary" /> Educational Content</h3>
            </div>
            <div className="p-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-sm text-text-main mb-2">Quiz Question</h4>
                <p className="text-sm font-medium text-text-main mb-4">Which of the following is the classic radiological sign for Vestibular Schwannoma on MRI?</p>
                <div className="space-y-2">
                  <div className="px-4 py-2 border border-gray-200 rounded text-sm text-text-muted bg-gray-50">A. Dural Tail Sign</div>
                  <div className="px-4 py-2 border border-emerald-500 bg-emerald-50 rounded text-sm text-emerald-700 font-bold flex justify-between">
                    B. Ice Cream on Cone Sign <span>✓ Correct</span>
                  </div>
                  <div className="px-4 py-2 border border-gray-200 rounded text-sm text-text-muted bg-gray-50">C. Target Sign</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
