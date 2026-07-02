import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Copy, CheckCircle2, HelpCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function QuestionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const qData = {
    id: id || 'Q-1045',
    text: 'Which of the following is the most common primary malignant brain tumor in adults?',
    category: 'FRCR Part 2A',
    difficulty: 'Intermediate',
    type: 'MCQ (Single Best Answer)',
    status: 'Active',
    author: 'Dr. Sarah Connor',
    options: [
      { letter: 'A', text: 'Meningioma', isCorrect: false },
      { letter: 'B', text: 'Glioblastoma Multiforme (GBM)', isCorrect: true },
      { letter: 'C', text: 'Primary CNS Lymphoma', isCorrect: false },
      { letter: 'D', text: 'Ependymoma', isCorrect: false }
    ],
    explanation: 'Glioblastoma Multiforme (GBM) is the most common and most aggressive malignant primary brain tumor in adults. While Meningiomas are the most common primary brain tumors overall, they are typically benign.',
    hasImage: false
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/mcq')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Question Bank
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Copy className="w-4 h-4" /> Duplicate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-500 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
          <div className="flex items-center gap-2 mb-2">
            <Badge status="success">{qData.status}</Badge>
            <Badge status="warning">{qData.difficulty}</Badge>
            <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded uppercase tracking-wider">{qData.category}</span>
          </div>
          <p className="text-xs text-text-muted">ID: {qData.id}</p>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
          
          <div className="flex gap-4">
            <div className="mt-1 w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Question</p>
              <h2 className="text-xl font-medium text-text-main leading-relaxed">{qData.text}</h2>
            </div>
          </div>

          <div className="pl-14">
            <div className="space-y-3">
              {qData.options.map((opt) => (
                <div key={opt.letter} className={`flex items-center p-4 rounded-lg border ${opt.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-bold mr-4 shrink-0 ${opt.isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-text-muted'}`}>
                    {opt.letter}
                  </div>
                  <span className={`text-sm font-medium ${opt.isCorrect ? 'text-emerald-900' : 'text-text-main'}`}>{opt.text}</span>
                  {opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          <div className="pl-14">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-brand-primary mb-2">Explanation</h4>
              <p className="text-sm text-text-main leading-relaxed">{qData.explanation}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
