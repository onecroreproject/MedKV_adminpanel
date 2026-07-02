import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Layers, BookOpen } from 'lucide-react';
import { getCourses, getCourseById } from '../../services/courseService';
import { getFaculty } from '../../services/facultyService';
import { updateRecording } from '../../services/recordingService';

export default function EditRecordingModal({ isOpen, onClose, recording, onRecordingUpdated }) {
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCourseId = watch("course");
  const selectedModuleId = watch("courseModule");

  useEffect(() => {
    if (recording) {
      reset({
        title: recording.title || '',
        description: recording.description || '',
        course: recording.course?._id || recording.course || '',
        courseModule: recording.courseModule?._id || recording.courseModule || '',
        lesson: recording.lesson?._id || recording.lesson || '',
        faculty: recording.faculty?._id || recording.faculty || '',
        duration: recording.duration ? recording.duration.replace('m', '') : '',
        isPublished: recording.isPublished,
      });
    }
  }, [recording, reset]);

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
    if (isOpen) loadData();
  }, [isOpen]);

  useEffect(() => {
    if (selectedCourseId) {
      getCourseById(selectedCourseId).then(res => {
        if (res.success && res.data.modules) {
          setModules(res.data.modules);
          if (recording && (recording.course?._id || recording.course) === selectedCourseId) {
            setTimeout(() => setValue("courseModule", recording.courseModule?._id || recording.courseModule || ''), 0);
          }
        } else {
          setModules([]);
        }
      }).catch(err => console.error(err));
    } else {
      setModules([]);
      setLessons([]);
    }
  }, [selectedCourseId, recording, setValue]);

  useEffect(() => {
    if (selectedModuleId && modules.length > 0) {
      const selectedModule = modules.find(m => m._id === selectedModuleId);
      if (selectedModule && selectedModule.lessons) {
        setLessons(selectedModule.lessons);
        if (recording && (recording.courseModule?._id || recording.courseModule) === selectedModuleId) {
          setTimeout(() => setValue("lesson", recording.lesson?._id || recording.lesson || ''), 0);
        }
      } else {
        setLessons([]);
      }
    } else {
      setLessons([]);
    }
  }, [selectedModuleId, modules, recording, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await updateRecording(recording._id, {
        title: data.title,
        description: data.description,
        course: data.course || undefined,
        courseModule: data.courseModule || undefined,
        lesson: data.lesson || undefined,
        faculty: data.faculty || undefined,
        duration: data.duration ? `${data.duration}m` : undefined,
        isPublished: data.isPublished
      });
      
      if (res.success) {
        onRecordingUpdated();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update recording');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:pl-64">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-text-main text-lg">Edit Recording</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Title *</label>
            <input {...register("title", { required: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Course</label>
              <select {...register("course")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Faculty</label>
              <select {...register("faculty")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary">
                <option value="">Select Faculty</option>
                {facultyList.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>

            {selectedCourseId && modules.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Module</label>
                <select {...register("courseModule")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary">
                  <option value="">Select Module</option>
                  {modules.map(mod => <option key={mod._id} value={mod._id}>{mod.title}</option>)}
                </select>
              </div>
            )}
            
            {selectedModuleId && lessons.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Lesson</label>
                <select {...register("lesson")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary">
                  <option value="">Select Lesson</option>
                  {lessons.map(lesson => <option key={lesson._id} value={lesson._id}>{lesson.title}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Duration (mins)</label>
              <input type="number" {...register("duration")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary" placeholder="e.g. 90" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" {...register("isPublished")} id="isPublished" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary w-4 h-4" />
              <label htmlFor="isPublished" className="text-sm font-medium text-text-main cursor-pointer">Published to Students</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">Description</label>
            <textarea {...register("description")} rows={4} className="w-full px-4 py-3 text-sm focus:outline-none border border-gray-200 rounded-lg focus:ring-1 focus:border-brand-primary" placeholder="Description..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
