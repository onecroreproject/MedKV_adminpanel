import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Search, Filter, Edit, Trash2, Clock, CheckCircle, FileText } from 'lucide-react';
import Badge from '../../components/common/Badge';

const mockExams = [
  { id: 'EX-001', name: 'FRCR Part 2A Mock Exam 1', type: 'FRCR Part 2A', duration: '120 Min', questions: 120, pass: '70%', status: 'Published' },
  { id: 'EX-002', name: 'Neuroanatomy Spot Quiz', type: 'Anatomy Quiz', duration: '30 Min', questions: 25, pass: '80%', status: 'Scheduled' },
  { id: 'EX-003', name: 'Rapid Reporting Set A', type: 'Rapid Reporting', duration: '35 Min', questions: 30, pass: '90%', status: 'Draft' },
  { id: 'EX-004', name: 'Weekly Pathology Assessment', type: 'Pathology Quiz', duration: '60 Min', questions: 50, pass: '65%', status: 'Archived' },
];

export default function ExamList() {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Published': return 'success';
      case 'Scheduled': return 'warning';
      case 'Draft': return 'default';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Mock Exam Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage assessments, mock exams, and quiz configurations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" /> Export Exams
          </button>
          <button 
            onClick={() => navigate('/exams/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Create Exam
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search exams by name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option value="">Exam Type</option>
            <option value="frcr">FRCR Part 2A</option>
            <option value="anatomy">Anatomy Quiz</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Exam Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Questions</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">Pass %</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/exams/${exam.id}`)}>
                        <FileText className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div>
                        <button 
                          onClick={() => navigate(`/exams/${exam.id}`)}
                          className="font-semibold text-text-main hover:text-brand-primary transition-colors text-left"
                        >
                          {exam.name}
                        </button>
                        <p className="text-xs text-text-muted mt-0.5">ID: {exam.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {exam.type}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700">
                    {exam.questions}
                  </td>
                  <td className="px-6 py-4 text-center text-text-muted">
                    {exam.duration}
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {exam.pass}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(exam.status)}>{exam.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {exam.status === 'Draft' && (
                        <button className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-white rounded hover:bg-brand-primary/90 mr-2">Publish</button>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Exam" onClick={() => navigate(`/exams/${exam.id}`)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Exam">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
