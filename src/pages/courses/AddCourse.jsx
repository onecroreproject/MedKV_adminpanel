import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Save, X, Check, ChevronRight, Upload, Video, FileText, Award, Calendar, Activity, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { createCourse, updateCourse, getCourseById } from '../../services/courseService';
import { getFaculty } from '../../services/facultyService';
import { getCategories } from '../../services/categoryService';
import { uploadFile } from '../../services/uploadService';

const steps = [
  { id: 1, name: 'Basic Info' },
  { id: 2, name: 'Media' },
  { id: 3, name: 'Pricing' },
  { id: 4, name: 'Faculty' },
  { id: 5, name: 'Features' },
  { id: 6, name: 'Advanced Content' }
];

export default function AddCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const [facultyList, setFacultyList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  
  const { register, handleSubmit, control, watch, setValue, getValues, reset } = useForm({
    defaultValues: {
      learningOutcomes: [],
      liveSessions: [],
      pacsCases: [],
      mockExams: [],
      testimonials: [],
      faqs: []
    }
  });

  const submitActionRef = React.useRef('Publish');

  const { fields: learningOutcomes, append: appendLO, remove: removeLO } = useFieldArray({ control, name: "learningOutcomes" });
  const { fields: liveSessions, append: appendLS, remove: removeLS } = useFieldArray({ control, name: "liveSessions" });
  const { fields: pacsCases, append: appendPC, remove: removePC } = useFieldArray({ control, name: "pacsCases" });
  const { fields: mockExams, append: appendME, remove: removeME } = useFieldArray({ control, name: "mockExams" });
  const { fields: testimonials, append: appendTest, remove: removeTest } = useFieldArray({ control, name: "testimonials" });
  const { fields: faqs, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [facultyRes, categoryRes] = await Promise.all([getFaculty(), getCategories()]);
        setFacultyList(facultyRes.data || []);
        setCategories(categoryRes.data || []);
        
        if (isEditing) {
          const courseRes = await getCourseById(id);
          const course = courseRes.data;
          
          setValue('title', course.title);
          setValue('category', course.category?._id || course.category);
          setValue('languages', course.languages || []);
          setValue('fullDesc', course.description);
          setValue('difficulty', course.level || '');
          setValue('regularPrice', course.originalPrice || course.price);
          setValue('discountPrice', course.originalPrice ? course.price : '');
          setValue('faculty', course.instructor?._id || course.instructor);
          setValue('previewVideoUrl', course.previewVideoUrl || '');
          setValue('thumbnail', course.thumbnail || '');
          setValue('banner', course.banner || '');
          
          setValue('learningOutcomes', course.learningOutcomes || []);
          setValue('liveSessions', course.liveSessions || []);
          setValue('pacsCases', course.pacsCases || []);
          setValue('mockExams', course.mockExams || []);
          setValue('testimonials', course.testimonials || []);
          setValue('faqs', course.faqs || []);
        }
      } catch (err) {
        console.error('Failed to fetch initial data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEditing, setValue]);

  const selectedFeatures = watch('features') || [];

  const handleNext = () => {
    if (currentStep === 1) {
      const titleVal = getValues('title');
      if (!titleVal || titleVal.trim() === '') {
        alert("Course Title is required to proceed.");
        return;
      }
    }
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data) => {
    if (currentStep !== 6) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    try {
      let instructorId = null;
      if (data.faculty && Array.isArray(data.faculty)) instructorId = data.faculty[0];
      else if (data.faculty) instructorId = data.faculty;
      else if (facultyList.length > 0) instructorId = facultyList[0]._id; // Fallback to first faculty

      let finalPrice = Number(data.regularPrice) || 0;
      let finalOriginalPrice = null;
      if (data.discountPrice && Number(data.discountPrice) > 0) {
        finalPrice = Number(data.discountPrice);
        finalOriginalPrice = Number(data.regularPrice);
      }

      if (!data.title) {
        alert("Course Title is required.");
        setIsSubmitting(false);
        return;
      }

      const statusToSet = submitActionRef.current === 'Publish' ? 'Published' : 'Draft';

      const payload = {
        title: data.title,
        slug: data.slug || undefined,
        description: data.fullDesc || data.shortDesc || '',
        category: data.category || undefined,
        level: data.difficulty || '',
        languages: data.languages || [],
        price: finalPrice || 0,
        originalPrice: finalOriginalPrice || 0,
        previewVideoUrl: data.previewVideoUrl || '',
        thumbnail: data.thumbnail || '',
        banner: data.banner || '',
        status: statusToSet,
        instructor: instructorId,
        learningOutcomes: data.learningOutcomes || [],
        liveSessions: data.liveSessions || [],
        pacsCases: data.pacsCases || [],
        mockExams: data.mockExams || [],
        testimonials: data.testimonials || [],
        faqs: data.faqs || []
      };
      
      if (isEditing) {
        await updateCourse(id, payload);
        alert('Course updated successfully!');
        if (submitActionRef.current === 'Publish') navigate('/courses');
      } else {
        const res = await createCourse(payload);
        alert('Course created successfully!');
        if (submitActionRef.current === 'Publish') {
          navigate('/courses');
        } else if (res.data && res.data._id) {
          navigate(`/courses/${res.data._id}/edit`);
        } else {
          navigate('/courses');
        }
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEditing ? 'update' : 'create'} course. ` + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
      : 'http://localhost:5000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadFile(file);
      if (res.success) {
        setValue(fieldName, res.url);
        alert('Image uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadFile(file);
      if (res.success) {
        setValue('previewVideoUrl', res.url);
        alert('Video uploaded successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload video');
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input {...register('title')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Enter course title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Course Slug (Optional)</label>
                <input {...register('slug')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Leave empty to auto-generate from title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Category</label>
                <select {...register('category')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20">
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-3">Languages</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" value="English" {...register('languages')} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm text-text-main">English</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" value="Tamil" {...register('languages')} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm text-text-main">Tamil</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" value="Hindi" {...register('languages')} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <span className="text-sm text-text-main">Hindi</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Short Description</label>
                <textarea {...register('shortDesc')} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Brief summary of the course..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-1.5">Full Description</label>
                <textarea {...register('fullDesc')} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="Detailed course description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Difficulty Level (Optional)</label>
                <select {...register('difficulty')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20">
                  <option value="">None (Hide)</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Course Media</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Course Thumbnail (1:1 Ratio)</label>
                <label className="block w-full h-40 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors overflow-hidden">
                  {watch('thumbnail') ? (
                    <img src={getFullUrl(watch('thumbnail'))} alt="Thumbnail" className="w-full h-full object-contain bg-black/5" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Drag & Drop or Click to Upload</span>
                      <span className="text-xs mt-1">Recommended size: 600x600px. Max 2MB.</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Course Banner (16:9 Ratio)</label>
                <label className="block w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors overflow-hidden">
                  {watch('banner') ? (
                    <img src={getFullUrl(watch('banner'))} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Drag & Drop or Click to Upload</span>
                      <span className="text-xs mt-1">Recommended size: 1920x1080px. Max 5MB.</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Course Preview Video URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Video className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register('previewVideoUrl')} type="text" className="w-full pl-10 pr-32 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="e.g. https://www.youtube.com/embed/..." />
                  <div className="absolute inset-y-0 right-1 flex items-center">
                    <label className="cursor-pointer px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-xs font-medium text-gray-600 transition-colors">
                      Upload File
                      <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Enter a valid YouTube/Vimeo embed URL or upload a direct .mp4 file.</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Pricing & Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Regular Price (₹)</label>
                <input {...register('regularPrice')} type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Discount Price (₹)</label>
                <input {...register('discountPrice')} type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Course Access Duration</label>
                <select {...register('duration')} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20">
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                  <option value="365">1 Year</option>
                  <option value="lifetime">Lifetime Access</option>
                </select>
              </div>
              <div className="flex flex-col justify-center space-y-4 pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" {...register('isFree')} className="sr-only" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors peer-checked:bg-brand-primary"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-text-main">Free Course</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" {...register('isFeatured')} className="sr-only" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors peer-checked:bg-brand-primary"></div>
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-text-main">Featured Course</span>
                </label>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Faculty Assignment</h3>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-main">Select Faculty Members</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyList.length > 0 ? facultyList.map((faculty) => (
                  <label key={faculty._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-gray-50 transition-colors group">
                    <input type="radio" value={faculty._id} {...register('faculty')} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm uppercase">
                      {faculty.name ? faculty.name.substring(0, 2) : 'FA'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main group-hover:text-brand-primary transition-colors">{faculty.name}</h4>
                      <p className="text-xs text-text-muted">{faculty.specialization || 'Faculty'}</p>
                    </div>
                  </label>
                )) : <p className="text-sm text-gray-500">No faculty found. Please add faculty first.</p>}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Course Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'live', name: 'Live Classes', icon: Video },
                { id: 'recorded', name: 'Recorded Sessions', icon: Activity },
                { id: 'notes', name: 'Notes & PDFs', icon: FileText },
                { id: 'exams', name: 'Mock Exams', icon: FileText },
                { id: 'cert', name: 'Certificate', icon: Award },
                { id: 'cases', name: 'Case Discussions', icon: FileText },
                { id: 'daily', name: 'Daily Learning Access', icon: Calendar },
                { id: 'download', name: 'Downloadable Resources', icon: Upload }
              ].map((feat) => {
                const Icon = feat.icon;
                return (
                  <label key={feat.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-gray-50 transition-colors">
                    <input type="checkbox" value={feat.id} {...register('features')} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-text-main">{feat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-text-main border-b border-gray-100 pb-2">Advanced Course Content</h3>
            
            {/* Learning Outcomes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">What You Will Learn</h4>
                <button type="button" onClick={() => appendLO({ title: '', desc: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add Outcome</button>
              </div>
              {learningOutcomes.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <input {...register(`learningOutcomes.${index}.title`)} placeholder="Outcome Title" className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:border-brand-primary" />
                    <textarea {...register(`learningOutcomes.${index}.desc`)} placeholder="Outcome Description" rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:border-brand-primary" />
                  </div>
                  <button type="button" onClick={() => removeLO(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

            {/* Live Sessions */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">Live Classes & Recordings</h4>
                <button type="button" onClick={() => appendLS({ sessionType: 'Live', title: '', date: '', time: '', duration: '', accessibility: '', accessTerms: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add Session</button>
              </div>
              {liveSessions.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <select {...register(`liveSessions.${index}.sessionType`)} className="col-span-2 sm:col-span-1 px-3 py-1.5 border border-gray-200 rounded text-sm"><option value="Live">Live</option><option value="Recording">Recording</option></select>
                    <input {...register(`liveSessions.${index}.title`)} placeholder="Session Title" className="col-span-2 sm:col-span-1 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`liveSessions.${index}.date`)} placeholder="Date (e.g. May 30, 2026)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`liveSessions.${index}.time`)} placeholder="Time (e.g. 18:00 - 21:00 GMT)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`liveSessions.${index}.duration`)} placeholder="Duration / Cloud Archive (e.g. 180 mins HD)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`liveSessions.${index}.accessibility`)} placeholder="Accessibility (e.g. Missed Live Replay)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`liveSessions.${index}.accessTerms`)} placeholder="Access Terms (e.g. Valid for 7 Days)" className="col-span-2 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                  </div>
                  <button type="button" onClick={() => removeLS(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

            {/* PACS Cases */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">PACS Cases / Spotters</h4>
                <button type="button" onClick={() => appendPC({ title: '', scans: '', difficulty: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add PACS Case</button>
              </div>
              {pacsCases.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input {...register(`pacsCases.${index}.title`)} placeholder="Title (e.g. Brain MRI scan spotters)" className="col-span-1 sm:col-span-3 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`pacsCases.${index}.scans`)} placeholder="Scans (e.g. 180+ Scans)" className="col-span-1 sm:col-span-2 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`pacsCases.${index}.difficulty`)} placeholder="Difficulty (e.g. Advanced)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                  </div>
                  <button type="button" onClick={() => removePC(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

            {/* Mock Exams */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">Mock Exams</h4>
                <button type="button" onClick={() => appendME({ title: '', questions: '', time: '', difficulty: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add Mock Exam</button>
              </div>
              {mockExams.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input {...register(`mockExams.${index}.title`)} placeholder="Exam Title" className="col-span-1 sm:col-span-2 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`mockExams.${index}.questions`)} placeholder="Questions (e.g. 120 MCQs)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`mockExams.${index}.time`)} placeholder="Time (e.g. 180 mins timer)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <input {...register(`mockExams.${index}.difficulty`)} placeholder="Tag (e.g. Exam Calibrated)" className="px-3 py-1.5 border border-gray-200 rounded text-sm" />
                  </div>
                  <button type="button" onClick={() => removeME(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">Testimonials</h4>
                <button type="button" onClick={() => appendTest({ name: '', role: '', review: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add Testimonial</button>
              </div>
              {testimonials.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <input {...register(`testimonials.${index}.name`)} placeholder="Name (e.g. Dr. Amit Patel)" className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                      <input {...register(`testimonials.${index}.role`)} placeholder="Role (e.g. FRCR Part 2B graduate)" className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    </div>
                    <textarea {...register(`testimonials.${index}.review`)} placeholder="Review Content..." rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm" />
                  </div>
                  <button type="button" onClick={() => removeTest(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-main">FAQs</h4>
                <button type="button" onClick={() => appendFaq({ q: '', a: '' })} className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Add FAQ</button>
              </div>
              {faqs.map((item, index) => (
                <div key={item.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-3">
                    <input {...register(`faqs.${index}.q`)} placeholder="Question" className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm" />
                    <textarea {...register(`faqs.${index}.a`)} placeholder="Answer" rows={2} className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm" />
                  </div>
                  <button type="button" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 h-fit p-1"><X className="w-5 h-5"/></button>
                </div>
              ))}
            </div>

          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/courses')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>
            <p className="text-sm text-text-muted mt-1">{isEditing ? 'Modify your educational program details' : 'Design and publish a new educational program'}</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep === step.id ? "bg-brand-primary text-white border-2 border-brand-primary shadow-[0_0_0_4px_rgba(11,31,77,0.1)]" :
                    currentStep > step.id ? "bg-status-success text-white" : "bg-gray-100 text-gray-400"
                  )}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={clsx("text-xs font-medium hidden sm:block", currentStep >= step.id ? "text-brand-primary" : "text-gray-400")}>
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={clsx("h-1 flex-1 hidden sm:block", currentStep > step.id ? "bg-status-success" : "bg-gray-100")}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button 
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-2.5 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={handleNext}
                className={clsx(
                  "px-6 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30",
                  currentStep === 6 ? "hidden sm:flex invisible pointer-events-none" : "flex"
                )}
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>

              <button 
                type="submit"
                onClick={() => submitActionRef.current = 'Draft'}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>

              {currentStep === 6 && (
                <button 
                  type="submit"
                  onClick={() => submitActionRef.current = 'Publish'}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-brand-accent text-white rounded-lg text-sm font-bold hover:bg-brand-accent/90 flex items-center gap-2 shadow-sm shadow-brand-accent/30 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {isEditing ? 'Update & Publish' : 'Publish Course'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
