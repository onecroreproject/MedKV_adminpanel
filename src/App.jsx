import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import FacultyLayout from './layouts/FacultyLayout';
import FacultyDashboard from './pages/faculty/FacultyDashboard';

import MyCoursesList from './pages/faculty/courses/MyCoursesList';
import FacultyCourseLayout from './pages/faculty/courses/FacultyCourseLayout';
import CourseOverview from './pages/faculty/courses/CourseOverview';
import CourseCurriculum from './pages/faculty/courses/CourseCurriculum';
import CourseStudents from './pages/faculty/courses/CourseStudents';
import CourseAnalytics from './pages/faculty/courses/CourseAnalytics';
import UploadNotes from './pages/faculty/courses/UploadNotes';

import FacultyLiveClasses from './pages/faculty/live-classes/FacultyLiveClasses';
import FacultyRecordings from './pages/faculty/recordings/FacultyRecordings';
import FacultyCaseLibrary from './pages/faculty/cases/FacultyCaseLibrary';
import FacultyMCQBank from './pages/faculty/mcq/FacultyMCQBank';
import FacultyAnatomy from './pages/faculty/anatomy/FacultyAnatomy';
import FacultyPathology from './pages/faculty/pathology/FacultyPathology';
import FacultyPerformance from './pages/faculty/performance/FacultyPerformance';
import FacultyNotifications from './pages/faculty/notifications/FacultyNotifications';
import FacultyProfile from './pages/faculty/profile/FacultyProfile';

import AdminLogin from './pages/auth/AdminLogin';
import AdminRegister from './pages/auth/AdminRegister';
import AdminForgotPassword from './pages/auth/AdminForgotPassword';
import AdminResetPassword from './pages/auth/AdminResetPassword';
import FacultyLogin from './pages/auth/FacultyLogin';
import FacultyRegister from './pages/auth/FacultyRegister';
import FacultyForgotPassword from './pages/auth/FacultyForgotPassword';
import FacultyResetPassword from './pages/auth/FacultyResetPassword';
import StudentList from './pages/students/StudentList';
import StudentDetails from './pages/students/StudentDetails';
import FacultyList from './pages/faculty/FacultyList';
import AddFaculty from './pages/faculty/AddFaculty';
import CourseList from './pages/courses/CourseList';
import AddCourse from './pages/courses/AddCourse';
import CourseDetails from './pages/courses/CourseDetails';
import CurriculumManagement from './pages/courses/CurriculumManagement';
import CategoryList from './pages/categories/CategoryList';
import LiveClassList from './pages/liveClasses/LiveClassList';
import ScheduleClass from './pages/liveClasses/ScheduleClass';
import ClassDetails from './pages/liveClasses/ClassDetails';
import RecordingList from './pages/recordings/RecordingList';
import UploadRecording from './pages/recordings/UploadRecording';
import RecordingDetails from './pages/recordings/RecordingDetails';
import AnatomyList from './pages/anatomy/AnatomyList';
import AddAnatomy from './pages/anatomy/AddAnatomy';
import AnatomyDetails from './pages/anatomy/AnatomyDetails';
import PathologyList from './pages/pathology/PathologyList';
import AddPathology from './pages/pathology/AddPathology';
import PathologyDetails from './pages/pathology/PathologyDetails';
import CaseList from './pages/cases/CaseList';
import AddCase from './pages/cases/AddCase';
import CaseDetails from './pages/cases/CaseDetails';
import QuestionBank from './pages/mcq/QuestionBank';
import AddQuestion from './pages/mcq/AddQuestion';
import QuestionDetails from './pages/mcq/QuestionDetails';
import ExamList from './pages/exams/ExamList';
import AddExam from './pages/exams/AddExam';
import ExamDetails from './pages/exams/ExamDetails';
import TemplateList from './pages/templates/TemplateList';
import AddTemplate from './pages/templates/AddTemplate';
import TemplateDetails from './pages/templates/TemplateDetails';
import ProtocolList from './pages/protocols/ProtocolList';
import AddProtocol from './pages/protocols/AddProtocol';
import ProtocolDetails from './pages/protocols/ProtocolDetails';
import NotificationList from './pages/notifications/NotificationList';
import AddNotification from './pages/notifications/AddNotification';
import CertificateList from './pages/certificates/CertificateList';
import CertificateTemplate from './pages/certificates/CertificateTemplate';
import CertificateDetails from './pages/certificates/CertificateDetails';
import PaymentList from './pages/payments/PaymentList';
import PaymentDetails from './pages/payments/PaymentDetails';
import SubscriptionList from './pages/subscriptions/SubscriptionList';
import SubscriptionPlans from './pages/subscriptions/SubscriptionPlans';
import SubscriptionDetails from './pages/subscriptions/SubscriptionDetails';
import ApprovalList from './pages/approvals/ApprovalList';
import ApprovalReview from './pages/approvals/ApprovalReview';
import CMSDashboard from './pages/cms/CMSDashboard';
import EnquiryList from './pages/enquiries/EnquiryList';
import TicketManagement from './pages/tickets/TicketManagement';
import HomepageEditor from './pages/cms/HomepageEditor';
import GeneralCMSEditor from './pages/cms/GeneralCMSEditor';
import ProfileSettings from './pages/profile/ProfileSettings';
import SettingsDashboard from './pages/settings/SettingsDashboard';
import SEODashboard from './pages/seo/SEODashboard';
import SEOEditor from './pages/seo/SEOEditor';

