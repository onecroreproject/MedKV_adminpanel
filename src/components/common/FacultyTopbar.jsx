import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronDown, Menu, UserCheck } from 'lucide-react';

export default function FacultyTopbar({ onMenuClick }) {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search courses, students, cases..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 text-text-main"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Quick Actions */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => setShowQuickActions(!showQuickActions)}
            onBlur={() => setTimeout(() => setShowQuickActions(false), 200)}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-brand-accent" />
            Quick Actions
            <ChevronDown className="w-4 h-4 opacity-70" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">Create MCQ</a>
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">Upload Case</a>
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">Schedule Class</a>
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">Upload Recording</a>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors group">
          <Bell className="w-5 h-5 group-hover:text-brand-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-status-error rounded-full ring-2 ring-white"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowProfile(!showProfile)}
            onBlur={() => setTimeout(() => setShowProfile(false), 200)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-blue-900 flex items-center justify-center text-white font-semibold text-sm border-2 border-transparent group-hover:border-brand-accent transition-all shadow-sm">
              <UserCheck className="w-4 h-4 text-brand-accent" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-text-main leading-none group-hover:text-brand-primary transition-colors">Dr. Sarah Jenkins</p>
              <p className="text-xs text-text-muted mt-1">Senior Radiologist</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted hidden md:block" />
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                <p className="text-sm font-semibold text-text-main">Dr. Sarah Jenkins</p>
                <p className="text-xs text-text-muted">Senior Radiologist</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">My Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-text-main hover:bg-gray-50 hover:text-brand-primary transition-colors">Settings</a>
              <div className="border-t border-gray-100 mt-1 pt-1">
                <a href="#" className="block px-4 py-2 text-sm text-status-error hover:bg-red-50 transition-colors">Sign out</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
