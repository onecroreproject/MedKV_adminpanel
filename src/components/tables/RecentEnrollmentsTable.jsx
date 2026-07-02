import React from 'react';
import { CheckCircle, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RecentEnrollmentsTable({ data }) {
  // Use passed data or empty array if loading/null
  const enrollmentsList = data || [];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-text-main">Recent Enrollments</h3>
          <p className="text-sm text-text-muted">Latest student course registrations</p>
        </div>
        <Link to="/students" className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-main">
          <thead className="bg-gray-50 text-text-muted font-medium">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Course Name</th>
              <th className="px-6 py-4">Enrollment Date</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {enrollmentsList.length > 0 ? (
              enrollmentsList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.course}</td>
                  <td className="px-6 py-4 text-text-muted">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Paid' ? 'bg-status-success/10 text-status-success' :
                      item.status === 'Pending' ? 'bg-status-warning/10 text-status-warning' :
                      'bg-status-error/10 text-status-error'
                    }`}>
                      {item.status === 'Paid' && <CheckCircle className="w-3.5 h-3.5" />}
                      {item.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                      </div>
                      <span className="text-xs text-text-muted min-w-[3ch]">{item.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/students/${item.id}`} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary transition-colors inline-block" title="View Student">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-text-muted">
                  No recent enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
