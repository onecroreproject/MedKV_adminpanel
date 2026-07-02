import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FacultySidebar from '../components/common/FacultySidebar';
import FacultyTopbar from '../components/common/FacultyTopbar';

export default function FacultyLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-dashboard overflow-hidden font-sans">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0B1F4D]/50 backdrop-blur-sm z-10 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <FacultySidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-0">
        <FacultyTopbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-dashboard p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
