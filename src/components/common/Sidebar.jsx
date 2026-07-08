import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, Video, 
  Film, Activity, Stethoscope, FolderOpen, HelpCircle, 
  FileText, CalendarDays, FileCode, CheckSquare, Bell, 
  Award, CreditCard, Repeat, ShieldCheck, User, LogOut, Layout, Settings, Search 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Students', path: '/students', icon: Users },
  //{ name: 'Faculty', path: '/faculty', icon: UserCheck },
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'Categories', path: '/categories', icon: FolderOpen },
  { name: 'Live Classes', path: '/live-classes', icon: Video },
  { name: 'Recordings', path: '/recordings', icon: Film },
  // { name: 'Anatomy Module', path: '/anatomy', icon: Activity },
  // { name: 'Pathology Module', path: '/pathology', icon: Stethoscope },
  // { name: 'Case Library', path: '/cases', icon: FolderOpen },
  // { name: 'MCQ Question Bank', path: '/mcq', icon: HelpCircle },
  // { name: 'Mock Exams', path: '/exams', icon: FileText },
  // { name: 'Daily Learning', path: '/daily-learning', icon: CalendarDays },
  // { name: 'Reporting Templates', path: '/templates', icon: FileCode },
  // { name: 'Protocols', path: '/protocols', icon: CheckSquare },
  // { name: 'Notifications', path: '/notifications', icon: Bell },
  // { name: 'Certificates', path: '/certificates', icon: Award },
  { name: 'Payment Management', path: '/payments', icon: CreditCard },
  // { name: 'Subscriptions', path: '/subscriptions', icon: Repeat },
  //{ name: 'Ads Management', path: '/ads', icon: Layout },
  { name: 'Enquiries / Leads', path: '/enquiries', icon: Users },
  { name: 'Support Tickets', path: '/tickets', icon: HelpCircle },
  // { name: 'Admins & Roles', path: '/admins', icon: ShieldCheck },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
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
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-brand-primary text-white" 
                  : "text-text-muted hover:bg-gray-800/50 hover:text-white"
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
