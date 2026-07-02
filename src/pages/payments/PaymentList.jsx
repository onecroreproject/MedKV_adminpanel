import React, { useState, useEffect, useMemo } from 'react';
import {
  Download, Mail, CreditCard, DollarSign, TrendingUp, CheckCircle,
  Eye, FileText, Calendar, Filter, X, ChevronDown, BarChart2, FileDown
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Badge from '../../components/common/Badge';

// ─── Date helpers ────────────────────────────────────────────────────────────
const startOfDay  = (d) => { const r = new Date(d); r.setHours(0,0,0,0); return r; };
const endOfDay    = (d) => { const r = new Date(d); r.setHours(23,59,59,999); return r; };
const startOfWeek = (d) => { const r = startOfDay(d); r.setDate(r.getDate() - r.getDay()); return r; };
const endOfWeek   = (d) => { const r = endOfDay(d);   r.setDate(r.getDate() + (6 - r.getDay())); return r; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const PERIOD_OPTIONS = [
  { label: 'All Time',    value: 'all' },
  { label: 'This Week',   value: 'week' },
  { label: 'This Month',  value: 'month' },
  { label: 'Custom Range', value: 'custom' },
];

export default function PaymentList() {
  const [payments, setPayments]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod]       = useState('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo,   setCustomTo]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters]   = useState(false);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/payment');
      if (res.data?.success) setPayments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Filtered payments ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date();
    return payments.filter(p => {
      const date = new Date(p.createdAt);
      // date filter
      if (period === 'week')  { if (date < startOfWeek(now) || date > endOfWeek(now)) return false; }
      if (period === 'month') { if (date < startOfMonth(now) || date > endOfMonth(now)) return false; }
      if (period === 'custom' && customFrom && customTo) {
        const from = startOfDay(new Date(customFrom));
        const to   = endOfDay(new Date(customTo));
        if (date < from || date > to) return false;
      }
      // status filter
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [payments, period, customFrom, customTo, statusFilter]);

  // ─── Stats from filtered data ───────────────────────────────────────────────
  const stats = useMemo(() => {
    const now = new Date();
    let total = 0, monthly = 0, weekly = 0, today = 0, successCount = 0;
    filtered.forEach(p => {
      if (p.status === 'Success') {
        successCount++;
        total += p.amount;
        const d = new Date(p.createdAt);
        if (d >= startOfMonth(now) && d <= endOfMonth(now)) monthly += p.amount;
        if (d >= startOfWeek(now)  && d <= endOfWeek(now))  weekly  += p.amount;
        if (d.toDateString() === now.toDateString())         today   += p.amount;
      }
    });
    return { total, monthly, weekly, today, successCount };
  }, [filtered]);

  // ─── Monthly grouped billing ────────────────────────────────────────────────
  const monthlyBilling = useMemo(() => {
    const map = {};
    payments.filter(p => p.status === 'Success').forEach(p => {
      const d   = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { label: d.toLocaleString('default', { month: 'long', year: 'numeric' }), amount: 0, count: 0 };
      map[key].amount += p.amount;
      map[key].count++;
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
  }, [payments]);

  // ─── Export CSV ─────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Transaction ID', 'Student Name', 'Student Email', 'Course', 'Amount (INR)', 'Type', 'Status', 'Date'];
    const rows = filtered.map(p => [
      p.razorpayPaymentId || p._id,
      p.student?.name  || 'N/A',
      p.student?.email || 'N/A',
      p.course?.title  || 'N/A',
      p.amount,
      p.type || 'Enrollment',
      p.status,
      new Date(p.createdAt).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `payments_${period}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Download PDF Report (opens print view) ─────────────────────────────────
  const downloadReport = () => {
    const periodLabel = PERIOD_OPTIONS.find(o => o.value === period)?.label || 'All Time';
    const dateRange   = period === 'custom' && customFrom && customTo
      ? `${customFrom} to ${customTo}`
      : periodLabel;

    const rows = filtered.map(p => `
      <tr>
        <td>${p.razorpayPaymentId || p._id.slice(-8)}</td>
        <td>${p.student?.name || 'N/A'}<br/><small>${p.student?.email || ''}</small></td>
        <td>${p.course?.title || 'N/A'}</td>
        <td>₹${p.amount.toLocaleString()}</td>
        <td>${p.type || 'Enrollment'}</td>
        <td class="${p.status === 'Success' ? 'success' : 'fail'}">${p.status}</td>
        <td>${new Date(p.createdAt).toLocaleDateString()}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <title>Payment Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
      h1 { color: #0B1F4D; margin-bottom: 4px; }
      .meta { color: #666; font-size: 13px; margin-bottom: 20px; }
      .stats { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
      .stat { background: #f5f7fa; border-radius: 8px; padding: 12px 20px; }
      .stat .label { font-size: 11px; color: #666; text-transform: uppercase; }
      .stat .value { font-size: 20px; font-weight: bold; color: #0B1F4D; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { background: #0B1F4D; color: white; padding: 10px 12px; text-align: left; }
      td { padding: 9px 12px; border-bottom: 1px solid #eee; }
      tr:nth-child(even) td { background: #f9fafb; }
      .success { color: #16a34a; font-weight: bold; }
      .fail { color: #dc2626; font-weight: bold; }
      @media print { body { margin: 20px; } }
    </style></head><body>
    <h1>💳 Payment Report</h1>
    <div class="meta">Period: <strong>${dateRange}</strong> &nbsp;|&nbsp; Generated: ${new Date().toLocaleString()}</div>
    <div class="stats">
      <div class="stat"><div class="label">Total Revenue</div><div class="value">₹${stats.total.toLocaleString()}</div></div>
      <div class="stat"><div class="label">This Month</div><div class="value">₹${stats.monthly.toLocaleString()}</div></div>
      <div class="stat"><div class="label">This Week</div><div class="value">₹${stats.weekly.toLocaleString()}</div></div>
      <div class="stat"><div class="label">Transactions</div><div class="value">${stats.successCount}</div></div>
    </div>
    <table>
      <thead><tr><th>Txn ID</th><th>Student</th><th>Course</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <script>window.onload = () => { window.print(); }<\/script>
    </body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleDownloadReceipt = async (paymentId) => {
    try {
      const res = await axiosInstance.get(`/payment/${paymentId}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href = url; a.setAttribute('download', `Receipt_${paymentId}.pdf`);
      document.body.appendChild(a); a.click(); a.remove();
    } catch { alert('Failed to download receipt'); }
  };

  const handleEmailReceipt = async (paymentId) => {
    try {
      const res = await axiosInstance.post(`/payment/${paymentId}/resend-receipt`);
      if (res.data?.success) alert('Receipt emailed successfully!');
    } catch { alert('Failed to email receipt'); }
  };

  const handleViewSampleReceipt = async () => {
    try {
      const res = await axiosInstance.get('/payment/sample-receipt', { responseType: 'blob' });
      window.open(window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })), '_blank');
    } catch { alert('Failed to view sample receipt'); }
  };

  const getStatusVariant = (s) => ({ Success: 'success', Pending: 'warning', Failed: 'danger' }[s] || 'default');

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading payments...</div>;

  return (
    <div className="space-y-6 pb-12">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Payment Management</h1>
          <p className="text-sm text-text-muted mt-1">Monitor course purchases, billing & generate reports.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleViewSampleReceipt}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Eye className="w-4 h-4" /> Sample Receipt
          </button>
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <FileDown className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={downloadReport}
            className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
            <FileText className="w-4 h-4" /> Download Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',           value: `₹${stats.total.toLocaleString()}`,   icon: DollarSign,  bg: 'bg-brand-primary/10 text-brand-primary' },
          { label: 'Monthly Revenue',          value: `₹${stats.monthly.toLocaleString()}`, icon: TrendingUp,  bg: 'bg-emerald-100 text-emerald-600' },
          { label: 'Weekly Revenue',           value: `₹${stats.weekly.toLocaleString()}`,  icon: BarChart2,   bg: 'bg-blue-100 text-blue-600' },
          { label: 'Successful Transactions',  value: stats.successCount,                   icon: CheckCircle, bg: 'bg-purple-100 text-purple-600' },
        ].map(({ label, value, icon: Icon, bg }) => (
          <div key={label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xl font-bold text-text-main">{value}</p>
              <p className="text-xs text-text-muted mt-1 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Billing Summary ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="font-bold text-text-main flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Monthly Billing Summary</h2>
          <span className="text-xs text-text-muted">Last 6 months (successful transactions)</span>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {monthlyBilling.length > 0 ? monthlyBilling.map(([key, val]) => {
            const maxAmount = Math.max(...monthlyBilling.map(([, v]) => v.amount), 1);
            const pct = Math.round((val.amount / maxAmount) * 100);
            return (
              <div key={key} className="flex flex-col items-center gap-2 group">
                <div className="w-full bg-gray-100 rounded-lg h-20 flex items-end overflow-hidden">
                  <div className="w-full bg-brand-primary/70 group-hover:bg-brand-primary transition-all rounded-t-lg"
                    style={{ height: `${Math.max(pct, 8)}%` }} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-text-main">₹{val.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-text-muted">{val.label}</p>
                  <p className="text-[10px] text-text-muted">{val.count} txn{val.count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            );
          }) : <p className="col-span-6 text-center text-gray-400 py-4 text-sm">No billing data available.</p>}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="p-4 flex flex-wrap items-center gap-3">
          {/* Period quick-filter */}
          <div className="flex gap-2 flex-wrap">
            {PERIOD_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setPeriod(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${period === opt.value
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Status filter */}
            <div className="relative">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-brand-primary">
                <option value="all">All Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <span className="text-xs text-text-muted font-medium bg-gray-100 px-2 py-1.5 rounded-lg">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Custom date range */}
        {period === 'custom' && (
          <div className="px-4 pb-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">From</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 font-medium">To</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            {(customFrom || customTo) && (
              <button onClick={() => { setCustomFrom(''); setCustomTo(''); }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Transactions Table ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="font-bold text-text-main">Transactions</h2>
          <span className="text-xs text-text-muted">
            {PERIOD_OPTIONS.find(o => o.value === period)?.label}
            {period === 'custom' && customFrom && customTo ? ` (${customFrom} → ${customTo})` : ''}
            {' · '}₹{filtered.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0).toLocaleString()} total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student &amp; Course</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? filtered.map(payment => (
                <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {payment.razorpayPaymentId || payment._id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold text-text-main text-sm">{payment.student?.name || 'Unknown Student'}</div>
                    <div className="text-xs text-text-muted">{payment.student?.email || ''}</div>
                    <div className="text-xs text-brand-primary mt-0.5">{payment.course?.title || 'Unknown Course'}</div>
                  </td>
                  <td className="p-4 align-top">
                    <span className="font-bold text-text-main">₹{payment.amount.toLocaleString()}</span>
                    <span className="text-xs text-text-muted ml-1">{payment.currency || 'INR'}</span>
                  </td>
                  <td className="p-4 align-top text-sm text-gray-600">{payment.type || 'Enrollment'}</td>
                  <td className="p-4 align-top text-sm text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString()}<br />
                    <span className="text-xs text-gray-400">{new Date(payment.createdAt).toLocaleTimeString()}</span>
                  </td>
                  <td className="p-4 align-top">
                    <Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge>
                  </td>
                  <td className="p-4 align-top text-right">
                    {payment.status === 'Success' && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleDownloadReceipt(payment._id)}
                          className="p-2 text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary hover:text-white transition-colors" title="Download Receipt">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEmailReceipt(payment._id)}
                          className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors" title="Email Receipt">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No transactions found for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer totals row */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex flex-wrap gap-4 text-sm font-semibold text-text-main">
            <span>Showing <strong>{filtered.length}</strong> transaction{filtered.length !== 1 ? 's' : ''}</span>
            <span className="ml-auto">
              Subtotal (Success): <strong className="text-emerald-600">
                ₹{filtered.filter(p => p.status === 'Success').reduce((s, p) => s + p.amount, 0).toLocaleString()}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
