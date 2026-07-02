import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/authService';

const schema = yup.object().shape({
  email: yup.string().required('Email or Username is required'),
  password: yup.string().required('Password is required'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMsg('');
      setIsLoading(true);
      
      // Map 'admin' username to actual admin email
      const loginEmail = data.email.toLowerCase() === 'admin' ? 'admin@gadmin.com' : data.email;
      
      const response = await loginAdmin(loginEmail, data.password);
      localStorage.setItem('token', response.token);
      setIsLoading(false);
      navigate('/'); 
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Admin Login</h2>
          <p className="text-slate-500 mt-2">Secure access to the control panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email or Username</label>
            <input
              type="text"
              {...register('email')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
              placeholder="admin"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/admin/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-colors bg-slate-50`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
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
              'Authenticate'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Not an admin?{' '}
          <Link to="/faculty/login" className="text-blue-600 font-semibold hover:underline">Faculty Portal</Link>
        </p>
      </div>
    </div>
  );
}
