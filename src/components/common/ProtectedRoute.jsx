import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getMe } from '../../services/authService';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsValidating(false);
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await getMe();
        const userRole = response?.data?.role?.toLowerCase();
        
        if (userRole === role.toLowerCase()) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          // Only clear token if it belongs to wrong role while accessing admin,
          // but we probably shouldn't clear student tokens.
          // For safety, let's just not authorize.
        }
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setIsValidating(false);
      }
    };

    verifyUser();
  }, [token, role]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    if (role === 'faculty') {
      return <Navigate to="/faculty/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
