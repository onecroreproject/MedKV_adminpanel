import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Video, Film, FolderOpen, 
  HelpCircle, Activity, Stethoscope, BarChart2, Bell, 
  Settings, LogOut 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const menuItems = [
  { name: 'Dashboard', path: '/faculty-dashboard', icon: LayoutDashboard },
  { name: 'My Courses', path: '/faculty-dashboard/courses', icon: BookOpen },
  { name: 'Live Classes', path: '/faculty-dashboard/live-classes', icon: Video },
  { name: 'Recorded Sessions', path: '/faculty-dashboard/recordings', icon: Film },
  { name: 'Case Library', path: '/faculty-dashboard/cases', icon: FolderOpen },
  { name: 'MCQ Question Bank', path: '/faculty-dashboard/mcq', icon: HelpCircle },
  { name: 'Anatomy Module', path: '/faculty-dashboard/anatomy', icon: Activity },
  { name: 'Pathology Module', path: '/faculty-dashboard/pathology', icon: Stethoscope },
  { name: 'Student Performance', path: '/faculty-dashboard/performance', icon: BarChart2 },
  { name: 'Notifications', path: '/faculty-dashboard/notifications', icon: Bell },
  { name: 'Profile Settings', path: '/faculty-dashboard/profile', icon: Settings },
];

export default function FacultySidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/faculty/login');
  };

  return (
    <aside
      className={twMerge(
        clsx(
          "bg-bg-sidebar text-white w-64 min-h-screen flex flex-col transition-all duration-300 fixed z-20 overflow-y-auto",
          { "-translate-x-full": !isOpen, "translate-x-0": isOpen },
          "lg:translate-x-0 lg:static lg:block"
        )
      )}
    >
      <div className="p-6 sticky top-0 bg-bg-sidebar z-10 border-b border-gray-800">
        <h2 className="text-xl font-bold text-brand-accent flex items-center gap-2 leading-tight">
          Dr. Sam Reefath<br />Radiology Academy
        </h2>
        <div className="mt-2 text-xs text-text-muted font-medium uppercase tracking-wider">
          Faculty Portal
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/faculty-dashboard'}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-brand-primary text-white border-l-4 border-brand-accent shadow-sm" 
                  : "text-text-muted hover:bg-gray-800/50 hover:text-white border-l-4 border-transparent"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx("w-5 h-5", isActive ? "text-brand-accent" : "text-text-muted group-hover:text-brand-accent")} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-text-muted hover:bg-gray-800/50 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-text-muted group-hover:text-status-error" />
          Logout
        </button>
      </div>
    </aside>
  );
}
