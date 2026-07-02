import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, ArrowRightLeft, User, CreditCard, Calendar, Hash, RefreshCcw } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const txnData = {
    id: id || 'TXN-0941',
    gateway: 'Stripe',
    student: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    course: 'FRCR Part 2A Comprehensive',
    amount: '$499.00',
    date: 'Oct 26, 2023, 14:30',
    status: 'Successful',
    invoice: 'INV-2023-4412',
    currency: 'USD',
    method: 'Credit Card (**** 4242)'
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/payments')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Payments
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <FileText className="w-4 h-4" /> View Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm">
            <Download className="w-4 h-4" /> Download Receipt
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Header Block */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-main">{txnData.amount}</h1>
              <Badge status="success">{txnData.status}</Badge>
            </div>
            <p className="text-sm text-text-muted">Payment processed securely via {txnData.gateway}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Transaction ID</p>
            <p className="font-mono text-sm font-medium text-text-main">{txnData.id}</p>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          
          <div className="space-y-6">
            <h3 className="font-bold text-text-main text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Customer Information</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Student</p>
                <p className="text-sm font-bold text-text-main">{txnData.student}</p>
                <p className="text-xs text-text-muted mt-0.5">{txnData.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-text-main text-sm uppercase tracking-wider border-b border-gray-100 pb-2">Purchase Details</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Item</p>
                <p className="text-sm font-bold text-text-main">{txnData.course}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <h3 className="font-bold text-text-main text-sm uppercase tracking-wider border-b border-gray-100 pb-2 mb-6">Transaction Meta</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Date</p>
                <p className="text-sm font-medium text-text-main">{txnData.date}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5"/> Method</p>
                <p className="text-sm font-medium text-text-main">{txnData.method}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5"/> Invoice No.</p>
                <p className="text-sm font-medium text-text-main font-mono">{txnData.invoice}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"><ArrowRightLeft className="w-3.5 h-3.5"/> Currency</p>
                <p className="text-sm font-medium text-text-main">{txnData.currency}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center">
           <p className="text-xs text-gray-500">Is there an issue with this transaction?</p>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 hover:text-red-600 transition-colors">
              <RefreshCcw className="w-4 h-4" /> Issue Refund
           </button>
        </div>
      </div>
    </div>
  );
}
