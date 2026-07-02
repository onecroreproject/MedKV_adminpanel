import React from 'react';
import { Bell, Send, Clock, Users, BookOpen } from 'lucide-react';

export default function FacultyNotifications() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Notifications</h1>
        <p className="text-[#60738A] text-sm">Send course updates, live class reminders, and announcements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composer */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#0B1F4D] mb-5">Compose Notification</h2>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Notification Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 border border-[#C89B3C] bg-amber-50 rounded-xl cursor-pointer">
                    <input type="radio" name="type" className="text-[#C89B3C] focus:ring-[#C89B3C]" defaultChecked />
                    <span className="text-sm font-semibold text-[#0B1F4D]">Course Update</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 hover:border-[#C89B3C] rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="type" className="text-[#C89B3C] focus:ring-[#C89B3C]" />
                    <span className="text-sm font-medium text-[#60738A]">Live Reminder</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 hover:border-[#C89B3C] rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="type" className="text-[#C89B3C] focus:ring-[#C89B3C]" />
                    <span className="text-sm font-medium text-[#60738A]">Assignment</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-200 hover:border-[#C89B3C] rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="type" className="text-[#C89B3C] focus:ring-[#C89B3C]" />
                    <span className="text-sm font-medium text-[#60738A]">General</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Target Audience (Course)</label>
                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all text-[#1A1A1A]">
                  <option>All My Students</option>
                  <option>FRCR Part 1 Physics Revision</option>
                  <option>MRI Safety Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Notification Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Reminder: Live Class Tomorrow"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Message Content</label>
                <textarea 
                  rows={4}
                  placeholder="Type your message here..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" className="px-5 py-2.5 text-sm font-semibold text-[#60738A] bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Schedule
                </button>
                <button type="button" className="px-6 py-2.5 text-sm font-bold text-white bg-[#0B1F4D] hover:bg-[#15347B] rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Now
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-5">Recent Broadcasts</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">New Module Available</h4>
                  <p className="text-xs text-[#60738A] mt-0.5">Sent to: FRCR Part 1</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">Live Class Starting Soon</h4>
                  <p className="text-xs text-[#60738A] mt-0.5">Sent to: MRI Safety</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Yesterday</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
