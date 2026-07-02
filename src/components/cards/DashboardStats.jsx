import React from 'react';

export default function DashboardStats({ title, value, icon: Icon, trend, trendValue, iconColor }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-main">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${iconColor || 'bg-brand-primary/10 text-brand-primary'}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${trend === 'up' ? 'text-status-success' : 'text-status-error'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}
          </span>
          <span className="text-text-muted ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
