import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X, Video, Upload, Link as LinkIcon, Settings, Shield, BookOpen, Layers } from 'lucide-react';
import { getCourses, getCourseById } from '../../services/courseService';
import { getFaculty } from '../../services/facultyService';
import { createRecording } from '../../services/recordingService';

export default function UploadRecording() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm();
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedCourseId = watch("course");
  const selectedModuleId = watch("courseModule");

  useEffect(() => {
    if (selectedCourseId) {
      getCourseById(selectedCourseId).then(res => {
        if (res.success && res.data.modules) {
          setModules(res.data.modules);
        } else {
          setModules([]);
        }
      }).catch(err => console.error(err));
    } else {
      setModules([]);
      setLessons([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId && modules.length > 0) {
      const selectedModule = modules.find(m => m._id === selectedModuleId);
      if (selectedModule && selectedModule.lessons) {
        setLessons(selectedModule.lessons);
      } else {
        setLessons([]);
      }
    } else {
      setLessons([]);
    }
  }, [selectedModuleId, modules]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, facultyRes] = await Promise.all([
          getCourses(),
          getFaculty()
        ]);
        if (coursesRes.success) setCourses(coursesRes.data);
        if (facultyRes.success) setFacultyList(facultyRes.data);
      } catch (err) {
        console.error('Failed to load form data', err);
      }
    };
    loadData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await createRecording({
        title: data.title,
        description: data.description,
        course: data.course || undefined,
        courseModule: data.courseModule || undefined,
        lesson: data.lesson || undefined,
        faculty: data.faculty || undefined,
        videoUrl: data.videoUrl,
        duration: data.duration ? `${data.duration}m` : undefined,
        isPublished: true
      });
      if (res.success) {
        alert('Recording uploaded successfully!');
        navigate('/recordings');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload recording');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/recordings')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Upload New Recording</h1>
            <p className="text-sm text-text-muted mt-1">Upload and organize recorded learning sessions.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/recordings')}
            className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-brand-accent" /> {loading ? 'Publishing...' : 'Publish Recording'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-primary" />
            <h3 className="font-bold text-text-main">1. Basic Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1.5">Session Title *</label>
              <input {...register("title")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="e.g. Brain MRI Interpretation Session" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Course Selection *</label>
              <select {...register("course", { required: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                <option value="">Select Course</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            {/* Dynamic Module and Lesson selects */}
            {selectedCourseId && modules.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Attach to Module</label>
                <select {...register("courseModule")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="">Select Module (Optional)</option>
                  {modules.map(mod => (
                    <option key={mod._id} value={mod._id}>{mod.title}</option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedModuleId && lessons.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Attach to Lesson</label>
                <select {...register("lesson")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="">Select Lesson (Optional)</option>
                  {lessons.map(lesson => (
                    <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Faculty Selection *</label>
              <select {...register("faculty", { required: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                <option value="">Select Faculty</option>
                {facultyList.map(f => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-main mb-1.5">Session Description</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:border-brand-primary focus-within:ring-brand-primary/20">
                <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
                  <span className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">B</span>
                  <span className="text-xs italic px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">I</span>
                  <span className="text-xs underline px-2 py-1 bg-white border border-gray-200 rounded cursor-pointer hover:bg-gray-100">U</span>
                </div>
                <textarea {...register("description")} rows={4} className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Provide a detailed summary of the recorded session..." />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Video Management */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Video className="w-5 h-5 text-brand-primary" />
            <h3 className="font-bold text-text-main">2. Video Management</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Direct File Upload</label>
              <div className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors group">
                <Upload className="w-8 h-8 mb-3 group-hover:text-brand-primary transition-colors" />
                <span className="text-sm font-medium text-text-main">Drag & Drop Video Here</span>
                <span className="text-xs mt-1">or click to browse from computer</span>
                <div className="mt-4 flex gap-2 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded">MP4</span>
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded">MOV</span>
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded">MKV</span>
                </div>
              </div>
            </div>

            {/* URL Upload */}
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Or Use External URL</label>
              <div className="space-y-4">
                <div>
                  <div className="relative focus-within:ring-1 focus-within:ring-brand-primary/20 rounded-lg">
                    <LinkIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input {...register("videoUrl")} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" placeholder="Paste YouTube, Vimeo, or Cloud link here" />
                  </div>
                </div>
                
                {/* Mock Preview Box */}
                <div className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                  <Video className="w-8 h-8 text-gray-300" />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm text-text-main">Preview Unavailable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 & 4 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 3: Session Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-text-main">3. Session Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Session Duration (Minutes)</label>
                <input {...register("duration")} type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" placeholder="e.g. 120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Recording Date</label>
                <input {...register("recordingDate")} type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Session Type</label>
                <select {...register("sessionType")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="live">Live Class Recording</option>
                  <option value="workshop">Workshop Recording</option>
                  <option value="anatomy">Anatomy Session</option>
                  <option value="pathology">Pathology Session</option>
                  <option value="case">Case Discussion</option>
                  <option value="mock">Mock Exam Review</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Access Settings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-text-main">4. Access Settings</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Access Control</label>
                <select {...register("access")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="course">Course Students Only</option>
                  <option value="premium">Premium Students Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { id: 'playback', label: 'Allow Video Playback', checked: true },
                  { id: 'notes', label: 'Enable Download Notes', checked: true },
                  { id: 'comments', label: 'Enable Comments', checked: false },
                  { id: 'rule7days', label: 'Recording Available for 7 Days (Missed Live Rule)', checked: true },
                  { id: 'certificate', label: 'Certificate Eligible Content', checked: false },
                ].map((setting) => (
                  <label key={setting.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked={setting.checked} {...register(`settings.${setting.id}`)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm text-text-main group-hover:text-brand-primary transition-colors">{setting.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
