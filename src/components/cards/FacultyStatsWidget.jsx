import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function FacultyStatsWidget({ title, value, icon: Icon, trend, trendValue, statusBadge, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={twMerge(clsx("p-3 rounded-xl transition-transform group-hover:scale-110 duration-300", color))}>
          <Icon className="w-6 h-6" />
        </div>
        {statusBadge && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full border border-orange-200">
            {statusBadge}
          </span>
        )}
        {trend && (
          <span className={clsx(
            "flex items-center text-xs font-bold px-2 py-1 rounded-lg",
            trend === 'up' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-text-muted mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-text-main group-hover:text-brand-primary transition-colors">{value}</span>
        </div>
      </div>
    </div>
  );
}
