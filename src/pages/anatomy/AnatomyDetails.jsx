import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, BrainCircuit, Users, CheckCircle, Crosshair, HelpCircle, Image as ImageIcon, MapPin, Search } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function AnatomyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // overview, labels, quizzes

  const anatomy = {
    id: id || 'AN-001',
    title: 'Neuro Anatomy: Brain Stem',
    category: 'Neuro Anatomy',
    createdDate: 'Oct 26, 2023',
    updatedDate: 'Oct 28, 2023',
    status: 'Published',
    stats: { labels: 45, quizzes: 12, views: '3.2k', completionRate: '88%' }
  };

  const mockLabels = [
    { id: 1, name: 'Corpus Callosum', region: 'Cerebrum', description: 'Connects the left and right cerebral hemispheres.' },
    { id: 2, name: 'Cerebellum', region: 'Hindbrain', description: 'Plays an important role in motor control.' },
    { id: 3, name: 'Medulla Oblongata', region: 'Brainstem', description: 'Controls autonomic functions such as breathing.' },
  ];

  const mockQuizzes = [
    { id: 1, question: 'Identify the structure connecting the two hemispheres.', category: 'Identification', diff: 'Beginner', correct: 'Corpus Callosum' },
    { id: 2, question: 'Which part is primarily responsible for motor control?', category: 'Function', diff: 'Intermediate', correct: 'Cerebellum' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={() => navigate('/anatomy')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Anatomy
        </button>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit Module
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Main Info Dashboard */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20 shrink-0">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status="success">{anatomy.status}</Badge>
              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{anatomy.category}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main leading-tight">{anatomy.title}</h1>
            <p className="text-text-muted text-sm mt-1">Created on {anatomy.createdDate} • Last updated {anatomy.updatedDate}</p>
          </div>
        </div>

        <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center min-w-[100px]">
            <Crosshair className="w-5 h-5 text-brand-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-text-main">{anatomy.stats.labels}</p>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Labels</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center min-w-[100px]">
            <HelpCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-text-main">{anatomy.stats.quizzes}</p>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Quizzes</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center min-w-[100px]">
            <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-text-main">{anatomy.stats.views}</p>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Views</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center min-w-[100px]">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-emerald-600">{anatomy.stats.completionRate}</p>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Completion</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200 w-full sm:w-fit">
        {['overview', 'labels', 'quizzes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
              activeTab === tab ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-text-main'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        
        {/* Overview Tab (Image Gallery) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-text-main flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-primary" /> CT Image Gallery</h3>
                <span className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded">12 Slices</span>
              </div>
              <div className="p-6">
                <div className="aspect-[4/3] bg-black rounded-lg relative overflow-hidden flex items-center justify-center group cursor-zoom-in">
                  <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/0f172a/94a3b8.png?text=CT+Scan+Slice+1')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-16 h-12 rounded bg-gray-200 shrink-0 cursor-pointer ${i === 1 ? 'ring-2 ring-brand-primary' : 'opacity-60 hover:opacity-100'}`}>
                      <div className={`w-full h-full bg-[url('https://placehold.co/100x100/0f172a/94a3b8.png')] bg-cover bg-center rounded`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-text-main flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-primary" /> MRI Image Gallery</h3>
                <span className="text-xs font-medium bg-white border border-gray-200 px-2 py-1 rounded">8 Slices</span>
              </div>
              <div className="p-6">
                <div className="aspect-[4/3] bg-black rounded-lg relative overflow-hidden flex items-center justify-center group cursor-zoom-in">
                  <div className="absolute inset-0 bg-[url('https://placehold.co/800x600/0f172a/94a3b8.png?text=MRI+Scan+Slice+1')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-16 h-12 rounded bg-gray-200 shrink-0 cursor-pointer ${i === 1 ? 'ring-2 ring-brand-primary' : 'opacity-60 hover:opacity-100'}`}>
                      <div className={`w-full h-full bg-[url('https://placehold.co/100x100/0f172a/94a3b8.png')] bg-cover bg-center rounded`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Labels Tab */}
        {activeTab === 'labels' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Label Name</th>
                    <th className="px-6 py-4">Anatomy Region</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockLabels.map((label) => (
                    <tr key={label.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-accent" /> {label.name}
                      </td>
                      <td className="px-6 py-4">{label.region}</td>
                      <td className="px-6 py-4 text-text-muted max-w-[300px] truncate">{label.description}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-brand-primary hover:text-brand-accent font-medium text-xs">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-text-main whitespace-nowrap">
                <thead className="bg-gray-50 text-text-muted font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Question</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Correct Answer</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium max-w-[300px] truncate">{quiz.question}</td>
                      <td className="px-6 py-4 text-text-muted">{quiz.category}</td>
                      <td className="px-6 py-4">
                        <Badge status={quiz.diff === 'Beginner' ? 'success' : 'warning'}>{quiz.diff}</Badge>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">{quiz.correct}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-brand-primary hover:text-brand-accent font-medium text-xs">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
