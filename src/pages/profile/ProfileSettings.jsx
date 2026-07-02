import React, { useState } from 'react';
import { User, Shield, Laptop, Bell, Activity, Camera, Save, LogOut, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Laptop },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'activity', label: 'Activity Log', icon: Activity },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Profile Settings</h1>
          <p className="text-sm text-text-muted mt-1">Manage your account information, security, and preferences.</p>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Completion', value: '95%', icon: CheckCircle, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Security Score', value: 'High', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Active Sessions', value: '2 Devices', icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Last Login', value: 'Today, 08:30 AM', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-0.5">{stat.label}</p>
              <p className="text-lg font-bold text-text-main">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-200 p-6 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-brand-primary shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8">
          
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Personal Information</h2>
              
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                     <User className="w-10 h-10 text-brand-primary" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main">Admin User</h3>
                  <p className="text-sm text-text-muted">Super Administrator</p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded text-xs font-bold hover:bg-brand-primary/20">Change Photo</button>
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded text-xs font-bold hover:bg-gray-50">Remove</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Full Name</label>
                  <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Email Address</label>
                  <input type="email" defaultValue="admin@reefathradiology.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Mobile Number</label>
                  <input type="text" defaultValue="+44 7700 900077" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Designation</label>
                  <input type="text" defaultValue="Course Director" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Bio / About Me</label>
                  <textarea rows={4} defaultValue="Platform Administrator and Course Director for FRCR modules." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary leading-relaxed" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors">
                   <Save className="w-4 h-4" /> Save Changes
                 </button>
              </div>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Security Settings</h2>
              
              <div className="space-y-6 max-w-md">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Change Password</h3>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                  <p className="text-xs text-text-muted mt-1.5">Must be at least 8 characters, with a number and symbol.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors">
                  Update Password
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-6">
                 <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
                 <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-bold text-sm text-text-main">Authenticator App</p>
                      <p className="text-xs text-text-muted">Use an app like Google Authenticator to secure your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded text-sm font-bold text-gray-700 hover:bg-gray-50">Enable</button>
                 </div>
              </div>
            </div>
          )}

          {/* Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-text-main">Active Sessions</h2>
                <button className="text-red-600 text-sm font-bold hover:text-red-700">Logout All Devices</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { device: 'MacBook Pro (Windows 11)', browser: 'Chrome', ip: '192.168.1.1', time: 'Current Session', current: true },
                  { device: 'iPhone 14 Pro', browser: 'Safari Mobile', ip: '10.0.0.5', time: 'Yesterday, 14:30', current: false },
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-brand-primary/30 transition-colors bg-white">
                     <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                         <Laptop className="w-5 h-5 text-gray-500" />
                       </div>
                       <div>
                         <p className="font-bold text-sm text-text-main flex items-center gap-2">
                           {session.device} 
                           {session.current && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase rounded font-bold">This Device</span>}
                         </p>
                         <p className="text-xs text-text-muted mt-0.5">{session.browser} • IP: {session.ip}</p>
                         <p className="text-xs text-text-muted mt-0.5">{session.time}</p>
                       </div>
                     </div>
                     {!session.current && (
                       <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Logout Session">
                         <LogOut className="w-4 h-4" />
                       </button>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Account Preferences</h2>
              
              <div className="space-y-6">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-text-main">Email Notifications for New Registrations</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-text-main">System & Maintenance Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-text-main">Security Alerts & Suspicious Logins</span>
                  </label>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-6">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-wider">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Language</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Time Zone</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                      <option value="ist">IST (Indian Standard Time)</option>
                      <option value="utc">UTC (Coordinated Universal Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                 <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors">
                   <Save className="w-4 h-4" /> Save Preferences
                 </button>
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Activity Log</h2>
              
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-primary/20 before:via-gray-200 before:to-transparent">
                {[
                  { action: 'Logged in successfully', time: 'Today, 08:30 AM', type: 'login' },
                  { action: 'Updated security settings', time: 'Yesterday, 15:45', type: 'security' },
                  { action: 'Profile photo changed', time: 'Oct 24, 2023, 11:20', type: 'profile' },
                  { action: 'Password changed successfully', time: 'Oct 15, 2023, 09:10', type: 'security' },
                ].map((log, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 relative z-10 border-4 border-white shadow-sm ring-1 ring-gray-100">
                      {log.type === 'login' && <Laptop className="w-5 h-5 text-blue-500" />}
                      {log.type === 'security' && <Shield className="w-5 h-5 text-emerald-500" />}
                      {log.type === 'profile' && <User className="w-5 h-5 text-brand-primary" />}
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-text-main">{log.action}</p>
                      <p className="text-xs text-text-muted mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
