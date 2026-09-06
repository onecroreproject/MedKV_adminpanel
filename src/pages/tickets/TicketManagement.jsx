import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Badge from '../../components/common/Badge';

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [portalsReady, setPortalsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  
  useEffect(() => {
    setPortalsReady(true);
    return () => setPortalsReady(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/tickets');
      if (res.data?.success) {
        setTickets(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const res = await axiosInstance.post(`/tickets/${selectedTicket._id}/reply`, { message: replyText });
      if (res.data?.success) {
        setReplyText('');
        // Update local ticket state
        const updated = res.data.data;
        setTickets(tickets.map(t => t._id === updated._id ? updated : t));
        setSelectedTicket(updated);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send reply');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await axiosInstance.put(`/tickets/${selectedTicket._id}/status`, { status: newStatus });
      if (res.data?.success) {
        const updated = res.data.data;
        setTickets(tickets.map(t => t._id === updated._id ? updated : t));
        setSelectedTicket(updated);
        setStatusUpdate('');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Open': return 'primary';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading tickets...</div>;

  return (
    <div className="space-y-6 pb-12 relative h-full">
      

      <div className="flex gap-6 h-[600px]">
        {/* Ticket List */}
        <div className={`flex-1 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-text-main">Ticket Inbox ({filteredTickets.length})</h2>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
              <div 
                key={ticket._id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 cursor-pointer transition-colors ${selectedTicket?._id === ticket._id ? 'bg-brand-primary/5 border-l-4 border-brand-primary' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                  <span className="text-[10px] text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-sm text-text-main line-clamp-1">{ticket.subject}</h3>
                <p className="text-xs text-text-muted line-clamp-1 mt-1">{ticket.student?.name} • {ticket.category}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-400 text-sm">No tickets found matching filters.</div>
            )}
          </div>
        </div>

        {/* Ticket Detail & Thread */}
        {selectedTicket ? (
          <div className="flex-[2] bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <button onClick={() => setSelectedTicket(null)} className="md:hidden text-gray-500 hover:text-gray-800">
                    &larr; Back
                  </button>
                  <h2 className="font-bold text-lg text-text-main">{selectedTicket.subject}</h2>
                </div>
                <div className="text-xs text-text-muted flex items-center gap-2">
                  <span className="font-semibold text-brand-primary">{selectedTicket.student?.name}</span>
                  <span>({selectedTicket.student?.email})</span>
                  <span>•</span>
                  <span>{selectedTicket.category}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={statusUpdate || selectedTicket.status}
                  onChange={(e) => {
                    setStatusUpdate(e.target.value);
                    handleStatusChange(e.target.value);
                  }}
                  className={`text-xs font-bold border rounded-lg px-3 py-1.5 outline-none ${
                    selectedTicket.status === 'Open' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    selectedTicket.status === 'Resolved' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                    'border-gray-200 text-gray-700 bg-gray-50'
                  }`}
                >
                  <option value="Open">Status: Open</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Resolved">Status: Resolved</option>
                  <option value="Closed">Status: Closed</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
              {selectedTicket.responses.map((res, idx) => (
                <div key={idx} className={`flex flex-col ${res.sender === 'Admin' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    {res.sender === 'Admin' ? 'Support Team' : selectedTicket.student?.name} • {new Date(res.createdAt).toLocaleString()}
                  </span>
                  <div className={`p-4 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                    res.sender === 'Admin' 
                      ? 'bg-brand-primary text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {res.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              {selectedTicket.status !== 'Closed' ? (
                <div className="flex gap-3 items-end">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply to the student..."
                    className="flex-1 border border-gray-200 rounded-xl p-3 text-sm focus:border-brand-primary outline-none resize-none"
                    rows="3"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors disabled:opacity-50 shrink-0"
                  >
                    Send Reply
                  </button>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-500 py-2">This ticket is closed. To reply, change the status first.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-[2] bg-gray-50 border border-gray-100 rounded-xl items-center justify-center flex-col text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a ticket to view the conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
