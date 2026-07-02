import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Activity, LayoutList, MessageSquare, ImageIcon, Video, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function PathologyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const disease = {
    id: id || 'PATH-001',
    name: 'Glioblastoma Multiforme',
    category: 'Neurology',
    uploadedBy: 'Dr. Sarah Connor',
    uploadDate: 'Oct 26, 2023',
    status: 'Pending Review',
    description: 'Glioblastoma multiforme (GBM) is the most common and most aggressive malignant primary brain tumor in adults. It involves glial cells and accounts for 52% of all functional tissue brain tumor cases and 20% of all intracranial tumors.',
    findings: [
      'Thick, irregular ring enhancement on post-contrast T1-weighted images.',
      'Central necrosis typically seen as T1 hypointense and T2 hyperintense region.',
      'Extensive surrounding vasogenic edema.',
      'Significant mass effect resulting in midline shift.',
      'Crossing the corpus callosum (Butterfly glioma pattern).'
    ],
    differentials: ['Primary CNS Lymphoma', 'Brain Metastasis', 'Cerebral Abscess', 'Tumefactive Demyelinating Lesion']
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/pathology')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pathology List
        </button>
        <div className="flex flex-wrap gap-3">
          {disease.status === 'Pending Review' && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm">
                <CheckCircle className="w-4 h-4" /> Approve Content
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100">
                <XCircle className="w-4 h-4" /> Reject / Request Changes
              </button>
              <div className="w-px h-8 bg-gray-200 mx-2 self-center hidden sm:block"></div>
            </>
          )}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-500 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Info Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20 shrink-0">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status={disease.status === 'Pending Review' ? 'warning' : 'success'}>{disease.status}</Badge>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider">{disease.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{disease.name}</h1>
            <p className="text-text-muted text-sm mt-1">Submitted by <strong>{disease.uploadedBy}</strong> on {disease.uploadDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Textual Data */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">A. Description</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-text-muted leading-relaxed">{disease.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <LayoutList className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">B. Key Radiological Findings</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {disease.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-muted">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0"></span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-text-main">C. Differential Diagnosis</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {disease.differentials.map((diff, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-blue-50 text-brand-primary border border-blue-100 rounded-md text-sm font-medium">
                    {diff}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Media Data */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-primary" /> D. Key Images</h3>
              <span className="text-xs font-medium text-text-muted">3 Images</span>
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(img => (
                <div key={img} className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden group border border-gray-200">
                  <div className="absolute inset-0 bg-[url('https://placehold.co/400x300/1e293b/cbd5e1.png?text=MRI+Finding')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-zoom-in backdrop-blur-sm">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">MRI T1+C</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><Video className="w-4 h-4 text-brand-primary" /> E. Video Explanation</h3>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden flex items-center justify-center border border-gray-800">
                 <Video className="w-8 h-8 text-gray-600" />
                 <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">No Video Attached</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
