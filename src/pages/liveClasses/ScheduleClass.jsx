import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Video, Calendar, Link as LinkIcon, Shield, Clock, BookOpen, Layers, CheckSquare, CheckCircle } from 'lucide-react';
import { getCourses, getCourseById } from '../../services/courseService';
import { getFaculty } from '../../services/facultyService';
import { createLiveClass, getLiveClass, updateLiveClass } from '../../services/liveClassService';

export default function ScheduleClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [existingSession, setExistingSession] = useState(null);
  const { register, handleSubmit, getValues, watch, reset, setValue, control } = useForm({
    defaultValues: {
      meetingProvider: 'zoom'
    }
  });
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [autoFaculty, setAutoFaculty] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLinkVerified, setIsLinkVerified] = useState(isEditMode);
  const zoomLinkValue = watch("zoomLink");
  const selectedCourseId = watch("course");
  const selectedModuleId = watch("courseModule");
  const accessControlVal = watch("accessControl") || 'course';

  // Unverify when link changes (removed manual verification)
  useEffect(() => {
    if (!isEditMode) {
      setIsLinkVerified(true);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (selectedCourseId) {
      getCourseById(selectedCourseId).then(res => {
        if (res.success) {
          if (res.data.modules) setModules(res.data.modules);
          else setModules([]);
          // Auto-populate faculty from the course's assigned instructor
          if (res.data.instructor) {
            const instr = res.data.instructor;
            setAutoFaculty(instr);
            setValue('faculty', instr._id || instr);
          } else {
            setAutoFaculty(null);
          }
          // Auto-fill notes from course description
          if (res.data.description) {
            setValue('notes', res.data.description);
          }
        } else {
          setModules([]);
        }
      }).catch(err => console.error(err));
    } else {
      setModules([]);
      setLessons([]);
      setAutoFaculty(null);
    }
  }, [selectedCourseId, setValue]);

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
    // 'selected' access control reserved for future use
  }, [accessControlVal, selectedCourseId]);

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

  useEffect(() => {
    if (id) {
      getLiveClass(id).then(res => {
        if (res.success) {
          setExistingSession(res.data);
          const data = res.data;
          const formattedDate = data.date ? new Date(data.date).toISOString().split('T')[0] : '';
          reset({
            title: data.title,
            course: data.course?._id || data.course || '',
            courseModule: data.courseModule?._id || data.courseModule || '',
            lesson: data.lesson?._id || data.lesson || '',
            faculty: data.faculty?._id || data.faculty || '',
            notes: data.notes,
            date: formattedDate,
            time: data.time,
            duration: data.duration,
            zoomLink: data.zoomLink,
            zoomLink: data.zoomLink,
            zoomId: data.zoomId,
            zoomPasscode: data.zoomPasscode,
            accessControl: data.accessControl || 'course',
            selectedStudents: data.selectedStudents || [],
            settings: data.settings,
            meetingProvider: data.meetingProvider || 'zoom'
          });
        }
      }).catch(err => console.error('Failed to fetch session', err));
    }
  }, [id, reset]);

  const onSubmit = async (data) => {

    if (data.accessControl === 'course') {
      if (!data.course) {
        alert("Course details are mandatory when selecting 'Course Students Only'.");
        return;
      }
    }

    const payload = { ...data };
    // Use course title as session title automatically
    const selectedCourse = courses.find(c => c._id === data.course);
    if (selectedCourse) payload.title = selectedCourse.title;
    ['course', 'courseModule', 'lesson', 'faculty'].forEach(field => {
      if (payload[field] === '') {
        payload[field] = null;
      }
    });

    try {
      if (isEditMode) {
        await updateLiveClass(id, payload);
        alert('Session Updated Successfully!');
        navigate(`/live-classes/${id}`);
      } else {
        await createLiveClass(payload);
        alert('Session Scheduled Successfully!');
        navigate('/live-classes');
      }
    } catch (err) {
      alert(`Failed to ${isEditMode ? 'update' : 'schedule'} session: ` + (err.response?.data?.message || err.message));
    }
  };

  const isDateDisabled = isEditMode && existingSession && (existingSession.status === 'Completed' || existingSession.status === 'Live Now');

  const verifyZoomLink = () => {
    const link = getValues("zoomLink");
    if (!link) {
      alert("Please enter a Zoom link to verify.");
      return;
    }
    
    setIsVerifying(true);
    // Simulate network delay for verification
    setTimeout(() => {
      setIsVerifying(false);
      if (link.includes("zoom.us")) {
        alert("Zoom link verified successfully!");
        setIsLinkVerified(true);
      } else {
        alert("Invalid Zoom link format. Please ensure it contains 'zoom.us'.");
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(isEditMode ? `/live-classes/${id}` : '/live-classes')}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main">{isEditMode ? 'Edit Live Session' : 'Create Live Session'}</h1>
            <p className="text-sm text-text-muted mt-1">{isEditMode ? 'Modify existing session details' : 'Schedule new Zoom-based learning sessions'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={() => navigate(isEditMode ? `/live-classes/${id}` : '/live-classes')}
            className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 flex items-center gap-2 shadow-sm shadow-brand-primary/30"
          >
            <Save className="w-4 h-4 text-brand-accent" /> {isEditMode ? 'Update Session' : 'Schedule Session'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Session Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Video className="w-5 h-5 text-brand-primary" />
            <h3 className="font-bold text-text-main">1. Session Information</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Who can attend */}
            <div className="md:col-span-2 pb-4 border-b border-gray-100">
              <label className="block text-sm font-bold text-text-main mb-3">Who can attend?</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="all" {...register("accessControl")} className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium">All Registered Users</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="course" {...register("accessControl")} className="w-4 h-4 text-brand-primary" defaultChecked />
                  <span className="text-sm font-medium">Only Enrolled Users</span>
                </label>
              </div>
            </div>



            {/* Conditionally render Course/Module/Lesson */}
            {accessControlVal === 'course' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Course *</label>
                  <select {...register("course")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                
                {/* Dynamic Module and Lesson selects */}
                {selectedCourseId && modules.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Attach to Module *</label>
                    <select {...register("courseModule")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                      <option value="">Select Module</option>
                      {modules.map(mod => (
                        <option key={mod._id} value={mod._id}>{mod.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {selectedModuleId && lessons.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Attach to Lesson *</label>
                    <select {...register("lesson")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                      <option value="">Select Lesson</option>
                      {lessons.map(lesson => (
                        <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Faculty *</label>
              {autoFaculty ? (
                <div className="flex items-center gap-3 px-4 py-2.5 border border-green-200 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {autoFaculty.name ? autoFaculty.name.substring(0, 2) : 'FA'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-main">{autoFaculty.name}</p>
                    <p className="text-xs text-green-600 font-medium">Auto-assigned from course</p>
                  </div>
                  <input type="hidden" {...register("faculty")} value={autoFaculty._id || ''} />
                </div>
              ) : (
                <select {...register("faculty", { required: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="">Select Faculty</option>
                  {facultyList.map(faculty => (
                    <option key={faculty._id} value={faculty._id}>{faculty.name}</option>
                  ))}
                </select>
              )}
            </div>

          </div>
        </div>

        {/* Section 2: Session Scheduling */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-primary" />
            <h3 className="font-bold text-text-main">2. Session Scheduling</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Session Date * {isDateDisabled && <span className="text-red-500 text-xs ml-2">(Cannot reschedule active/finished session)</span>}</label>
              <input disabled={isDateDisabled} {...register("date")} type="date" className={`w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20 ${isDateDisabled ? 'bg-gray-100 text-gray-500' : ''}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Start Time *</label>
              <input disabled={isDateDisabled} {...register("time")} type="time" className={`w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20 ${isDateDisabled ? 'bg-gray-100 text-gray-500' : ''}`} />
            </div>

            <div className="md:col-span-3 bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-text-main">
                This session is scheduled to run for <span className="font-bold text-blue-600">60 Minutes</span>. 
                It will end automatically at the specified duration. Timezone: <span className="font-medium">Asia/Kolkata (IST)</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 & 4 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 3: Meeting Integration */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-text-main">3. Meeting Integration</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Meeting Provider *</label>
                <select {...register("meetingProvider")} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:border-brand-primary focus:ring-brand-primary/20">
                  <option value="zoom">Zoom Meeting (Default)</option>
                  <option value="webrtc">Built-in Classroom (WebRTC)</option>
                </select>
              </div>
              
              {watch("meetingProvider") === 'zoom' && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3 mt-4">
                  <Video className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-800">Auto-Generate Zoom Meeting</h4>
                    <p className="text-sm text-blue-700 mt-1">A new Zoom meeting will be automatically created and assigned to the selected Faculty once you save this session.</p>
                    {isEditMode && existingSession?.zoomId && (
                      <div className="mt-3 p-3 bg-white rounded border border-blue-100 text-sm">
                        <p><span className="font-semibold">Meeting ID:</span> {existingSession.zoomId}</p>
                        <p><span className="font-semibold">Passcode:</span> {existingSession.zoomPasscode}</p>
                        <p className="mt-1"><a href={existingSession.zoomLink} target="_blank" rel="noreferrer" className="text-brand-primary hover:underline font-medium">View Join Link</a></p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Settings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-text-main">4. Session Settings</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-3 pt-2">
                {[
                  { id: 'attendance', label: 'Enable Attendance Tracking' },
                  { id: 'recording', label: 'Enable Session Recording' },
                  { id: 'reminder', label: 'Send Email Reminder (24h before)' },
                  { id: 'push', label: 'Send Push Notification (1h before)' },
                  { id: 'questions', label: 'Allow Student Questions (Q&A)' },
                ].map((setting) => (
                  <label key={setting.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked {...register(`settings.${setting.id}`)} className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm text-text-main">{setting.label}</span>
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
