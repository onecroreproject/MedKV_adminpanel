import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, MessageSquare, BookOpen, User, Calendar, Image as ImageIcon, Clock } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function ApprovalReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contentData = {
    id: id || 'APP-801',
    title: 'Neuroanatomy Module Update',
    type: 'Anatomy Content',
    author: 'Dr. Sarah Connor',
    date: 'Oct 26, 2023, 10:30 AM',
    status: 'Pending Review',
  };

  const activityLog = [
    { id: 1, admin: 'System', action: 'Content Submitted for Review', time: 'Oct 26, 2023, 10:30 AM' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <button 
          onClick={() => navigate('/approvals')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Queue
        </button>
        <div className="flex flex-wrap gap-3">
          <Badge status="warning">{contentData.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Content Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[800px]">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
               <h1 className="text-2xl font-bold text-text-main">{contentData.title}</h1>
               <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                 <span className="flex items-center gap-1.5"><User className="w-4 h-4"/> {contentData.author}</span>
                 <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {contentData.date}</span>
                 <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4"/> {contentData.type}</span>
               </div>
            </div>
            
            {/* Mockup of Content */}
            <div className="p-8 flex-1 overflow-auto bg-white prose max-w-none">
               <h2>1. Introduction to the Central Nervous System</h2>
               <p>The central nervous system (CNS) consists of the brain and spinal cord. It integrates sensory information and coordinates both conscious and unconscious activity...</p>
               
               <div className="my-8 border border-gray-200 rounded-lg p-2 bg-gray-50 flex flex-col items-center justify-center h-64 text-gray-400">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Sagittal_MRI_Brain_T1.jpg</span>
                  <span className="text-xs">Attachment / Image Preview</span>
               </div>

               <h3>1.1 The Cerebral Hemispheres</h3>
               <p>The cerebrum is divided into two hemispheres by the longitudinal fissure. Each hemisphere consists of a heavily folded outer layer of gray matter...</p>
               <ul>
                 <li>Frontal Lobe: Motor function, problem solving, spontaneity, memory.</li>
                 <li>Parietal Lobe: Sensation, perception, spatial reasoning.</li>
                 <li>Temporal Lobe: Auditory processing, memory.</li>
                 <li>Occipital Lobe: Visual processing.</li>
               </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Reviewer Panel & Audit Trail */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
               <h3 className="font-bold text-text-main flex items-center gap-2"><MessageSquare className="w-4 h-4 text-brand-primary"/> Reviewer Actions</h3>
             </div>
             <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Reviewer Notes</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 leading-relaxed" 
                    placeholder="Enter notes, reasons for rejection, or change requests to be sent to the author..."
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 shadow-sm transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve Content
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-bold hover:bg-brand-primary/10 transition-colors">
                    <AlertCircle className="w-4 h-4" /> Request Changes
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                    <XCircle className="w-4 h-4" /> Reject Content
                  </button>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-primary"/> Audit Trail</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {activityLog.map((log) => (
                <div key={log.id} className="relative flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 relative z-10 border-2 border-white shadow-sm ring-1 ring-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-text-main">{log.action}</p>
                    <p className="text-xs text-text-muted mt-0.5">{log.admin} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
