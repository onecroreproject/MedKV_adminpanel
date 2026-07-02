import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Copy, Download, FileText, CheckCircle, Clock, ZoomIn, ZoomOut, Maximize, Replace } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function ProtocolDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const protocolData = {
    id: id || 'PROT-001',
    name: 'CT Brain Stroke Protocol',
    category: 'CT Protocols',
    author: 'Dr. Sarah Connor',
    status: 'Active',
    uploadDate: 'Oct 26, 2023',
    downloads: 342,
    size: '2.4 MB',
    description: 'This is the standard operating procedure and protocol for suspected acute ischemic stroke. Includes non-contrast CT, CT Angiography (CTA), and CT Perfusion (CTP) guidelines.',
  };

  const activityLog = [
    { id: 1, user: 'Dr. Emily Chen', action: 'Downloaded Document', time: '2 hours ago' },
    { id: 2, user: 'Dr. Sarah Connor', action: 'Updated PDF File', time: '1 day ago' },
    { id: 3, user: 'Admin User', action: 'Changed status to Active', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate('/protocols')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Protocols
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Replace className="w-4 h-4" /> Replace PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            <Edit className="w-4 h-4" /> Edit Details
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm">
            <Download className="w-4 h-4" /> Download File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Main Content: PDF Viewer Mockup */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge status="success">{protocolData.status}</Badge>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider">{protocolData.category}</span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-wider ml-auto">{protocolData.size}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">{protocolData.name}</h1>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">{protocolData.description}</p>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden flex flex-col min-h-[700px]">
            {/* PDF Viewer Toolbar */}
            <div className="bg-gray-800 text-gray-300 px-4 py-3 flex flex-wrap items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium text-white truncate max-w-[200px] md:max-w-md">{protocolData.name}.pdf</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-900 rounded px-2 py-1">
                  <span className="text-xs">Page 1 / 12</span>
                </div>
                <div className="w-px h-4 bg-gray-700 mx-1 hidden sm:block"></div>
                <div className="flex items-center gap-1 hidden sm:flex">
                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                  <span className="text-xs font-mono w-12 text-center">100%</span>
                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                </div>
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors" title="Fullscreen"><Maximize className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors text-white" title="Download"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            
            {/* PDF Render Area */}
            <div className="flex-1 bg-gray-950 p-4 md:p-8 flex justify-center overflow-auto">
              {/* Mock PDF Page */}
              <div className="bg-white w-full max-w-[800px] shadow-2xl min-h-[900px] p-12">
                <div className="border-b-2 border-brand-primary pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">{protocolData.name}</h2>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Department of Radiology - Dr. Sam Reefath Academy</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Version 2.1</p>
                    <p className="text-xs text-gray-500 mt-1">Oct 26, 2023</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-bold text-brand-primary border-b border-gray-200 pb-2 mb-4">1. Indications</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                      <li>Acute neurological deficit suspected of stroke.</li>
                      <li>Evaluation for tPA eligibility within window.</li>
                      <li>Suspicion of large vessel occlusion (LVO).</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-xl font-bold text-brand-primary border-b border-gray-200 pb-2 mb-4">2. Patient Preparation</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ensure 18G or 20G IV access in the right antecubital fossa. Review patient eGFR and allergy history. No fasting required for emergency stroke protocols.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-brand-primary border-b border-gray-200 pb-2 mb-4">3. Scanning Parameters</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <table className="w-full text-sm text-left text-gray-700">
                        <tbody>
                          <tr className="border-b border-gray-200"><th className="py-2 font-bold w-1/3">Scan Type</th><td className="py-2">Non-Contrast CT Head</td></tr>
                          <tr className="border-b border-gray-200"><th className="py-2 font-bold">kV / mA</th><td className="py-2">120 kV / Auto mA (Noise Index 4.0)</td></tr>
                          <tr className="border-b border-gray-200"><th className="py-2 font-bold">Slice Thickness</th><td className="py-2">5mm (reconstructed to 1.25mm)</td></tr>
                          <tr><th className="py-2 font-bold">FOV</th><td className="py-2">25 cm</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info & Settings */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-brand-primary"/> Protocol Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Author</p>
                <p className="text-sm font-medium text-text-main">{protocolData.author}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Upload Date</p>
                <p className="text-sm font-medium text-text-main">{protocolData.uploadDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><Download className="w-4 h-4 text-brand-primary"/> Usage Stats</h3>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-3xl font-bold text-brand-primary">{protocolData.downloads.toLocaleString()}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Total Downloads</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-brand-primary"/> Permissions</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Available for Students</li>
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Available for Faculty</li>
              <li className="flex items-center gap-2 text-sm text-text-main"><CheckCircle className="w-4 h-4 text-emerald-500" /> Download Allowed</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-text-main mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-primary"/> Recent Activity</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {activityLog.map((log, index) => (
                <div key={log.id} className="relative flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 relative z-10 border-2 border-white shadow-sm ring-1 ring-gray-200"></div>
                  <div>
                    <p className="text-sm font-medium text-text-main">{log.action}</p>
                    <p className="text-xs text-text-muted mt-0.5">{log.user} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
