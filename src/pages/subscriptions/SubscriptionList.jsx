import React, { useState, useEffect } from 'react';
import { Download, Search, Filter, Receipt, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Badge from '../../components/common/Badge';

export default function SubscriptionList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosInstance.get('/payment');
        if (res.data.success) {
          setPayments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch payments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Success': return <Badge variant="success" icon={CheckCircle}>Success</Badge>;
      case 'Failed': return <Badge variant="danger" icon={XCircle}>Failed</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleGenerateReceipt = (payment) => {
    // Generate a simple receipt in the browser and print it
    const receiptContent = `
      MEDICALKV PAYMENT RECEIPT
      ---------------------------------
      Receipt No: ${payment.razorpayPaymentId}
      Date: ${new Date(payment.createdAt).toLocaleDateString()}
      
      Student: ${payment.student?.name} (${payment.student?.email})
      Item: ${payment.course?.title}
      Type: ${payment.type}
      
      Amount Paid: ${payment.currency} ${payment.amount}
      Status: ${payment.status}
      ---------------------------------
      Thank you for learning with MedicalKV.
    `;
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`<pre>${receiptContent}</pre>`);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredPayments = payments.filter(p => 
    p.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Sales & Receipts</h1>
          <p className="text-sm text-text-muted mt-1">Manage course purchases, validity extensions, and generate payment receipts.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Transactions', value: payments.length, icon: Receipt, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
          { label: 'Successful Sales', value: payments.filter(p => p.status === 'Success').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Total Revenue (INR)', value: `₹${payments.reduce((acc, curr) => curr.status === 'Success' ? acc + curr.amount : acc, 0)}`, icon: Receipt, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-black text-text-main">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by student or receipt ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Student</th>
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Course / Item</th>
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">Loading transactions...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No transactions found.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 text-sm text-text-main whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-text-main">{payment.student?.name || 'Unknown'}</div>
                      <div className="text-xs text-text-muted">{payment.student?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-text-main font-medium">{payment.course?.title || 'Unknown Course'}</div>
                      <div className="text-xs text-brand-primary">{payment.type}</div>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-text-main">
                      {payment.currency} {payment.amount}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleGenerateReceipt(payment)}
                        className="text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 inline-flex"
                      >
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
