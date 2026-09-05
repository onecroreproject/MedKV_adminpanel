import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Server, Radio, Database, Cpu, HardDrive, Clock, Globe,
  CheckCircle, XCircle, RefreshCw, Activity, Key, Wifi
} from 'lucide-react';

const TABS = ['Live Class Server', 'Backend Server'];

const StatusBadge = ({ status }) => {
  const isOk = status === 'Active' || status === 'Connected';
  return (
    <span className={isOk
      ? 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30'
      : 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30'}>
      {isOk ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {' '}{status}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value, isStatus, mono }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-slate-700/50 last:border-0">
    <div className="flex items-center gap-3 text-slate-400">
      <Icon size={16} className="text-blue-400 flex-shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div>
      {isStatus
        ? <StatusBadge status={value} />
        : <span className={mono ? 'font-mono bg-slate-700 px-2 py-0.5 rounded text-xs text-white' : 'text-sm font-semibold text-white'}>{value || '-'}</span>
      }
    </div>
  </div>
);

export default function DeveloperConsole() {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(import.meta.env.VITE_API_URL + '/developer/server-details', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setData(res.data.data);
      setLastRefreshed(new Date());
    } catch {
      setError('Failed to load. Make sure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetails(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Cpu size={22} className="text-blue-400" />
            </div>
            Developer Console
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time server infrastructure status and configuration.</p>
        </div>
        <button
          onClick={fetchDetails}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {lastRefreshed && <p className="text-xs text-slate-500">Last updated: {lastRefreshed.toLocaleTimeString()}</p>}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <XCircle size={18} /> {error}
        </div>
      )}

      {/* Tabs Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-700">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={'flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-all ' + (activeTab === i ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-white hover:bg-slate-700/50')}
            >
              {i === 0 ? <Radio size={16} /> : <Server size={16} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-72">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <RefreshCw size={32} className="animate-spin text-blue-400" />
              <p className="text-slate-500">Loading server details...</p>
            </div>
          ) : data && activeTab === 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Activity size={18} className="text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">LiveKit WebRTC SFU Server</span>
              </div>
              <InfoRow icon={Globe}        label="LiveKit Server URL"  value={data.liveClassServer.liveKitUrl} mono />
              <InfoRow icon={Wifi}         label="LiveKit Status"      value={data.liveClassServer.status} isStatus />
              <InfoRow icon={Key}          label="API Key"             value={data.liveClassServer.apiKey} mono />
              <InfoRow icon={Radio}        label="Socket.IO Signaling" value={data.liveClassServer.socketIoStatus} isStatus />
              <InfoRow icon={Globe}        label="Allowed Origins"     value={data.liveClassServer.corsOrigins} mono />
            </div>
          ) : data && activeTab === 1 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <Server size={18} className="text-green-400" />
                <span className="text-sm text-green-300 font-medium">Node.js Express Backend API</span>
              </div>
              <InfoRow icon={Database}     label="Database Status"  value={data.backendServer.databaseStatus} isStatus />
              <InfoRow icon={Globe}        label="Database Host"    value={data.backendServer.databaseHost} mono />
              <InfoRow icon={CheckCircle}  label="Environment"      value={data.backendServer.environment} mono />
              <InfoRow icon={Server}       label="Listening Port"   value={String(data.backendServer.port)} />
              <InfoRow icon={Activity}     label="Node.js Version"  value={data.backendServer.nodeVersion} />
              <InfoRow icon={Cpu}          label="Platform"         value={data.backendServer.platform + ' (' + data.backendServer.architecture + ')'} />
              <InfoRow icon={Clock}        label="Server Uptime"    value={data.backendServer.uptime} />
              <InfoRow icon={HardDrive}    label="Total RAM"        value={data.backendServer.totalMemory} />
              <InfoRow icon={HardDrive}    label="Free RAM"         value={data.backendServer.freeMemory} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
