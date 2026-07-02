import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Clock, FileText, Plus, GripVertical, Edit2, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function CourseCurriculum() {
  const { course } = useOutletContext();
  const [expandedModules, setExpandedModules] = useState([]);

  useEffect(() => {
    if (course?.modules?.length > 0) {
      setExpandedModules([course.modules[0]._id]);
    }
  }, [course]);

  const toggleModule = (id) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F4D]">Course Curriculum</h2>
          <p className="text-sm text-[#60738A] mt-1">Manage modules, lessons, and content structure.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0B1F4D] hover:bg-[#15347B] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
          <Plus className="w-5 h-5 text-[#C89B3C]" /> Add Module
        </button>
      </div>

      <div className="space-y-4">
        {course?.modules?.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl border border-gray-200 shadow-sm text-gray-500 font-medium">
            No modules added yet.
          </div>
        ) : course?.modules?.map((module, index) => (
          <div key={module._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Module Header */}
            <div 
              className="flex items-center justify-between p-5 bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleModule(module._id)}
            >
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <div>
                  <h3 className="font-bold text-[#0B1F4D]">{module.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#60738A] mt-1">
                    <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> {module.lessons?.length || 0} Lessons</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sm font-semibold text-[#C89B3C] hover:text-[#0B1F4D] hidden sm:block">Edit Module</button>
                {expandedModules.includes(module._id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* Lessons List */}
            {expandedModules.includes(module._id) && (
              <div className="border-t border-gray-200 divide-y divide-gray-100">
                {module.lessons?.length === 0 ? (
                  <p className="p-4 pl-12 text-gray-500 text-sm">No lessons found.</p>
                ) : module.lessons?.map((lesson, lIndex) => (
                  <div key={lesson._id} className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      {lesson.type === 'video' ? (
                        <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <PlayCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A] group-hover:text-[#0B1F4D] transition-colors">{lesson.title}</p>
                        <p className="text-xs text-[#60738A] mt-0.5">{lesson.duration}</p>
                      </div>
                    </div>
                    
                      <div className="flex items-center gap-6">
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md hidden sm:inline-block">Published</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded bg-white border border-gray-200 hover:border-blue-200 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 hover:border-red-200 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add Lesson Button */}
                <div className="p-4 pl-12 bg-gray-50/30">
                  <button className="flex items-center gap-2 text-sm font-semibold text-[#C89B3C] hover:text-[#0B1F4D] transition-colors">
                    <Plus className="w-4 h-4" /> Add Lesson
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
