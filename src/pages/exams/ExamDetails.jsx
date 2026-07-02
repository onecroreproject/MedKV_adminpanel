import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Copy, CheckCircle2, FileText, Download, Eye, TrendingUp, Users, Target, Activity } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockResults = [
  { id: 'RES-001', student: 'Alice Johnson', score: 85, percent: '85%', status: 'Passed', date: 'Oct 28, 2023' },
  { id: 'RES-002', student: 'Bob Smith', score: 60, percent: '60%', status: 'Failed', date: 'Oct 28, 2023' },
  { id: 'RES-003', student: 'Charlie Davis', score: 92, percent: '92%', status: 'Passed', date: 'Oct 27, 2023' },
  { id: 'RES-004', student: 'Diana Miller', score: 75, percent: '75%', status: 'Passed', date: 'Oct 26, 2023' },
];

export default function ExamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const examData = {
    id: id || 'EX-001',
    name: 'FRCR Part 2A Mock Exam 1',
    type: 'FRCR Part 2A',
    duration: '120 Minutes',
    questions: 120,
    passingScore: '70%',
    status: 'Published'
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/exams')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Copy className="w-4 h-4" /> Duplicate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Unpublish
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge status="success">{examData.status}</Badge>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider">{examData.type}</span>
          </div>
          <h1 className="text-2xl font-bold text-text-main">{examData.name}</h1>
          <p className="text-sm text-text-muted mt-1">ID: {examData.id}</p>
        </div>
        
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Duration</p>
            <p className="text-xl font-bold text-text-main">{examData.duration}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Questions</p>
            <p className="text-xl font-bold text-text-main">{examData.questions}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-1">Pass Mark</p>
            <p className="text-xl font-bold text-brand-primary">{examData.passingScore}</p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Attempts', value: '342', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Average Score', value: '68%', icon: Target, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Pass Rate', value: '72%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Completion Rate', value: '95%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-0.5">{stat.label}</p>
              <p className="text-xl font-bold text-text-main">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Student Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-text-main flex items-center gap-2"><FileText className="w-4 h-4 text-brand-primary" /> Student Exam Results</h3>
          <button className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-accent">
            <Download className="w-4 h-4" /> Export Results
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-white text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Percentage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attempt Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockResults.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{res.student}</td>
                  <td className="px-6 py-4 text-center font-bold">{res.score}</td>
                  <td className="px-6 py-4 text-center font-bold">{res.percent}</td>
                  <td className="px-6 py-4">
                    <Badge status={res.status === 'Passed' ? 'success' : 'danger'}>{res.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{res.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="flex items-center justify-end w-full gap-2 text-brand-primary hover:text-brand-accent font-medium transition-colors">
                      <Eye className="w-4 h-4" /> View Paper
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
