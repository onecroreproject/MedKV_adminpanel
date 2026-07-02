import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Upload, Search, Filter, Edit, Trash2, HelpCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import ImportModal from '../../components/common/ImportModal';
import { exportToCSV } from '../../utils/exportUtils';

const mockQuestions = [
  { id: 'Q-1045', text: 'Which of the following is the most common primary malignant brain tumor in adults?', category: 'FRCR Part 2A', type: 'MCQ', diff: 'Intermediate', author: 'Dr. Sarah Connor', status: 'Active' },
  { id: 'Q-1046', text: 'Identify the structure marked with the red arrow in the attached CT image.', category: 'Anatomy', type: 'Image-Based', diff: 'Advanced', author: 'Dr. Emily Chen', status: 'Active' },
  { id: 'Q-1047', text: 'A 45-year-old female presents with right upper quadrant pain. US shows...', category: 'Ultrasound', type: 'Case-Based', diff: 'Intermediate', author: 'Dr. John Doe', status: 'Draft' },
  { id: 'Q-1048', text: 'What is the most characteristic MRI finding for Multiple Sclerosis?', category: 'Pathology', type: 'MCQ', diff: 'Beginner', author: 'Dr. Samuel Reefath', status: 'Archived' },
];

export default function QuestionBank() {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

  const handleExport = () => {
    const headers = [
      { label: 'ID', key: 'id' },
      { label: 'Question', key: 'text' },
      { label: 'Category', key: 'category' },
      { label: 'Type', key: 'type' },
      { label: 'Difficulty', key: 'diff' },
      { label: 'Status', key: 'status' }
    ];
    exportToCSV(mockQuestions, headers, 'mcqs_export.csv');
  };

  const handleImport = async (data) => {
    try {
      console.log("Importing MCQs: ", data);
      alert(`Successfully simulated import of ${data.length} questions!`);
    } catch (err) {
      alert("Error importing data");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'success';
      case 'Draft': return 'warning';
      case 'Archived': return 'danger';
      default: return 'default';
    }
  };

  const getDiffColor = (diff) => {
    switch(diff) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">MCQ Question Bank</h1>
          <p className="text-sm text-text-muted mt-1">Manage the centralized database of all examination questions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary rounded-lg text-sm font-medium hover:bg-brand-primary/10 transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button 
            onClick={() => navigate('/mcq/add')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors shadow-sm shadow-brand-primary/30"
          >
            <Plus className="w-4 h-4 text-brand-accent" /> Add Question
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search questions by ID or text..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Category</option>
            <option value="frcr1">FRCR Part 1</option>
            <option value="anatomy">Anatomy</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-text-main focus:outline-none focus:border-brand-primary min-w-[130px]">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-gray-50 text-text-main rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
            <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                </th>
                <th className="px-6 py-4">Question Preview</th>
                <th className="px-6 py-4">Category & Type</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3 max-w-[400px]">
                      <div className="mt-0.5 w-6 h-6 rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 cursor-pointer" onClick={() => navigate(`/mcq/${q.id}`)}>
                        <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
                      </div>
                      <div className="truncate">
                        <button 
                          onClick={() => navigate(`/mcq/${q.id}`)}
                          className="font-medium text-text-main hover:text-brand-primary transition-colors text-left truncate w-full"
                          title={q.text}
                        >
                          {q.text}
                        </button>
                        <p className="text-xs text-text-muted mt-0.5">ID: {q.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-text-main">{q.category}</span>
                      <span className="text-xs text-gray-500">{q.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getDiffColor(q.diff)}>{q.diff}</Badge>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {q.author}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={getStatusColor(q.status)}>{q.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-primary" title="Edit Question" onClick={() => navigate(`/mcq/${q.id}`)}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-600" title="Delete Question">
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
      
      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImport={handleImport} 
        entityName="Questions" 
      />
    </div>
  );
}
