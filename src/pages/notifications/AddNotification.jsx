import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send, Bell } from 'lucide-react';

export default function AddNotification() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert('Notification sent successfully!');
    navigate('/notifications');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Create Notification</h1>
            <p className="text-sm text-text-muted mt-1">Send a new alert or announcement.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-primary" />
          <h3 className="font-bold text-text-main">Notification Details</h3>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Notification Title *</label>
            <input 
              {...register('title')} 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
              placeholder="e.g. System Maintenance Scheduled" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Notification Type *</label>
            <select {...register('type')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
              <option value="website">Website Notification</option>
              <option value="email">Email Notification</option>
              <option value="sms">SMS Notification</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Target Audience *</label>
            <select {...register('audience')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
              <option value="all_students">All Students</option>
              <option value="selected_students">Selected Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Message *</label>
            <textarea 
              {...register('message')} 
              rows={6} 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 leading-relaxed" 
              placeholder="Type your message here..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <button 
              type="button"
              className="px-4 py-2.5 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Save as Draft
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30"
            >
              <Send className="w-4 h-4" /> Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
