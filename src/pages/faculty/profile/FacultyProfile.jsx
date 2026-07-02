import React from 'react';
import { Camera, Mail, Phone, MapPin, Briefcase, Award, Save, Lock } from 'lucide-react';

export default function FacultyProfile() {
  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B1F4D] mb-1">Profile Settings</h1>
        <p className="text-[#60738A] text-sm">Manage your personal information, qualifications, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0B1F4D] to-blue-900 mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                SJ
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#0B1F4D] hover:text-[#C89B3C] hover:border-[#C89B3C] transition-colors shadow-sm">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#0B1F4D]">Dr. Sarah Jenkins</h2>
            <p className="text-sm font-semibold text-[#C89B3C] mt-1 uppercase tracking-wider">Senior Radiologist</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-[#60738A]">
                <Mail className="w-4 h-4 text-[#0B1F4D]" /> sarah.j@academy.com
              </div>
              <div className="flex items-center gap-3 text-sm text-[#60738A]">
                <Phone className="w-4 h-4 text-[#0B1F4D]" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-sm text-[#60738A]">
                <MapPin className="w-4 h-4 text-[#0B1F4D]" /> London, UK
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-[#0B1F4D] mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C89B3C]" /> Security
            </h3>
            <button className="w-full py-2.5 border border-gray-200 text-[#0B1F4D] font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Change Password
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-[#0B1F4D] mb-6">Personal Information</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">First Name</label>
                  <input type="text" defaultValue="Sarah" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Last Name</label>
                  <input type="text" defaultValue="Jenkins" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400" /> Designation</label>
                  <input type="text" defaultValue="Senior Radiologist" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 flex items-center gap-2"><Award className="w-4 h-4 text-gray-400" /> Experience</label>
                  <input type="text" defaultValue="15 Years" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">Biography</label>
                <textarea rows={4} defaultValue="Dr. Sarah Jenkins is a highly experienced radiologist specializing in neuro-imaging and advanced MRI protocols. With over 15 years in clinical practice and academic teaching..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all"></textarea>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#0B1F4D] mb-4">Social Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">LinkedIn</label>
                    <input type="text" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">ResearchGate / Publications</label>
                    <input type="text" placeholder="https://researchgate.net/..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#C89B3C] focus:bg-white outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3">
                <button type="button" className="px-6 py-2.5 text-sm font-bold text-white bg-[#0B1F4D] hover:bg-[#15347B] rounded-xl shadow-md transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
            
          </div>
        </div>

      </div>
    </div>
  );
}