import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/register" element={<FacultyRegister />} />
        <Route path="/faculty/forgot-password" element={<FacultyForgotPassword />} />
        <Route path="/faculty/reset-password/:token" element={<FacultyResetPassword />} />

        {/* Protected Admin/Faculty Routes */}
        <Route path="/" element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          
          {/* Student Routes */}
          <Route path="students" element={<StudentList />} />
          <Route path="students/:id" element={<StudentDetails />} />

          {/* Faculty Routes */}
          <Route path="faculty" element={<FacultyList />} />
          <Route path="faculty/add" element={<AddFaculty />} />

          {/* Course Routes */}
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="courses/:id/curriculum" element={<CurriculumManagement />} />
          <Route path="courses/:id/edit" element={<AddCourse />} />

          {/* Category Management */}
          <Route path="categories" element={<CategoryList />} />

          {/* Live Classes Routes */}
          <Route path="live-classes" element={<LiveClassList />} />
          <Route path="live-classes/schedule" element={<ScheduleClass />} />
          <Route path="live-classes/edit/:id" element={<ScheduleClass />} />
          <Route path="live-classes/:id" element={<ClassDetails />} />

          {/* Recorded Sessions Routes */}
          <Route path="recordings" element={<RecordingList />} />
          <Route path="recordings/upload" element={<UploadRecording />} />
          <Route path="recordings/:id" element={<RecordingDetails />} />

          {/* Anatomy Routes */}
          <Route path="anatomy" element={<AnatomyList />} />
          <Route path="anatomy/add" element={<AddAnatomy />} />
          <Route path="anatomy/:id" element={<AnatomyDetails />} />

          {/* Pathology Routes */}
          <Route path="pathology" element={<PathologyList />} />
          <Route path="pathology/add" element={<AddPathology />} />
          <Route path="pathology/:id" element={<PathologyDetails />} />

          {/* Case Library Routes */}
          <Route path="cases" element={<CaseList />} />
          <Route path="cases/add" element={<AddCase />} />
          <Route path="cases/:id" element={<CaseDetails />} />

          {/* MCQ Question Bank Routes */}
          <Route path="mcq" element={<QuestionBank />} />
          <Route path="mcq/add" element={<AddQuestion />} />
          <Route path="mcq/:id" element={<QuestionDetails />} />

          {/* Mock Exams Routes */}
          <Route path="exams" element={<ExamList />} />
          <Route path="exams/add" element={<AddExam />} />
          <Route path="exams/:id" element={<ExamDetails />} />

          {/* Reporting Templates Routes */}
          <Route path="templates" element={<TemplateList />} />
          <Route path="templates/add" element={<AddTemplate />} />
          <Route path="templates/:id" element={<TemplateDetails />} />

          {/* Protocols & Guidelines Routes */}
          <Route path="protocols" element={<ProtocolList />} />
          <Route path="protocols/add" element={<AddProtocol />} />
          <Route path="protocols/:id" element={<ProtocolDetails />} />

          {/* Notifications Routes */}
          <Route path="notifications" element={<NotificationList />} />
          <Route path="notifications/add" element={<AddNotification />} />

          {/* Certificate Routes */}
          <Route path="certificates" element={<CertificateList />} />
          <Route path="certificates/template" element={<CertificateTemplate />} />
          <Route path="certificates/:id" element={<CertificateDetails />} />

          {/* Payment Routes */}
          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/:id" element={<PaymentDetails />} />

          {/* Subscription Routes */}
          <Route path="subscriptions" element={<SubscriptionList />} />
          <Route path="subscriptions/plans" element={<SubscriptionPlans />} />
          <Route path="subscriptions/:id" element={<SubscriptionDetails />} />

          {/* Approvals Routes */}
          <Route path="approvals" element={<ApprovalList />} />
          <Route path="approvals/:id" element={<ApprovalReview />} />

          {/* Enquiry Routes */}
          <Route path="enquiries" element={<EnquiryList />} />

          {/* Ticket Routes */}
          <Route path="tickets" element={<TicketManagement />} />

          {/* CMS Routes */}
          <Route path="cms" element={<CMSDashboard />} />
          <Route path="cms/homepage" element={<HomepageEditor />} />
          <Route path="cms/general" element={<GeneralCMSEditor />} />

          {/* Profile Route */}
          <Route path="profile" element={<ProfileSettings />} />

          {/* Settings Route */}
          <Route path="settings" element={<SettingsDashboard />} />

          {/* SEO Route */}
          <Route path="seo" element={<SEODashboard />} />
          <Route path="seo/edit/:id" element={<SEOEditor />} />
        </Route>

        {/* Protected Faculty Dashboard Routes */}
        <Route path="/faculty-dashboard" element={<ProtectedRoute role="faculty"><FacultyLayout /></ProtectedRoute>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="courses" element={<MyCoursesList />} />
          <Route path="courses/:id" element={<FacultyCourseLayout />}>
            <Route index element={<CourseOverview />} />
            <Route path="curriculum" element={<CourseCurriculum />} />
            <Route path="students" element={<CourseStudents />} />
            <Route path="analytics" element={<CourseAnalytics />} />
            <Route path="notes" element={<UploadNotes />} />
          </Route>
          
          <Route path="live-classes" element={<FacultyLiveClasses />} />
          <Route path="recordings" element={<FacultyRecordings />} />
          <Route path="cases" element={<FacultyCaseLibrary />} />
          <Route path="mcq" element={<FacultyMCQBank />} />
          <Route path="anatomy" element={<FacultyAnatomy />} />
          <Route path="pathology" element={<FacultyPathology />} />
          <Route path="performance" element={<FacultyPerformance />} />
          <Route path="notifications" element={<FacultyNotifications />} />
          <Route path="profile" element={<FacultyProfile />} />

          <Route path="*" element={<Navigate to="/faculty-dashboard" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
