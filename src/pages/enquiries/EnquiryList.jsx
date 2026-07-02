import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Clock, Send, X, MoreVertical, Check, MessageSquare } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Badge from '../../components/common/Badge';

export default function EnquiryList() {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/enquiries');
      if (res.data?.success) {
        setEnquiries(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axiosInstance.put(`/enquiries/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setEnquiries(prev => prev.map(enq => enq._id === id ? { ...enq, status: newStatus } : enq));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return alert("Reply text cannot be empty.");
    
    setIsSendingReply(true);
    try {
      const res = await axiosInstance.post(`/enquiries/${replyingTo._id}/reply`, { replyText });
      if (res.data?.success) {
        alert("Reply sent successfully via email!");
        setEnquiries(prev => prev.map(enq => enq._id === replyingTo._id ? { ...enq, status: 'Resolved' } : enq));
        setReplyingTo(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredEnquiries = enquiries.filter(enq => filter === 'All' || enq.status === filter);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading enquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Student Enquiries</h1>
          <p className="text-sm text-text-muted mt-1">Manage and respond to admissions requests from the website.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{enquiries.length}</p>
            <p className="text-xs text-text-muted">Total Enquiries</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{enquiries.filter(e => e.status === 'Resolved').length}</p>
            <p className="text-xs text-text-muted">Resolved</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-main">{enquiries.filter(e => e.status === 'New').length}</p>
            <p className="text-xs text-text-muted">New / Pending</p>
          </div>
        </div>
      </div>

      {/* Table List View */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 align-top">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-text-main text-sm">{enquiry.name}</div>
                      <div className="text-xs text-brand-primary flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3" />
                        <a href={`mailto:${enquiry.email}`} className="hover:underline">{enquiry.email}</a>
                      </div>
                    </td>
                    <td className="p-4 align-top max-w-md">
                      <p className="text-sm text-gray-600 break-words line-clamp-3" title={enquiry.message}>
                        {enquiry.message}
                      </p>
                    </td>
                    <td className="p-4 align-top">
                      <Badge variant={enquiry.status === 'New' ? 'warning' : enquiry.status === 'Resolved' ? 'success' : 'default'}>
                        {enquiry.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2">
                        {enquiry.status === 'New' && (
                          <button 
                            onClick={() => handleUpdateStatus(enquiry._id, 'Read')}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Mark as Read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {enquiry.status !== 'Resolved' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(enquiry._id, 'Resolved')}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                              title="Mark as Resolved"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setReplyingTo(enquiry);
                                setReplyText('');
                              }}
                              className="p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                              title="Reply via Email"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-lg text-text-main flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
                Reply to {replyingTo.name}
              </h3>
              <button 
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-sm text-gray-600 max-h-40 overflow-y-auto">
                <span className="font-bold text-gray-800 block mb-1">Original Message:</span>
                {replyingTo.message}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Reply:</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here. This will be sent directly to the student's email..."
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary h-40 resize-none"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setReplyingTo(null)}
                className="px-5 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendReply}
                disabled={isSendingReply}
                className="px-5 py-2 text-sm font-bold text-white bg-brand-primary hover:bg-brand-secondary rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSendingReply ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" /> Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
