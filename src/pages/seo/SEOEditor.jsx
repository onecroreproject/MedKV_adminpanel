import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Globe, Image as ImageIcon, Search, Share2, CheckCircle, AlertCircle, RefreshCw, Smartphone, Monitor } from 'lucide-react';

export default function SEOEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewMode, setPreviewMode] = useState('desktop');

  const { register, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: 'FRCR Part 1 Radiology Course | Dr. Sam Reefath Academy',
      description: 'Master radiology fundamentals with expert-led FRCR preparation courses, case discussions, and mock exams. Join today to elevate your clinical skills.',
      slug: 'courses/frcr-part-1-radiology',
      keywords: 'Radiology, FRCR, MRI, CT Scan, Anatomy, Pathology'
    }
  });

  const title = watch('title');
  const description = watch('description');
  const slug = watch('slug');
  const keywordsStr = watch('keywords');
  const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()).filter(k => k) : [];

  // Character counts
  const titleCount = title?.length || 0;
  const descCount = description?.length || 0;

  // Simple validation logic for SEO Score
  const isTitleGood = titleCount >= 30 && titleCount <= 60;
  const isDescGood = descCount >= 120 && descCount <= 160;
  const isKeywordsGood = keywords.length >= 3;
  const isSlugGood = slug?.length > 0 && !slug.includes(' ');

  const passedChecks = [isTitleGood, isDescGood, isKeywordsGood, isSlugGood].filter(Boolean).length;
  
  let scoreText = 'Poor';
  let scoreColor = 'text-red-600 bg-red-50 border-red-200';
  if (passedChecks === 4) {
    scoreText = 'Excellent';
    scoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (passedChecks === 3) {
    scoreText = 'Good';
    scoreColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (passedChecks === 2) {
    scoreText = 'Needs Improvement';
    scoreColor = 'text-amber-700 bg-amber-50 border-amber-200';
  }

  const onSubmit = (data) => {
    console.log("Saving SEO Config:", data);
    alert('SEO settings saved successfully!');
    navigate('/seo');
  };

  const handleAutoSlug = () => {
    const generated = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setValue('slug', `courses/${generated}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
        <button 
          onClick={() => navigate('/seo')}
          className="flex items-center gap-2 text-text-muted hover:text-brand-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SEO Configurations
        </button>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
            Save Draft
          </button>
          <button 
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary/90 shadow-sm"
          >
            <Save className="w-4 h-4" /> Publish SEO Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Editors */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-bold text-text-main flex items-center gap-2"><Globe className="w-4 h-4 text-brand-primary"/> Metadata Configuration</h3>
            </div>
            <form className="p-6 space-y-6">
              
              {/* Meta Title */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-main">Meta Title</label>
                  <span className={`text-xs font-bold ${titleCount > 60 ? 'text-red-500' : titleCount < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {titleCount} / 60
                  </span>
                </div>
                <input 
                  {...register('title')} 
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${titleCount > 60 ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} 
                />
                {titleCount > 60 && <p className="text-xs text-red-500 mt-1">Title is too long. Search engines may truncate it.</p>}
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">URL Slug</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">reefathradiology.com/</span>
                  <input 
                    {...register('slug')} 
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:border-brand-primary font-mono text-blue-700" 
                  />
                  <button type="button" onClick={handleAutoSlug} className="ml-2 px-3 py-2 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-1" title="Auto-generate from title">
                    <RefreshCw className="w-3.5 h-3.5" /> Auto
                  </button>
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-medium text-text-main">Meta Description</label>
                  <span className={`text-xs font-bold ${descCount > 160 ? 'text-red-500' : descCount < 120 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {descCount} / 160
                  </span>
                </div>
                <textarea 
                  {...register('description')} 
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 leading-relaxed ${descCount > 160 ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50' : 'border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20'}`} 
                />
                {descCount > 160 && <p className="text-xs text-red-500 mt-1">Description is too long. Keep it under 160 characters for best results.</p>}
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Focus Keywords (Comma separated)</label>
                <input 
                  {...register('keywords')} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary" 
                  placeholder="e.g. Radiology, FRCR, Anatomy"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Open Graph Image */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-text-main mb-1.5 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-brand-primary"/> Open Graph Image (Social Sharing)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-6 flex flex-col items-center justify-center hover:border-brand-primary hover:bg-brand-primary/5 cursor-pointer transition-colors text-center">
                  <ImageIcon className="w-8 h-8 text-brand-primary/50 mb-2" />
                  <span className="text-sm font-medium text-text-main">Click to upload custom Open Graph image</span>
                  <span className="text-xs text-gray-400 mt-1">Recommended size: 1200x630px (JPG/WEBP)</span>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Previews & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SEO Health Analysis */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className={`p-4 border-b flex justify-between items-center ${scoreColor}`}>
               <h3 className="font-bold text-sm uppercase tracking-wider">SEO Score</h3>
               <span className="px-3 py-1 bg-white/50 rounded-full font-bold text-sm shadow-sm">{scoreText}</span>
             </div>
             <div className="p-5 space-y-3">
               <div className="flex items-center gap-3">
                 {isTitleGood ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                 <span className={`text-sm ${isTitleGood ? 'text-gray-700' : 'text-amber-700 font-medium'}`}>Meta Title length is {isTitleGood ? 'optimal' : 'not optimal'}</span>
               </div>
               <div className="flex items-center gap-3">
                 {isDescGood ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                 <span className={`text-sm ${isDescGood ? 'text-gray-700' : 'text-amber-700 font-medium'}`}>Meta Description length is {isDescGood ? 'optimal' : 'not optimal'}</span>
               </div>
               <div className="flex items-center gap-3">
                 {isKeywordsGood ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                 <span className={`text-sm ${isKeywordsGood ? 'text-gray-700' : 'text-amber-700 font-medium'}`}>Focus keywords ({keywords.length})</span>
               </div>
               <div className="flex items-center gap-3">
                 {isSlugGood ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                 <span className={`text-sm ${isSlugGood ? 'text-gray-700' : 'text-amber-700 font-medium'}`}>URL slug format is {isSlugGood ? 'valid' : 'invalid'}</span>
               </div>
             </div>
          </div>

          {/* Google Search Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-text-main text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-500"/> Google Preview
              </h3>
              <div className="flex bg-gray-200 p-1 rounded-lg">
                <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}><Monitor className="w-3.5 h-3.5"/></button>
                <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}><Smartphone className="w-3.5 h-3.5"/></button>
              </div>
            </div>

            <div className={`p-5 ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto border-x border-b border-gray-200 bg-gray-50 rounded-b-3xl pb-8' : ''}`}>
              <div className="font-sans">
                {/* Mobile specific styling elements */}
                {previewMode === 'mobile' && (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">SR</div>
                    <div>
                      <p className="text-xs text-gray-900 leading-tight">Dr. Sam Reefath Academy</p>
                      <p className="text-[11px] text-gray-600 leading-tight">https://reefathradiology.com › {slug.split('/')[0]}</p>
                    </div>
                  </div>
                )}

                {/* Desktop specific styling elements */}
                {previewMode === 'desktop' && (
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm text-gray-900">Dr. Sam Reefath Academy</span>
                     <span className="text-sm text-gray-500">› {slug.replace(/\//g, ' › ')}</span>
                  </div>
                )}

                <h3 className={`text-[#1a0dab] group-hover:underline cursor-pointer truncate ${previewMode === 'mobile' ? 'text-lg leading-tight mb-1' : 'text-xl leading-normal mb-1'}`}>
                  {title || 'Please enter a Meta Title'}
                </h3>
                
                <p className={`text-[#4d5156] line-clamp-2 leading-snug ${previewMode === 'mobile' ? 'text-sm' : 'text-sm'}`}>
                  {description || 'Please enter a Meta Description. This will appear in search results.'}
                </p>
              </div>
            </div>

            {/* Social Media Preview Box (Bonus) */}
            <div className="border-t border-gray-100 p-5 bg-gray-50/50">
               <h3 className="font-bold text-text-main text-sm flex items-center gap-2 mb-3">
                 <Share2 className="w-4 h-4 text-purple-500"/> Social Media (Open Graph)
               </h3>
               <div className="max-w-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="p-3 bg-gray-100 border-t border-gray-200">
                     <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">REEFATHRADIOLOGY.COM</p>
                     <p className="font-bold text-gray-900 text-sm truncate leading-tight">{title}</p>
                     <p className="text-gray-600 text-xs truncate mt-0.5">{description}</p>
                  </div>
               </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
