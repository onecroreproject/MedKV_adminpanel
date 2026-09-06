import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronDown, Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Dynamic Title Portal */}
        <div id="topbar-title-portal" className="hidden sm:block font-bold text-lg text-text-main whitespace-nowrap"></div>

        {/* Dynamic Search Portal */}
        <div id="topbar-search-portal" className="hidden md:flex items-center flex-1 max-w-md ml-4"></div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Dynamic Actions Portal */}
        <div id="topbar-actions-portal" className="hidden sm:flex items-center gap-3"></div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />

        </button>

        
       
      </div>
    </header>
  );
}
