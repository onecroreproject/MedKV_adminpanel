import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Copy, Download, Printer, Settings, FileText, CheckCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function TemplateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tplData = {
    id: id || 'TPL-001',
    name: 'CT Brain Routine Report',
    category: 'CT',
    author: 'Dr. Sarah Connor',
    status: 'Active',
    updated: 'Oct 26, 2023',
    uses: 1245
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Copy className="w-4 h-4" /> Duplicate
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Print Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: PDF Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col min-h-[800px]">
            {/* PDF Toolbar */}
            <div className="bg-gray-800 text-gray-300 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <span>Previewing: {tplData.name}.pdf</span>
              <span>Page 1 of 1</span>
            </div>
            
            {/* PDF Document Area */}
            <div className="flex-1 bg-gray-100 p-8 flex justify-center">
              {/* The "Paper" */}
              <div className="bg-white w-full max-w-[700px] shadow-sm border border-gray-200 px-12 py-16 font-serif text-gray-800">
                
                {/* Letterhead Mockup */}
                <div className="border-b-2 border-brand-primary pb-6 mb-8 text-center">
                  <h2 className="text-2xl font-bold text-brand-primary uppercase tracking-wide">Dr. Sam Reefath Radiology Academy</h2>
                  <p className="text-sm text-gray-500 mt-1">Standardized Reporting Template Documentation</p>
                </div>

                {/* Report Content */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-center underline mb-8">{tplData.name.toUpperCase()}</h3>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-bold">Study:</div>
                    <div className="col-span-3 border-b border-dotted border-gray-300"></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-bold">Technique:</div>
                    <div className="col-span-3 border-b border-dotted border-gray-300"></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="font-bold">Clinical History:</div>
                    <div className="col-span-3 border-b border-dotted border-gray-300"></div>
                  </div>

                  <div>
                    <div className="font-bold text-lg mb-2 underline">FINDINGS:</div>
                    <ul className="list-disc list-inside space-y-4 ml-4">
                      <li className="text-gray-400 italic">Describe cranial vault and base...</li>
                      <li className="text-gray-400 italic">Describe ventricular system and extra-axial spaces...</li>
                      <li className="text-gray-400 italic">Describe brain parenchyma (gray/white matter differentiation)...</li>
                      <li className="text-gray-400 italic">Mention midline shift or mass effect...</li>
                    </ul>
                  </div>

                  <div className="pt-8">
                    <div className="font-bold text-lg mb-2 underline">IMPRESSION:</div>
                    <ol className="list-decimal list-inside space-y-4 ml-4">
                      <li className="text-gray-400 italic">Primary diagnostic impression...</li>
                      <li className="text-gray-400 italic">Secondary findings (if any)...</li>
                    </ol>
                  </div>

                  <div className="pt-8">
                    <div className="font-bold text-lg mb-2 underline">RECOMMENDATIONS:</div>
                    <ul className="list-none space-y-2 ml-4">
                      <li className="text-gray-400 italic border-b border-dotted border-gray-300 w-3/4"></li>
                    </ul>
                  </div>

                </div>

                {/* Footer Signature */}
                <div className="mt-20 flex justify-end">
                  <div className="text-center">
                    <div className="w-48 border-b border-gray-400 mb-2"></div>
                    <p className="font-bold text-sm">Reporting Radiologist</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-brand-primary"/> Template Overview</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Status</p>
                <Badge status="success">{tplData.status}</Badge>
              </div>
              
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Category</p>
                <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">{tplData.category}</span>
              </div>
              
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Author</p>
                <p className="text-sm font-medium text-text-main">{tplData.author}</p>
              </div>
              
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm font-medium text-text-main">{tplData.updated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-brand-primary"/> Usage Stats</h3>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-3xl font-bold text-brand-primary">{tplData.uses.toLocaleString()}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Uses</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-primary"/> Availability</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Available for Students</li>
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Available for Faculty</li>
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Featured Template</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
