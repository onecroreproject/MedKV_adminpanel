import React, { useState } from 'react';
import { Shield, ShieldAlert, MonitorPlay, MousePointerClick, FileType2, Download, AlertTriangle } from 'lucide-react';

export default function SecuritySettings({ settings, setSettings, handleSave, isSaving }) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
  };

  const onSaveClick = async () => {
    await handleSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const FeatureToggle = ({ title, description, settingKey, icon: Icon }) => (
    <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:border-blue-500/30 hover:bg-slate-50 transition-all">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${settings[settingKey] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
          <p className="text-xs text-slate-500 max-w-sm">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={settings[settingKey] || false} 
          onChange={() => handleToggle(settingKey)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-blue-600" />
            Content Protection & Security
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage global security policies to protect academy assets.</p>
        </div>
        <button
          onClick={onSaveClick}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Security settings have been updated globally.
        </div>
      )}

      {/* Global Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FeatureToggle 
          title="Right-Click & DevTools Protection" 
          description="Disables right-click menus and prevents opening developer tools (Ctrl+Shift+I, etc.) to inspect elements."
          settingKey="enableRightClickProtection"
          icon={MousePointerClick}
        />
        <FeatureToggle 
          title="Copy & Paste Protection" 
          description="Blocks text selection and keyboard shortcuts (Ctrl+C, Ctrl+X, Ctrl+P, Ctrl+U) to prevent copying notes."
          settingKey="enableCopyPasteProtection"
          icon={FileType2}
        />
        <FeatureToggle 
          title="Dynamic Watermarking" 
          description="Overlays a repeating, semi-transparent watermark containing the student's name, ID, and timestamp on protected pages."
          settingKey="enableWatermarking"
          icon={MonitorPlay}
        />
        <FeatureToggle 
          title="Exam Security Mode" 
          description="Enforces full-screen during exams and monitors tab-switching/window blurring. Auto-submits on 3rd violation."
          settingKey="enableExamSecurity"
          icon={ShieldAlert}
        />
        <FeatureToggle 
          title="Download Restrictions" 
          description="Hides download buttons on videos, PDFs, and resources unless explicitly allowed by the instructor."
          settingKey="enableDownloadRestrictions"
          icon={Download}
        />
      </div>

      {/* Security Alerts / Mock Data */}
      <div className="mt-8">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
          Recent Security Events
        </h3>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Violation Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">Today, 10:45 AM</td>
                <td className="px-6 py-4">dr.smith@example.com</td>
                <td className="px-6 py-4"><span className="text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded">Copy Attempt (Ctrl+C)</span></td>
                <td className="px-6 py-4">FRCR 2A Notes Module</td>
                <td className="px-6 py-4 text-emerald-600 font-medium">Blocked</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
