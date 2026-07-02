import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LiveClassCalendar({ sessions }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Helper to check if a session falls on a specific day
  const getSessionsForDay = (day) => {
    return sessions.filter(session => {
      if (!session.date) return false;
      const sessionDate = new Date(session.date);
      return sessionDate.getDate() === day &&
             sessionDate.getMonth() === currentDate.getMonth() &&
             sessionDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Live Now': return 'bg-red-500';
      case 'Scheduled': return 'bg-brand-primary';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-gray-400';
      case 'Rescheduled': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] p-2 bg-gray-50/50 border border-gray-100 rounded-lg"></div>);
    }
    for (let i = 1; i <= days; i++) {
      const daySessions = getSessionsForDay(i);
      const isToday = new Date().getDate() === i && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
      
      cells.push(
        <div key={`day-${i}`} className={`min-h-[120px] p-2 border border-gray-100 rounded-lg bg-white transition-colors hover:border-brand-primary/30 flex flex-col gap-1 ${isToday ? 'ring-1 ring-brand-primary/50 shadow-sm' : ''}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-brand-primary text-white' : 'text-gray-700'}`}>{i}</span>
            {daySessions.length > 0 && <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-1.5 py-0.5 rounded">{daySessions.length} session{daySessions.length > 1 ? 's' : ''}</span>}
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[85px] scrollbar-thin">
            {daySessions.map(session => (
              <div 
                key={session._id} 
                onClick={() => navigate(`/live-classes/${session._id}`)}
                className="text-xs p-1.5 rounded bg-gray-50 border border-gray-100 hover:border-brand-primary/50 cursor-pointer flex flex-col gap-0.5 group transition-colors"
                title={`${session.title} - ${session.time}`}
              >
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(session.status)}`}></div>
                  <span className="truncate group-hover:text-brand-primary font-medium text-gray-700">{session.time}</span>
                </div>
                <span className="truncate text-[10px] text-gray-500 group-hover:text-gray-700 pl-3">{session.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between bg-white gap-4">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-primary" />
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-sm font-medium hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-gray-700">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-gray-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4 bg-gray-50/30 flex-1">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {renderCells()}
        </div>
      </div>
    </div>
  );
}
