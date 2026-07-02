import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../services/authService';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  secretKey: yup.string().required('Admin secret key is required'),
});

export default function AdminRegister() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      setIsLoading(true);
      
      const userData = {
        name: data.fullName,
        email: data.email,
        password: data.password
      };
      
      await registerAdmin(userData);
      
      setIsLoading(false);
      setSuccessMsg('Admin Registration successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
      
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Admin Registration</h2>
          <p className="text-slate-500 mt-2">Request administrator access</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
              {successMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Authorization Secret Key</label>
            <input
              type="password"
              {...register('secretKey')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.secretKey ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
            />
            {errors.secretKey && <p className="mt-1 text-sm text-red-500">{errors.secretKey.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md mt-6 disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Register Admin'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have access?{' '}
          <Link to="/admin/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
