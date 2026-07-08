import React, { useState, useEffect } from 'react';
import { Settings, Globe, Phone, Share2, Shield, History, Upload, Save, CheckCircle, Activity, Users, AlertCircle, Clock, Lock, FileText } from 'lucide-react';
import SecuritySettings from './SecuritySettings';
import { getSettings, updateSettings } from '../../services/settingsService';
import { uploadFile } from '../../services/uploadService';
import default_icon_logo from '../../assets/logos/dark_logo_transparent.png';
import default_name_logo from '../../assets/logos/company_name_transparent.png';

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      if (data.success) {
        // Ensure policies exist if it's an old document
        if (!data.data.policies) {
          data.data.policies = { termsAndConditions: '', privacyPolicy: '', refundPolicy: '' };
        }
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section) => {
    setIsSaving(true);
    try {
      const dataToSave = {};
      dataToSave[section] = settings[section];
      await updateSettings(dataToSave);
      // Optional: show a success toast here
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (field, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Show uploading state (could add dedicated state for each if needed)
      setIsSaving(true);
      const data = await uploadFile(file);
      if (data.success && data.url) {
        handleChange('general', field, data.url);
      }
    } catch (error) {
      console.error(`Failed to upload ${field}:`, error);
      alert(`Failed to upload image. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'security', label: 'Content Security', icon: Lock },
    { id: 'auth-security', label: 'Auth Policies', icon: Shield },
    { id: 'policies', label: 'Legal Policies', icon: FileText },
    { id: 'history', label: 'Settings History', icon: History },
  ];

  if (isLoading || !settings) {
    return <div className="p-8 text-center text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Platform Settings</h1>
          <p className="text-sm text-text-muted mt-1">Manage academy branding, contact details, and security policies.</p>
        </div>
      </div>

      {/* KPI Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Website Status', value: 'Online / Secure', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Active Admins', value: '4 Users', icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Security Score', value: '98/100', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Last Update', value: new Date(settings.updatedAt || Date.now()).toLocaleDateString(), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        
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
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">General Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Website Name</label>
                    <input type="text" value={settings.general.websiteName} onChange={(e) => handleChange('general', 'websiteName', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Platform Tagline</label>
                    <input type="text" value={settings.general.tagline} onChange={(e) => handleChange('general', 'tagline', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-medium text-text-main mb-1.5">Icon Logo (Emblem)</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors text-center relative group block">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('logoUrl', e)} />
                      {settings.general.logoUrl || default_icon_logo ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={settings.general.logoUrl || default_icon_logo} 
                            alt="Current Icon Logo" 
                            className="h-16 w-auto object-contain mb-3 opacity-90 group-hover:opacity-100 transition-opacity" 
                          />
                          <span className="text-sm font-medium text-brand-primary">Click to change Icon Logo</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-brand-primary/50 mb-2" />
                          <span className="text-sm font-medium text-text-main">Drag & Drop or Click to upload Icon</span>
                        </>
                      )}
                      <span className="text-xs text-gray-400 mt-1">Recommended size: 64x64px (PNG/SVG)</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-medium text-text-main mb-1.5">Name Logo (Typography)</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors text-center relative group block">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload('nameLogoUrl', e)} />
                      {settings.general.nameLogoUrl || default_name_logo ? (
                        <div className="flex flex-col items-center">
                          <img 
                            src={settings.general.nameLogoUrl || default_name_logo} 
                            alt="Current Name Logo" 
                            className="h-8 w-auto object-contain mb-3 opacity-90 group-hover:opacity-100 transition-opacity" 
                          />
                          <span className="text-sm font-medium text-brand-primary">Click to change Name Logo</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-brand-primary/50 mb-2" />
                          <span className="text-sm font-medium text-text-main">Drag & Drop or Click to upload Typography</span>
                        </>
                      )}
                      <span className="text-xs text-gray-400 mt-1">Recommended size: 240x60px (PNG/SVG)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Favicon Upload</label>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors text-center block">
                      <input type="file" accept=".ico,.png,image/*" className="hidden" onChange={(e) => handleFileUpload('faviconUrl', e)} />
                      {settings.general.faviconUrl ? (
                         <div className="flex flex-col items-center">
                           <img src={settings.general.faviconUrl} alt="Favicon" className="w-8 h-8 mb-3" />
                           <span className="text-sm font-medium text-brand-primary">Click to change Favicon</span>
                         </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-brand-primary/50 mb-2" />
                          <span className="text-sm font-medium text-text-main">Upload Favicon (.ico or .png)</span>
                        </>
                      )}
                      <span className="text-xs text-gray-400 mt-1">Recommended size: 32x32px</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-fit sticky top-0">
                  <h3 className="font-bold text-sm text-text-main mb-4 uppercase tracking-wider">Live Branding Preview</h3>
                  
                  {/* Mock Navbar */}
                  <div className="bg-bg-sidebar px-4 py-3 rounded-t-lg flex items-center justify-between border-b border-gray-800">
                     <div className="flex items-center gap-2">
                        <img 
                           src={settings.general.logoUrl || default_icon_logo} 
                           alt="Icon Preview" 
                           className="h-6 w-auto object-contain" 
                        />
                        <img 
                           src={settings.general.nameLogoUrl || default_name_logo} 
                           alt="Name Preview" 
                           className="h-4 w-auto object-contain hidden sm:block" 
                        />
                     </div>
                     <div className="flex gap-2">
                       <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                       <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                     </div>
                  </div>
                  {/* Mock Body */}
                  <div className="bg-white p-4 h-32 rounded-b-lg border border-t-0 border-gray-200">
                     <div className="w-1/2 h-3 bg-gray-200 rounded mb-2"></div>
                     <div className="w-3/4 h-3 bg-gray-200 rounded mb-2"></div>
                     <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                  </div>
                  
                  {/* Mock Browser Tab */}
                  <div className="mt-6 flex bg-gray-200 p-2 rounded-t-lg max-w-[200px]">
                     <div className="bg-white px-3 py-1.5 rounded text-xs flex items-center gap-2 font-medium w-full truncate">
                       <div className="w-3 h-3 rounded bg-brand-primary shrink-0"></div>
                       {settings.general.websiteName}...
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                 <button onClick={fetchSettings} className="px-6 py-2.5 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Reset</button>
                 <button onClick={() => handleSave('general')} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-50">
                   <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                 </button>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-8 animate-fade-in max-w-3xl">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Public Contact Email *</label>
                  <input type="email" value={settings.contact.publicEmail} onChange={(e) => handleChange('contact', 'publicEmail', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Support Email</label>
                  <input type="email" value={settings.contact.supportEmail} onChange={(e) => handleChange('contact', 'supportEmail', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Primary Phone Number *</label>
                  <input type="text" value={settings.contact.primaryPhone} onChange={(e) => handleChange('contact', 'primaryPhone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">WhatsApp Number</label>
                  <input type="text" value={settings.contact.whatsapp} onChange={(e) => handleChange('contact', 'whatsapp', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-1.5">Office Address</label>
                  <textarea rows={3} value={settings.contact.address} onChange={(e) => handleChange('contact', 'address', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary leading-relaxed" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                 <button onClick={() => handleSave('contact')} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-50">
                   <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Contacts'}
                 </button>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-8 animate-fade-in max-w-3xl">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Social Media Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Facebook URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">facebook.com/</span>
                    <input type="text" value={settings.social.facebook} onChange={(e) => handleChange('social', 'facebook', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Instagram URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">instagram.com/</span>
                    <input type="text" value={settings.social.instagram} onChange={(e) => handleChange('social', 'instagram', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">LinkedIn URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">linkedin.com/company/</span>
                    <input type="text" value={settings.social.linkedin} onChange={(e) => handleChange('social', 'linkedin', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">YouTube URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">youtube.com/@</span>
                    <input type="text" value={settings.social.youtube} onChange={(e) => handleChange('social', 'youtube', e.target.value)} className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:border-brand-primary" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                 <button onClick={() => handleSave('social')} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-50">
                   <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Links'}
                 </button>
              </div>
            </div>
          )}

          {/* Content Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <SecuritySettings settings={settings.security} setSettings={(newSecurity) => {
                setSettings(prev => ({...prev, security: newSecurity}));
              }} handleSave={() => handleSave('security')} isSaving={isSaving} />
            </div>
          )}

          {/* Auth Security Tab (Old Security Tab) */}
          {activeTab === 'auth-security' && (
            <div className="space-y-8 animate-fade-in max-w-3xl">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Auth Security Policies</h2>
              
              <div className="space-y-8">
                {/* Password Policy */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-text-main uppercase tracking-wider text-brand-primary">Password Policy</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Minimum Password Length</label>
                    <select value={settings.auth.minPasswordLength} onChange={(e) => handleChange('auth', 'minPasswordLength', Number(e.target.value))} className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                      <option value="8">8 Characters</option>
                      <option value="10">10 Characters</option>
                      <option value="12">12 Characters</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={settings.auth.requireUppercase} onChange={(e) => handleChange('auth', 'requireUppercase', e.target.checked)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                      <span className="text-sm font-medium text-text-main">Require Uppercase Letter</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={settings.auth.requireLowercase} onChange={(e) => handleChange('auth', 'requireLowercase', e.target.checked)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                      <span className="text-sm font-medium text-text-main">Require Lowercase Letter</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={settings.auth.requireNumbers} onChange={(e) => handleChange('auth', 'requireNumbers', e.target.checked)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                      <span className="text-sm font-medium text-text-main">Require Numbers</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={settings.auth.requireSpecial} onChange={(e) => handleChange('auth', 'requireSpecial', e.target.checked)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                      <span className="text-sm font-medium text-text-main">Require Special Character</span>
                    </label>
                  </div>
                </div>

                {/* Session Timeout */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-text-main uppercase tracking-wider text-brand-primary">Session Management</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">Idle Session Timeout</label>
                    <select value={settings.auth.sessionTimeout} onChange={(e) => handleChange('auth', 'sessionTimeout', Number(e.target.value))} className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                      <option value="15">15 Minutes</option>
                      <option value="30">30 Minutes</option>
                      <option value="60">1 Hour</option>
                      <option value="120">2 Hours</option>
                      <option value="0">Never (Not Recommended)</option>
                    </select>
                  </div>
                </div>

                {/* Login Restrictions */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-sm text-text-main uppercase tracking-wider text-brand-primary">Login Restrictions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1.5">Maximum Failed Attempts</label>
                      <select value={settings.auth.maxFailedAttempts} onChange={(e) => handleChange('auth', 'maxFailedAttempts', Number(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                        <option value="3">3 Attempts</option>
                        <option value="5">5 Attempts</option>
                        <option value="10">10 Attempts</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1.5">Account Lock Duration</label>
                      <select value={settings.auth.lockDuration} onChange={(e) => handleChange('auth', 'lockDuration', Number(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary">
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="1440">24 Hours</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input type="checkbox" checked={settings.auth.notifyAdmin} onChange={(e) => handleChange('auth', 'notifyAdmin', e.target.checked)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-medium text-text-main">Notify Admin on Multiple Failed Attempts</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                 <button onClick={() => handleSave('auth')} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-50">
                   <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Security Policies'}
                 </button>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Legal Policies</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Terms and Conditions</label>
                  <textarea 
                    value={settings.policies?.termsAndConditions || ''} 
                    onChange={(e) => handleChange('policies', 'termsAndConditions', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary min-h-[150px]"
                    placeholder="Enter terms and conditions here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Privacy Policy</label>
                  <textarea 
                    value={settings.policies?.privacyPolicy || ''} 
                    onChange={(e) => handleChange('policies', 'privacyPolicy', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary min-h-[150px]"
                    placeholder="Enter privacy policy here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Refund Policy</label>
                  <textarea 
                    value={settings.policies?.refundPolicy || ''} 
                    onChange={(e) => handleChange('policies', 'refundPolicy', e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary min-h-[150px]"
                    placeholder="Enter refund policy here..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100">
                 <button onClick={() => handleSave('policies')} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-50">
                   <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Policies'}
                 </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-text-main border-b border-gray-100 pb-4">Settings History</h2>
              
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-primary/20 before:via-gray-200 before:to-transparent">
                {[
                  { action: 'Security Policy Modified (Timeout changed to 30m)', time: 'Today, 10:15 AM', user: 'Admin User', type: 'shield' },
                  { action: 'Website Logo Updated', time: 'Yesterday, 14:20', user: 'Admin User', type: 'globe' },
                  { action: 'Contact Information Updated', time: 'Oct 24, 2023, 09:30 AM', user: 'Super Admin', type: 'phone' },
                  { action: 'Social Media Links Updated', time: 'Oct 20, 2023, 11:45 AM', user: 'Super Admin', type: 'share' },
                ].map((log, idx) => (
                  <div key={idx} className="relative flex items-start gap-6 pb-6">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 relative z-10 border-4 border-white shadow-sm ring-1 ring-gray-100">
                      {log.type === 'shield' && <Shield className="w-5 h-5 text-emerald-500" />}
                      {log.type === 'globe' && <Globe className="w-5 h-5 text-brand-primary" />}
                      {log.type === 'phone' && <Phone className="w-5 h-5 text-blue-500" />}
                      {log.type === 'share' && <Share2 className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div className="pt-2">
                      <p className="font-bold text-sm text-text-main">{log.action}</p>
                      <p className="text-xs text-text-muted mt-0.5">Updated by {log.user} • {log.time}</p>
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
