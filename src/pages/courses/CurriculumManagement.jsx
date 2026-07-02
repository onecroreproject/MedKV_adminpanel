import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, Video, Download, Edit, Trash2, ChevronDown, ChevronRight, PlayCircle, X, Upload } from 'lucide-react';
import Badge from '../../components/common/Badge';
import { 
  getCourseById, addCourseModule, addLesson, 
  updateCourseModule, deleteCourseModule, reorderCourseModules,
  updateLesson, deleteLesson, reorderLessons,
  addLessonResource, deleteLessonResource
} from '../../services/courseService';

import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';

// --- Sortable Lesson Component ---
function SortableLesson({ lesson, moduleIndex, lessonIndex, onEdit, onDelete, onAddResource, onDeleteResource, onPreview }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const prefixedTitle = `Lesson ${moduleIndex + 1}.${lessonIndex + 1}: ${lesson.title}`;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-brand-primary/30 hover:bg-gray-50 transition-colors group bg-white z-10 relative">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-500">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
          <Video className="w-4 h-4" />
        </div>
        <div>
          <span className="font-medium text-sm text-text-main">{prefixedTitle}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 rounded uppercase">{lesson.duration || '00:00'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => onAddResource(lesson._id)} className="p-1.5 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded" title="Attach Resource">
          <Upload className="w-4 h-4" />
        </button>
        <button onClick={() => {
          if (!lesson.videoUrl) return;
          let url = lesson.videoUrl.replace(/\\/g, '/');
          if (url.startsWith('uploads/')) url = '/' + url;
          onPreview(url.startsWith('/uploads') ? `${baseUrl}${url}` : url);
        }} className="p-1.5 text-brand-primary hover:bg-brand-primary/10 rounded-lg flex items-center gap-1 text-xs font-medium">
          <PlayCircle className="w-4 h-4" /> Preview
        </button>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button onClick={() => onEdit(lesson)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(lesson._id)} className="p-1.5 text-status-error hover:bg-red-100 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="w-full mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Resources</p>
          <div className="flex flex-wrap gap-2">
            {lesson.resources.map(res => (
              <div key={res._id} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                <a href={`${baseUrl}${res.fileUrl}`} target="_blank" rel="noreferrer" className="text-xs font-medium text-text-main hover:text-brand-primary truncate max-w-[150px]">
                  {res.title}
                </a>
                <button onClick={() => onDeleteResource(lesson._id, res._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sortable Module Component ---
function SortableModule({ 
  mod, moduleIndex, expanded, toggleModule, onEdit, onDelete, onAddLesson, 
  onLessonEdit, onLessonDelete, handleLessonDragEnd, onAddResource, onDeleteResource, onPreview
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: mod._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const prefixedTitle = `Module ${moduleIndex + 1}: ${mod.title}`;

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden z-20 relative">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 group">
        <div className="flex items-center gap-3 flex-1">
          <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical className="w-5 h-5" />
          </button>
          <button 
            onClick={() => toggleModule(mod._id)}
            className="flex items-center gap-2 font-bold text-text-main text-lg hover:text-brand-primary transition-colors"
          >
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            {prefixedTitle}
          </button>
          <Badge status="success" className="ml-2">Published</Badge>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(mod)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(mod._id)} className="p-1.5 text-status-error hover:bg-red-100 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 bg-white space-y-2">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleLessonDragEnd(e, mod._id)}
          >
            <SortableContext items={(mod.lessons || []).map(l => l._id)} strategy={verticalListSortingStrategy}>
              {mod.lessons?.map((lesson, lessonIndex) => (
                <SortableLesson 
                  key={lesson._id} 
                  lesson={lesson} 
                  moduleIndex={moduleIndex} 
                  lessonIndex={lessonIndex}
                  onEdit={onLessonEdit}
                  onDelete={onLessonDelete}
                  onAddResource={onAddResource}
                  onDeleteResource={onDeleteResource}
                  onPreview={onPreview}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          <button onClick={() => onAddLesson(mod._id)} className="w-full flex items-center justify-center gap-2 p-3 mt-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-colors">
            <Plus className="w-4 h-4" /> Add Lesson
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Curriculum Management Component ---
export default function CurriculumManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', duration: '', videoUrl: '', file: null, isLocal: false });
  const fileInputRef = useRef(null);
  // Resource Modal State
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [activeResourceLessonId, setActiveResourceLessonId] = useState(null);
  const [resourceForm, setResourceForm] = useState({ title: '', file: null });
  const resourceInputRef = useRef(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const response = await getCourseById(id);
      setCourse(response.data);
      const expanded = {};
      response.data.modules?.forEach(m => { expanded[m._id] = true; });
      setExpandedModules(prev => Object.keys(prev).length ? prev : expanded); // Keep expanded state if re-fetching
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalDuration = () => {
    if (!course?.modules) return '0h 0m';
    let totalSeconds = 0;
    course.modules.forEach(module => {
      module.lessons?.forEach(lesson => {
        if (lesson.duration) {
          const parts = lesson.duration.split(':').map(Number);
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
             totalSeconds += parts[0] * 60 + parts[1];
          } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
             totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
          }
        }
      });
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // --- Module Actions ---
  const handleAddModule = async () => {
    const title = window.prompt("Enter new module title (e.g., 'Introduction'):");
    if (!title) return;
    try {
      await addCourseModule(id, { title, description: '', order: (course.modules?.length || 0) + 1 });
      fetchCourseData();
    } catch (err) {
      alert("Failed to add module");
    }
  };

  const handleEditModule = async (mod) => {
    const newTitle = window.prompt("Edit module title:", mod.title);
    if (!newTitle || newTitle === mod.title) return;
    try {
      await updateCourseModule(mod._id, { title: newTitle });
      fetchCourseData();
    } catch (err) {
      alert("Failed to update module");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module and all its lessons?")) return;
    try {
      await deleteCourseModule(moduleId);
      fetchCourseData();
    } catch (err) {
      alert("Failed to delete module");
    }
  };

  const handleModuleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = course.modules.findIndex(m => m._id === active.id);
      const newIndex = course.modules.findIndex(m => m._id === over.id);
      const newModules = arrayMove(course.modules, oldIndex, newIndex);
      
      // Update local state instantly
      setCourse(prev => ({ ...prev, modules: newModules }));

      // Prepare bulk update payload
      const items = newModules.map((m, idx) => ({ id: m._id, order: idx + 1 }));
      try {
        await reorderCourseModules(id, items);
      } catch (err) {
        alert("Failed to reorder modules in database.");
        fetchCourseData(); // revert
      }
    }
  };

  // --- Lesson Actions ---
  const openLessonModal = (moduleId, lessonToEdit = null) => {
    setActiveModuleId(moduleId);
    if (lessonToEdit) {
      setEditingLessonId(lessonToEdit._id);
      setLessonForm({ 
        title: lessonToEdit.title, 
        duration: lessonToEdit.duration || '', 
        videoUrl: lessonToEdit.videoUrl || '', 
        file: null, 
        isLocal: false 
      });
    } else {
      setEditingLessonId(null);
      setLessonForm({ title: '', duration: '', videoUrl: '', file: null, isLocal: false });
    }
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await deleteLesson(lessonId);
      fetchCourseData();
    } catch (err) {
      alert("Failed to delete lesson");
    }
  };

  const handleLessonDragEnd = async (event, moduleId) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const modIndex = course.modules.findIndex(m => m._id === moduleId);
      const mod = course.modules[modIndex];
      const oldIndex = mod.lessons.findIndex(l => l._id === active.id);
      const newIndex = mod.lessons.findIndex(l => l._id === over.id);
      const newLessons = arrayMove(mod.lessons, oldIndex, newIndex);

      // Update local state instantly
      const newModules = [...course.modules];
      newModules[modIndex] = { ...mod, lessons: newLessons };
      setCourse(prev => ({ ...prev, modules: newModules }));

      // Prepare bulk update payload
      const items = newLessons.map((l, idx) => ({ id: l._id, order: idx + 1 }));
      try {
        await reorderLessons(moduleId, items);
      } catch (err) {
        alert("Failed to reorder lessons in database.");
        fetchCourseData(); // revert
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setLessonForm(prev => ({...prev, file, duration: formattedDuration}));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setLessonForm(prev => ({...prev, videoUrl: url}));

    if (url && url.startsWith('http')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setLessonForm(prev => ({...prev, duration: formattedDuration, videoUrl: url}));
      };
      video.onerror = () => { /* Silently fail */ };
      video.src = url;
    }
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title || (!lessonForm.videoUrl && !lessonForm.file)) {
      return alert('Please provide title and video.');
    }

    try {
      let payload;
      if (lessonForm.isLocal) {
        payload = new FormData();
        payload.append('title', lessonForm.title);
        payload.append('duration', lessonForm.duration);
        payload.append('courseName', course.title);
        if (lessonForm.file) payload.append('videoFile', lessonForm.file);
      } else {
        payload = {
          title: lessonForm.title,
          videoUrl: lessonForm.videoUrl,
          duration: lessonForm.duration,
        };
      }

      if (editingLessonId) {
        await updateLesson(editingLessonId, payload);
      } else {
        if (lessonForm.isLocal) payload.append('order', (course.modules.find(m => m._id === activeModuleId)?.lessons?.length || 0) + 1);
        else payload.order = (course.modules.find(m => m._id === activeModuleId)?.lessons?.length || 0) + 1;
        await addLesson(activeModuleId, payload);
      }
      
      setIsLessonModalOpen(false);
      fetchCourseData();
    } catch (err) {
      alert("Failed to save lesson: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({...prev, [id]: !prev[id]}));
  };

  // --- Resource Actions ---
  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    if (!resourceForm.file) return alert('Please select a file.');
    
    try {
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('resourceFile', resourceForm.file);
      
      await addLessonResource(activeResourceLessonId, formData);
      setIsResourceModalOpen(false);
      setResourceForm({ title: '', file: null });
      fetchCourseData();
    } catch (err) {
      alert("Failed to add resource: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteResource = async (lessonId, resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteLessonResource(lessonId, resourceId);
      fetchCourseData();
    } catch (err) {
      alert("Failed to delete resource");
    }
  };

  const totalResources = course?.modules?.reduce((acc, mod) => {
    return acc + (mod.lessons?.reduce((lessAcc, lesson) => lessAcc + (lesson.resources?.length || 0), 0) || 0);
  }, 0) || 0;

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/courses/${id}`)}
              className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Curriculum Management</h1>
              <p className="text-sm text-text-muted mt-1">{course ? course.title : 'Loading...'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-text-main rounded-lg text-sm font-medium hover:bg-gray-50">
              <Download className="w-4 h-4" /> Import Curriculum
            </button>
            <button onClick={handleAddModule} className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/30">
              <Plus className="w-4 h-4 text-brand-accent" /> Create Module
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-brand-primary">{course?.modules?.length || 0}</p>
            <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Total Modules</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {course?.modules?.reduce((acc, curr) => acc + (curr.lessons?.length || 0), 0) || 0}
            </p>
            <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Total Lessons</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-amber-600">{calculateTotalDuration()}</p>
            <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Video Duration</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">{totalResources}</p>
            <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Resources</p>
          </div>
        </div>

        {/* Curriculum Builder */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div></div>
          ) : !course?.modules?.length ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
              No modules added yet. Click "Create Module" to start building your curriculum.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleModuleDragEnd}>
              <SortableContext items={course.modules.map(m => m._id)} strategy={verticalListSortingStrategy}>
                {course.modules.map((mod, index) => (
                  <SortableModule 
                    key={mod._id} 
                    mod={mod} 
                    moduleIndex={index} 
                    expanded={expandedModules[mod._id]} 
                    toggleModule={toggleModule}
                    onEdit={handleEditModule}
                    onDelete={handleDeleteModule}
                    onAddLesson={openLessonModal}
                    onLessonEdit={(lesson) => openLessonModal(mod._id, lesson)}
                    onLessonDelete={handleDeleteLesson}
                    handleLessonDragEnd={handleLessonDragEnd}
                    onAddResource={(lessonId) => { setActiveResourceLessonId(lessonId); setIsResourceModalOpen(true); }}
                    onDeleteResource={handleDeleteResource}
                    onPreview={(url) => setPreviewVideoUrl(url)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Add/Edit Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-text-main">{editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}</h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleLessonSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Lesson Title (e.g. 'Basics')</label>
                <input 
                  type="text" 
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
                  placeholder="e.g. Introduction to Radiology"
                  required
                />
              </div>
              
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={!lessonForm.isLocal} 
                    onChange={() => setLessonForm({...lessonForm, isLocal: false})}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium">Video URL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={lessonForm.isLocal} 
                    onChange={() => setLessonForm({...lessonForm, isLocal: true})}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium">Upload File</span>
                </label>
              </div>

              {!lessonForm.isLocal ? (
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Video URL</label>
                  <input 
                    type="url" 
                    value={lessonForm.videoUrl}
                    onChange={handleUrlChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
                    placeholder="https://youtube.com/..."
                    required={!lessonForm.isLocal}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Upload Video</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium text-center px-4">
                      {lessonForm.file ? lessonForm.file.name : editingLessonId ? 'Upload new file to replace' : 'Click to Upload Video'}
                    </span>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/*"
                      className="hidden" 
                    />
                  </div>
                </div>
              )}

              {!lessonForm.isLocal && (
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Duration</label>
                  <input 
                    type="text" 
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({...lessonForm, duration: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
                    placeholder="e.g. 45:00"
                  />
                </div>
              )}

              {lessonForm.isLocal && lessonForm.file && (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <PlayCircle className="w-4 h-4 text-brand-primary" />
                  <span>Detected Duration: <strong className="text-text-main">{lessonForm.duration}</strong></span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
                >
                  {editingLessonId ? 'Save Changes' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Resource Modal */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-text-main">Attach Resource</h3>
              <button onClick={() => setIsResourceModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleResourceSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Resource Title (Optional)</label>
                <input 
                  type="text" 
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20" 
                  placeholder="e.g. Presentation Slides"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Upload File</label>
                <div 
                  onClick={() => resourceInputRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-brand-primary cursor-pointer transition-colors"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-center px-4">
                    {resourceForm.file ? resourceForm.file.name : 'Click to Select Document (PDF, ZIP, etc.)'}
                  </span>
                  <input 
                    type="file" 
                    ref={resourceInputRef}
                    onChange={(e) => setResourceForm({...resourceForm, file: e.target.files[0]})}
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideoUrl && createPortal(
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 99999 }}>
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setPreviewVideoUrl(null)}
          ></div>
          <div className="bg-[#111827] rounded-xl w-full max-w-5xl shadow-2xl overflow-hidden relative border border-gray-800 z-10 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1f2937]">
              <h3 className="text-white font-medium flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-brand-primary" />
                Video Preview
              </h3>
              <button 
                onClick={() => setPreviewVideoUrl(null)} 
                className="text-gray-400 hover:text-white transition-colors p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full bg-black aspect-video flex items-center justify-center relative">
              {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                <iframe 
                  src={previewVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                  className="w-full h-full border-0" 
                  allowFullScreen
                  title="Video Preview"
                ></iframe>
              ) : (
                <video 
                  src={previewVideoUrl} 
                  controls 
                  autoPlay 
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
