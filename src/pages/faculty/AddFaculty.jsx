import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';

const schema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobile: yup.string().required('Mobile number is required'),
  qualification: yup.string().required('Qualification is required'),
  experience: yup.number().typeError('Must be a number').positive().integer().required('Experience is required'),
  specialization: yup.string().required('Specialization is required'),
  designation: yup.string().required('Designation is required'),
  institution: yup.string().required('Institution is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
}).required();

export default function AddFaculty() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
    alert('Faculty added successfully!');
    navigate('/faculty');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/faculty')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Add Faculty</h1>
            <p className="text-sm text-text-muted mt-1">Create a new faculty profile</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/faculty')}
            className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30"
          >
            <Save className="w-4 h-4 text-brand-accent" /> Save Faculty
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text-main">1. Basic Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-brand-primary cursor-pointer transition-colors">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-main mb-1">Profile Image</h4>
                <p className="text-xs text-text-muted mb-3">Upload a professional high-resolution image. JPG, PNG. Max size 2MB.</p>
                <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Full Name *</label>
              <input {...register("fullName")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.fullName ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="Dr. John Doe" />
              {errors.fullName && <p className="text-status-error text-xs mt-1.5">{errors.fullName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Email Address *</label>
              <input {...register("email")} type="email" className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.email ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="doctor@example.com" />
              {errors.email && <p className="text-status-error text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Mobile Number *</label>
              <input {...register("mobile")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.mobile ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="+91 9876543210" />
              {errors.mobile && <p className="text-status-error text-xs mt-1.5">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Qualification *</label>
              <input {...register("qualification")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.qualification ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="e.g. MD Radiology" />
              {errors.qualification && <p className="text-status-error text-xs mt-1.5">{errors.qualification.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Experience (Years) *</label>
              <input {...register("experience")} type="number" className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.experience ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="10" />
              {errors.experience && <p className="text-status-error text-xs mt-1.5">{errors.experience.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Specialization *</label>
              <select {...register("specialization")} className={`w-full px-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-1 ${errors.specialization ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`}>
                <option value="">Select Specialization</option>
                <option value="Radiophysics">Radiophysics</option>
                <option value="Anatomy">Anatomy</option>
                <option value="Pathology">Pathology</option>
                <option value="MSK">MSK Radiology</option>
              </select>
              {errors.specialization && <p className="text-status-error text-xs mt-1.5">{errors.specialization.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Professional Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text-main">2. Professional Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Designation *</label>
              <input {...register("designation")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.designation ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="Senior Consultant" />
              {errors.designation && <p className="text-status-error text-xs mt-1.5">{errors.designation.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Institution / Hospital *</label>
              <input {...register("institution")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.institution ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="Apollo Hospitals" />
              {errors.institution && <p className="text-status-error text-xs mt-1.5">{errors.institution.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1.5">Professional Summary</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="Brief professional background..." />
            </div>
          </div>
        </div>

        {/* Section 3 & 4 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 3: Contact */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">3. Contact Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Address</label>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="Street Address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">City</label>
                  <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Country</label>
                  <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="Country" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Social */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">4. Social Media Links</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">LinkedIn Profile</label>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Personal Website</label>
                <input className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Account Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-text-main">5. Account Settings</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Username *</label>
              <input {...register("username")} className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.username ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="faculty_user" />
              {errors.username && <p className="text-status-error text-xs mt-1.5">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Password *</label>
              <input {...register("password")} type="password" className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${errors.password ? 'border-status-error focus:border-status-error focus:ring-status-error/20' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} placeholder="••••••••" />
              {errors.password && <p className="text-status-error text-xs mt-1.5">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Account Status</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
