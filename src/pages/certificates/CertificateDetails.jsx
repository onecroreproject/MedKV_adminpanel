import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, RotateCcw, XCircle, Award, User, BookOpen, Calendar, CheckCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function CertificateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const certData = {
    id: id || 'CERT-1045',
    student: 'Alice Johnson',
    course: 'FRCR Part 2A Comprehensive',
    issueDate: 'October 26, 2023',
    status: 'Issued',
    completionScore: '92%',
    eligibility: 'Met all criteria (Course Completion + Mock Exam passed)'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/certificates')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <RotateCcw className="w-4 h-4" /> Reissue Certificate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            <XCircle className="w-4 h-4" /> Revoke
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Certificate Data Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><Award className="w-4 h-4 text-brand-primary"/> Record Details</h3>
              <Badge status="success">{certData.status}</Badge>
            </div>
            <div className="p-6 space-y-5">
              
              <div className="flex items-start gap-3">
                <div className="mt-1"><User className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Student Name</p>
                  <p className="text-sm font-medium text-text-main">{certData.student}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1"><BookOpen className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Course Completed</p>
                  <p className="text-sm font-medium text-text-main leading-tight">{certData.course}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1"><Calendar className="w-4 h-4 text-gray-400" /></div>
                <div>
                  <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-0.5">Date of Issue</p>
                  <p className="text-sm font-medium text-text-main">{certData.issueDate}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Eligibility Status</p>
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm flex items-start gap-2 border border-emerald-100">
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-tight">{certData.eligibility}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Certificate View Mockup */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
              <span className="font-bold text-gray-600 flex items-center gap-2"><Eye className="w-4 h-4"/> Preview</span>
              <span className="font-mono text-gray-400">ID: {certData.id}</span>
            </div>
            <div className="p-8 bg-gray-100 flex justify-center items-center overflow-auto min-h-[500px]">
              
              {/* Scaled down preview of the certificate */}
              <div className="bg-white shadow-xl relative" style={{ width: '100%', maxWidth: '600px', aspectRatio: '1.414' }}>
                <div className="absolute inset-2 sm:inset-3 border-[6px] sm:border-[8px] border-brand-accent/20"></div>
                <div className="absolute inset-4 sm:inset-5 border border-brand-primary/10"></div>
                
                <div className="absolute inset-0 flex flex-col items-center text-center px-12 sm:px-16 py-8 sm:py-12">
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary uppercase tracking-widest mb-1 sm:mb-2">Certificate of Completion</h1>
                  <p className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-brand-accent uppercase mb-6 sm:mb-8">Dr. Sam Reefath Radiology Academy</p>

                  <p className="text-[10px] sm:text-xs text-gray-500 italic mb-2 sm:mb-3">This is to proudly certify that</p>
                  
                  <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 border-b-2 border-gray-300 pb-1 sm:pb-2 px-6 sm:px-8 mb-4 sm:mb-5">
                    {certData.student}
                  </h2>

                  <p className="text-[10px] sm:text-xs text-gray-500 italic mb-1 sm:mb-2">has successfully completed the requirements for the course</p>
                  
                  <h3 className="text-sm sm:text-base font-bold text-brand-primary mb-8 sm:mb-10">
                    {certData.course}
                  </h3>

                  <div className="flex justify-between w-full mt-auto px-4 sm:px-6">
                    <div className="flex flex-col items-center">
                      <div className="text-xs sm:text-sm font-medium text-gray-800 mb-1">{certData.issueDate}</div>
                      <div className="w-24 sm:w-32 border-t border-gray-400"></div>
                      <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase mt-1">Date of Completion</div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="font-['Brush_Script_MT',cursive] text-lg sm:text-xl text-brand-primary mb-1 -mt-2 opacity-80">Dr. Sam Reefath</div>
                      <div className="w-32 sm:w-40 border-t border-gray-400"></div>
                      <div className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase mt-1">Course Director</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
