import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const statusStyles = {
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/10 text-status-warning',
  danger: 'bg-status-error/10 text-status-error',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-700'
};

export default function Badge({ children, status = 'default', className }) {
  return (
    <span 
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          statusStyles[status],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
