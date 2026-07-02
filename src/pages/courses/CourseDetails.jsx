import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, BookOpen, Users, Star, DollarSign, Clock, PlayCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getCourseById } from '../../services/courseService';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourse(response.data);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div></div>;
  }

  if (!course) {
    return <div className="text-center p-8 text-text-muted">Course not found.</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/courses/${id || 'edit'}/edit`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" /> Edit Course
          </button>
          <button 
            onClick={() => navigate(`/courses/${id || 'curriculum'}/curriculum`)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
          >
            <BookOpen className="w-4 h-4 text-brand-accent" /> Manage Curriculum
          </button>
        </div>
      </div>

      {/* Course Banner Dashboard */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-48 bg-brand-primary/90 relative overflow-hidden flex items-center justify-center">
          {/* Mock Banner */}
          <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/0b1f4d/0b1f4d.png')] bg-cover bg-center opacity-50"></div>
          <h1 className="text-4xl font-black text-white relative z-10 tracking-wider uppercase opacity-20">{course.category?.name || course.category}</h1>
        </div>
        <div className="p-6 md:p-8 relative">
          <div className="absolute -top-16 left-6 md:left-8 w-32 h-32 rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center shadow-md">
            <span className="text-4xl font-bold text-gray-300">{course.title ? course.title.substring(0, 2).toUpperCase() : 'CO'}</span>
          </div>
          
          <div className="mt-16 md:mt-0 md:ml-40 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge status={course.status === 'Published' ? "success" : "warning"}>{course.status}</Badge>
                <span className="text-xs font-medium bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded uppercase tracking-wider">{course.category?.name || course.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-main">{course.title}</h1>
              <p className="text-text-muted mt-2 max-w-2xl text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
            
            <div className="shrink-0 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full md:w-64">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Pricing</p>
              <h2 className="text-3xl font-bold text-text-main">₹{course.price}</h2>
              <p className="text-sm font-medium text-brand-primary mt-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Lifetime Access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '1,250', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Completion Rate', value: '68%', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Revenue Generated', value: '₹5.6 Cr', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Average Rating', value: '4.8 / 5.0', icon: Star, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">{stat.label}</p>
              <p className="text-2xl font-bold text-text-main">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Curriculum Overview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-text-main">Curriculum Overview</h3>
              <button 
                onClick={() => navigate(`/courses/${id || 'curriculum'}/curriculum`)}
                className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors"
              >
                View Full Structure
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!course.modules || course.modules.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-sm">No curriculum modules added yet.</div>
              ) : (
                course.modules.map((mod, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-main text-sm">{mod.title}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{mod.lessons?.length || 0} Lessons</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Faculty Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">Assigned Faculty</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold border border-brand-primary/20">
                  {course.instructor?.name ? course.instructor.name.substring(0, 2).toUpperCase() : 'IN'}
                </div>
                <div>
                  <h4 className="font-semibold text-text-main">{course.instructor?.name || 'Unknown Instructor'}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{course.instructor?.email || 'No email provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Enabled */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">Course Features</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {['Live Classes', 'Notes & PDFs', 'Mock Exams', 'Certificate'].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-main">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
