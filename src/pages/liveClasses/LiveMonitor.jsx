import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Activity, Users, Server, Cpu, HardDrive, Wifi, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : 'http://localhost:5000';

export default function LiveMonitor() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeRooms: 0,
    totalParticipants: 0,
    system: {
      cpuUsage: 0,
      freeMemory: 0,
      totalMemory: 0
    },
    rooms: []
  });
  
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Admin needs to authenticate to socket or just join the admin room
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-admin'); // Subscribe to stats
    });

    socket.on('disconnect', () => setIsConnected(false));

    socket.on('system-stats', (data) => {
      setStats(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live System Monitor</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isConnected ? 'Connected to Signaling Server' : 'Disconnected'}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active WebRTC Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeRooms}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Live Participants</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Server CPU Usage</p>
            <p className="text-2xl font-bold text-gray-900">{stats.system.cpuUsage.toFixed(2)}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Server Memory Free</p>
            <p className="text-2xl font-bold text-gray-900">{stats.system.freeMemory.toFixed(2)} MB</p>
          </div>
        </div>
      </div>

      {/* Active Rooms Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-900">Active Classroom Connections</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium">Room ID</th>
                <th className="px-6 py-3 font-medium">Participants</th>
                <th className="px-6 py-3 font-medium">Network Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.rooms.length > 0 ? stats.rooms.map((room, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{room.roomId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {room.participants} connected
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                      <Wifi className="w-3 h-3" /> Healthy
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-sm text-gray-500">
                    No active WebRTC rooms at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
