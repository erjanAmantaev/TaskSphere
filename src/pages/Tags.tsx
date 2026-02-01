import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { tagService } from '../services/category-tag.service';
import type { Tag } from '../types';
import { FiPlus, FiEdit, FiTrash2, FiTag } from 'react-icons/fi';

const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
    } else {
      setEditingTag(null);
      setTagName('');
    }
    setError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTag(null);
    setTagName('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tagName.length < 3) {
      setError('Tag name must be at least 3 characters long');
      return;
    }

    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, tagName);
      } else {
        await tagService.createTag(tagName);
      }
      await loadTags();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.name?.[0] || 'Failed to save tag');
    }
  };

  const handleDelete = (id: number) => {
    setTagToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (tagToDelete === null) return;

    try {
      await tagService.deleteTag(tagToDelete);
      await loadTags();
      setDeleteModalOpen(false);
      setTagToDelete(null);
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:ml-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="px-8 py-8">
          <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="text-gray-600 mt-1">Label and filter your tasks with tags</p>
          </div>
          <Button onClick={() => handleOpenModal()} variant="primary">
            <FiPlus size={20} />
            New Tag
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : tags.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiTag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tags yet</h3>
            <p className="text-gray-600">Create your first tag using the button above</p>
          </motion.div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag, index) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${tagColors[index % tagColors.length]} px-4 py-2 rounded-full flex items-center gap-3 group`}
              >
                <FiTag size={16} />
                <span className="font-medium">#{tag.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(tag)}
                    className="hover:scale-110 transition-transform"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="hover:scale-110 transition-transform"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingTag ? 'Edit Tag' : 'Create Tag'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Input
              label="Tag Name"
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., urgent, important, review"
              required
            />
            <div className="flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                {editingTag ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Tag"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this tag? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={confirmDelete} 
                variant="primary" 
                className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                Delete
              </Button>
              <Button 
                onClick={() => setDeleteModalOpen(false)} 
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        </div>
      </div>
    </div>
  );
};

export default Tags;
