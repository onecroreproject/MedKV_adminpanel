import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Ban, RefreshCw, Mail, Phone, MapPin, 
  BookOpen, Video, Award, Clock, Calendar, CheckCircle, XCircle, Activity, X
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import { getStudentById, sendMessageToStudent } from '../../services/studentService';
import axios from 'axios';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageTitle.trim() || !messageContent.trim()) return;
    
    setIsSending(true);
    try {
      await sendMessageToStudent(id, { title: messageTitle, message: messageContent });
      alert("Message sent successfully!");
      setIsMessageModalOpen(false);
      setMessageTitle('');
      setMessageContent('');
    } catch (err) {
      alert("Failed to send message: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudentById(id);
        if (response.success) {
          setStudentData(response.data);
          try {
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            const statsRes = await axios.get(`${import.meta.env.VITE_API_URL}/attendance/student/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (statsRes.data.success) {
              setAnalytics(statsRes.data);
            }
          } catch (err) {
            console.error('Failed to fetch analytics', err);
          }
        } else {
          setError('Failed to fetch student details.');
        }
      } catch (err) {
        setError('Error fetching student.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !studentData) {
    return <div className="p-6 text-center text-red-500">{error || 'Student not found.'}</div>;
  }

  const student = {
    id: studentData._id?.substring(studentData._id.length - 6).toUpperCase() || 'STU-1001',
    name: studentData.name || 'Unknown Student',
    email: studentData.email || 'N/A',
    phone: studentData.phoneNumber || 'N/A',
    gender: studentData.gender || 'Not specified',
    dob: studentData.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not specified',
    country: studentData.country || 'N/A',
    state: studentData.state || 'N/A',
    city: studentData.city || 'N/A',
    qualification: studentData.qualification || 'N/A',
    regDate: new Date(studentData.createdAt).toLocaleDateString(),
    status: studentData.isActive !== false ? 'Active' : 'Inactive',
    membership: 'No Active Plan',
    img: studentData.name ? studentData.name.substring(0, 2).toUpperCase() : 'ST'
  };

  const purchasedCourses = studentData.enrolledCourses?.map((enrollment, index) => ({
    id: enrollment.course?._id || index,
    name: enrollment.course?.title || 'Unknown Course',
    purchaseDate: new Date(enrollment.enrolledAt).toLocaleDateString(),
    expiryDate: enrollment.validUntil ? new Date(enrollment.validUntil).toLocaleDateString() : 'Lifetime',
    progress: enrollment.progress || 0
  })) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/students')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-status-error rounded-lg text-sm font-medium hover:bg-red-100">
            <Ban className="w-4 h-4" /> Suspend
          </button>
        </div>
      </div>

      {/* Profile Header Dashboard */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
        <div className="w-24 h-24 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-3xl font-bold border-2 border-brand-primary/20 shrink-0">
          {student.img}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{student.name}</h1>
            <p className="text-text-muted text-sm mt-1">{student.id}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge status="success">{student.status}</Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm text-text-muted">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {student.email}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {student.phone}</p>
          </div>
          <div className="space-y-2 text-sm text-text-muted">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {student.city}, {student.country}</p>
            <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Joined {student.regDate}</p>
          </div>
          <div className="space-y-3 pt-2 lg:pt-0">
            <button onClick={() => setIsMessageModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90">
              <Mail className="w-4 h-4" /> Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Info) */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <p className="text-text-muted mb-1 text-xs uppercase tracking-wider">Gender</p>
                <p className="font-medium text-text-main">{student.gender}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1 text-xs uppercase tracking-wider">Date of Birth</p>
                <p className="font-medium text-text-main">{student.dob}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1 text-xs uppercase tracking-wider">State</p>
                <p className="font-medium text-text-main">{student.state}</p>
              </div>
              <div>
                <p className="text-text-muted mb-1 text-xs uppercase tracking-wider">Qualification</p>
                <p className="font-medium text-text-main">{student.qualification}</p>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-text-main">Subscription Details</h3>
            </div>
            <div className="p-6 space-y-4">
              {purchasedCourses.length === 0 ? (
                <div className="text-center text-text-muted">No active subscriptions.</div>
              ) : (
                purchasedCourses.map((course) => {
                   const isExpired = course.expiryDate !== 'Lifetime' && new Date(course.expiryDate).getTime() < Date.now();
                   return (
                  <div key={course.id} className="p-4 bg-brand-primary/5 rounded-lg border border-brand-primary/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-brand-primary text-lg">{course.name}</h4>
                        <p className="text-xs text-text-muted mt-0.5">Course Access</p>
                      </div>
                      <Badge status={isExpired ? "danger" : "success"}>{isExpired ? "Expired" : "Active"}</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Start Date</span>
                        <span className="font-medium text-text-main">{course.purchaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Expiry Date</span>
                        <span className="font-medium text-text-main">{course.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Middle & Right Column (Activity & Progress) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Progress Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Learning Hours', value: '0h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Courses Completed', value: `${purchasedCourses.filter(c => c.progress === 100).length}/${purchasedCourses.length}`, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { label: 'Avg Test Score', value: 'N/A', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
              { label: 'Completion Rate', value: `${purchasedCourses.length ? Math.round(purchasedCourses.reduce((sum, c) => sum + c.progress, 0) / purchasedCourses.length) : 0}%`, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-100' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-text-main leading-tight mb-1">{stat.value}</p>
                <p className="text-xs font-medium text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Purchased Courses */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-text-main">Purchased Courses</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchasedCourses.length === 0 ? (
                <div className="col-span-1 md:col-span-2 text-center text-text-muted py-4">No purchased courses yet.</div>
              ) : (
                purchasedCourses.map(course => (
                  <div key={course.id} className="border border-gray-100 rounded-xl p-4 hover:border-brand-primary/30 transition-colors">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-text-main text-sm line-clamp-1">{course.name}</h4>
                        <p className="text-xs text-text-muted mt-1">Purchased: {course.purchaseDate}</p>
                        
                        <div className="mt-3 flex items-center gap-3">
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${course.progress === 100 ? 'bg-status-success' : 'bg-brand-primary'}`} style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-text-main">{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Live Class Analytics */}
          {analytics && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-text-main flex items-center gap-2"><Video className="w-4 h-4 text-brand-primary" /> Live Class Analytics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Classes Attended</p>
                     <p className="text-xl font-bold text-slate-800">{analytics.stats.totalClasses}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Watch Time</p>
                     <p className="text-xl font-bold text-slate-800">{analytics.stats.totalDuration} min</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Chats</p>
                     <p className="text-xl font-bold text-slate-800">{analytics.stats.totalChats}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Hand Raises</p>
                     <p className="text-xl font-bold text-slate-800">{analytics.stats.totalHandRaises}</p>
                   </div>
                </div>
                
                {analytics.history && analytics.history.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-text-main mb-2">Recent Classes</h4>
                    {analytics.history.slice(0, 5).map((record) => (
                      <div key={record._id} className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
                         <div>
                            <p className="font-medium text-sm text-text-main">{record.liveClass?.title || 'Unknown Class'}</p>
                            <p className="text-xs text-text-muted mt-0.5">{new Date(record.joinTime).toLocaleString()}</p>
                         </div>
                         <div className="text-right">
                            <Badge status={record.status === 'Present' ? 'success' : 'danger'}>{record.status}</Badge>
                            <p className="text-xs font-bold text-slate-500 mt-1">{record.duration} mins watched</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-text-main">Payment History</h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold whitespace-nowrap">Date</th>
                    <th className="px-6 py-3 font-semibold whitespace-nowrap">Course</th>
                    <th className="px-6 py-3 font-semibold whitespace-nowrap">Amount</th>
                    <th className="px-6 py-3 font-semibold whitespace-nowrap">Transaction ID</th>
                    <th className="px-6 py-3 font-semibold whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {!studentData.payments || studentData.payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No payment history found.</td>
                    </tr>
                  ) : (
                    studentData.payments.map(payment => (
                      <tr key={payment._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-text-muted whitespace-nowrap">{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-text-main whitespace-nowrap">{payment.course?.title || 'Unknown Course'}</td>
                        <td className="px-6 py-4 font-semibold text-brand-primary whitespace-nowrap">{payment.currency} {payment.amount}</td>
                        <td className="px-6 py-4 text-xs font-mono text-text-muted whitespace-nowrap">{payment.razorpayPaymentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge status={payment.status === 'Success' ? 'success' : payment.status === 'Failed' ? 'danger' : 'warning'}>{payment.status}</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-text-main text-lg">Send Message</h3>
              <button onClick={() => setIsMessageModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  placeholder="E.g., Welcome to the Course!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Message</label>
                <textarea 
                  required
                  rows="4"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSending}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSending ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                  ) : (
                    <><Mail className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
