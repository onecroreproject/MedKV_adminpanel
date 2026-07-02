import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CreditCard, Clock, ShieldBan, User, Calendar, BookOpen, AlertCircle, X } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const [activeModal, setActiveModal] = useState(null); // 'extend' | 'suspend' | null

  const subData = {
    id: id || 'SUB-4021',
    student: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+44 7700 900077',
    plan: 'Premium Membership',
    type: 'Annual',
    start: 'Oct 26, 2023',
    expiry: 'Oct 26, 2024',
    remaining: 365,
    status: 'Active',
    coursesIncluded: 24,
    coursesActive: 5
  };

  const handleExtend = (data) => {
    console.log("Extend Data:", data);
    alert('Subscription extended successfully!');
    setActiveModal(null);
  };

  const handleSuspend = (data) => {
    console.log("Suspend Data:", data);
    alert('Subscription suspended!');
    setActiveModal(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 relative">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/subscriptions')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subscriptions
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <CreditCard className="w-4 h-4" /> Payment History
          </button>
          <button 
            onClick={() => setActiveModal('suspend')}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <ShieldBan className="w-4 h-4" /> Suspend
          </button>
          <button 
            onClick={() => setActiveModal('extend')}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm"
          >
            <Clock className="w-4 h-4" /> Extend Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Student Info & Course Access */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-text-main text-sm uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2"><User className="w-4 h-4"/> Student Profile</h3>
             <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-text-main">{subData.student}</p>
                  <p className="text-xs text-text-muted mt-0.5">{subData.email}</p>
                  <p className="text-xs text-text-muted mt-0.5">{subData.phone}</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Student ID</p>
                  <p className="text-sm font-mono text-text-main mt-1">STD-2023-891</p>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-text-main text-sm uppercase tracking-wider border-b border-gray-100 pb-2 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Course Access</h3>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-2xl font-bold text-text-main">{subData.coursesIncluded}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-500 mt-1">Included</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-600">{subData.coursesActive}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-700 mt-1">Active</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col: Subscription Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4"/> Subscription Details
              </h3>
              <Badge status="success">{subData.status}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
               <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Current Plan</p>
                  <p className="text-lg font-bold text-brand-primary">{subData.plan}</p>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{subData.type} Billing</span>
               </div>
               
               <div className="bg-brand-primary/5 rounded-xl p-4 border border-brand-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-brand-primary">{subData.remaining}</p>
                    <p className="text-xs font-bold text-brand-primary/70 uppercase tracking-wider mt-1">Days Remaining</p>
                  </div>
               </div>

               <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> Start Date</p>
                  <p className="text-sm font-medium text-text-main">{subData.start}</p>
               </div>
               
               <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Expiry Date</p>
                  <p className="text-sm font-medium text-text-main">{subData.expiry}</p>
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Extend Modal Overlay */}
      {activeModal === 'extend' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-text-main text-lg">Extend Subscription</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit(handleExtend)} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Student</label>
                <input type="text" disabled value={subData.student} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Current Expiry</label>
                  <input type="text" disabled value={subData.expiry} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Extension</label>
                  <select {...register('extension')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                    <option value="1m">1 Month</option>
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="12m">12 Months</option>
                  </select>
                </div>
              </div>
              <div className="bg-brand-primary/5 p-4 rounded-lg border border-brand-primary/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-main">New Expiry Preview</p>
                  <p className="text-xs text-text-muted">The new expiry date will be recalculated upon confirmation.</p>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90">Confirm Extension</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Modal Overlay */}
      {activeModal === 'suspend' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
              <h3 className="font-bold text-red-700 text-lg flex items-center gap-2"><ShieldBan className="w-5 h-5"/> Suspend Subscription</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit(handleSuspend)} className="p-6 space-y-5">
              <p className="text-sm text-text-muted mb-4">You are about to suspend the active subscription for <span className="font-bold text-text-main">{subData.student}</span>. Course access will be revoked immediately.</p>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Suspension Reason *</label>
                <select {...register('reason')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20">
                  <option value="payment">Payment Issue</option>
                  <option value="policy">Policy Violation</option>
                  <option value="request">Student Request</option>
                  <option value="other">Other / Manual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Duration</label>
                <select {...register('suspendDuration')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-red-500">
                  <option value="indefinite">Indefinite (Until manually resumed)</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Confirm Suspension</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
