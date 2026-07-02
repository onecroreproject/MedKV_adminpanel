import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { validateResetToken, resetPasswordFaculty } from '../../services/authService';
import { CheckCircle2, Circle } from 'lucide-react';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/;

const schema = yup.object().shape({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(passwordRegex, 'Please meet all password requirements')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
});

export default function FacultyResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const passwordValue = watch('password', '');
  
  const passwordRequirements = [
    { label: 'At least 8 characters', met: passwordValue.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase letter', met: /[a-z]/.test(passwordValue) },
    { label: 'One number', met: /\d/.test(passwordValue) },
    { label: 'One special character', met: /[^a-zA-Z0-9]/.test(passwordValue) },
  ];

  useEffect(() => {
    const checkToken = async () => {
      try {
        await validateResetToken(token);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };
    checkToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      setIsLoading(true);
      await resetPasswordFaculty(token, data.password);
      setIsLoading(false);
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/faculty/login');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || 'Failed to reset password. Your link might be expired.');
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid or Expired Link</h2>
          <p className="text-slate-600 mb-6">This password reset link is invalid or has already been used. Please request a new one.</p>
          <Link to="/faculty/forgot-password" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">New Password</h2>
          <p className="text-slate-500 mt-2">Enter your new faculty password below.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-green-800 mb-2">Password Reset Successfully!</h3>
            <p className="text-green-600 text-sm">Redirecting you to the login page...</p>
            <Link to="/faculty/login" className="block mt-6 text-purple-600 font-semibold hover:underline">
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                {...register('password')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              
              {/* Password Strength Indicator */}
              <div className="mt-3 space-y-1.5 bg-slate-100/50 p-3 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">Password Requirements:</p>
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    {req.met ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className={`text-xs ${req.met ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-md flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Reset Password'
              )}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/faculty/login" className="text-sm text-slate-600 hover:text-purple-600 font-medium transition-colors">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
