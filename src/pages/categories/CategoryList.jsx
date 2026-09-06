import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [portalsReady, setPortalsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  
  useEffect(() => {
    setPortalsReady(true);
    return () => setPortalsReady(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await createCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div className="space-y-6">

      {portalsReady && document.getElementById('topbar-title-portal') && createPortal(
        <span>Categories</span>,
        document.getElementById('topbar-title-portal')
      )}


      {portalsReady && document.getElementById('topbar-actions-portal') && createPortal(
        <>
          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..." 
              className="w-full pl-10 pr-4 py-2 bg-bg-sidebar border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors shrink-0">
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </>,
        document.getElementById('topbar-actions-portal')
      )}

      

      <div className="bg-bg-sidebar rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-muted">
            <thead className="text-xs uppercase bg-gray-800/50 text-white">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.filter(cat => 
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map((cat) => (
                <tr key={cat._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-6 py-4 font-medium text-white">{cat.name}</td>
                  <td className="px-6 py-4">{cat.slug}</td>
                  <td className="px-6 py-4">{cat.description}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => handleDelete(cat._id)} className="text-status-error hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.filter(cat => 
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">No categories found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-bg-sidebar p-6 rounded-xl border border-gray-800 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-bg-main border border-gray-800 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g. Pathology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1.5">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full bg-bg-main border border-gray-800 rounded-lg px-4 py-2 text-white"
                  placeholder="Short description..."
                  rows="3"
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition-colors">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
