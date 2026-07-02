import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

import { forgotPasswordAdmin } from '../../services/authService';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export default function AdminForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setErrorMsg('');
      await forgotPasswordAdmin(data.email);
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Reset Admin Password</h2>
          <p className="text-slate-500 mt-2">Enter your admin email address to receive reset instructions.</p>
        </div>

        {isSubmitted ? (
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">Check your email</h3>
            <p className="text-blue-700 text-sm">We have sent password reset instructions to your email address.</p>
            <Link to="/admin/login" className="block mt-6 text-blue-600 font-semibold hover:underline">
              Return to Login
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
                placeholder="admin@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <div className="text-center mt-6">
              <Link to="/admin/login" className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
