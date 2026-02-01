import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { taskService } from '../services/task.service';
import type { Task } from '../types';
import { FiCalendar, FiTag, FiClock, FiTrash2, FiEdit, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadTask(parseInt(id));
    }
  }, [id]);

  const loadTask = async (taskId: number) => {
    setLoading(true);
    try {
      const data = await taskService.getTask(taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to load task:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;
    try {
      await taskService.toggleTaskCompletion(task.id);
      await loadTask(task.id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await taskService.deleteTask(task.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    important: 'bg-orange-100 text-orange-800 border-orange-200',
    very_important: 'bg-red-100 text-red-800 border-red-200',
    extremely_important: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    important: 'Important',
    very_important: 'Very Important',
    extremely_important: 'Extremely Important',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700"
          >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <button onClick={handleToggleComplete} className="mt-1 flex-shrink-0">
                {task.is_completed ? (
                  <FiCheckCircle className="text-primary-600 dark:text-primary-400" size={32} />
                ) : (
                  <FiCircle className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" size={32} />
                )}
              </button>
              <div className="flex-1">
                <h1 className={`text-3xl font-bold ${task.is_completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {task.title}
                </h1>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/tasks/${task.id}/edit`)}
                variant="secondary"
                size="sm"
              >
                <FiEdit size={18} />
              </Button>
              <Button
                onClick={() => setDeleteModalOpen(true)}
                variant="danger"
                size="sm"
              >
                <FiTrash2 size={18} />
              </Button>
            </div>
          </div>

          {/* Priority Badge */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1.5 rounded-md border text-sm font-medium ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h2>
              <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {task.due_date && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiCalendar className="text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Due Date</div>
                  <div className="font-medium">{format(new Date(task.due_date), 'PPP p')}</div>
                </div>
              </div>
            )}

            {task.reminder && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiClock className="text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Reminder</div>
                  <div className="font-medium">{format(new Date(task.reminder), 'PPP p')}</div>
                </div>
              </div>
            )}

            {task.category && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiTag className="text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Category</div>
                  <div className="font-medium">{task.category.name}</div>
                </div>
              </div>
            )}

            {task.is_recurring && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FiClock className="text-gray-400 dark:text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Recurring</div>
                  <div className="font-medium">
                    {task.recurrence_rule && `${task.recurrence_rule.frequency} (every ${task.recurrence_rule.interval})`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>Created: {format(new Date(task.created_at), 'PPP p')}</p>
            <p>Last updated: {format(new Date(task.updated_at), 'PPP p')}</p>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="mt-6">
          <Button onClick={() => navigate('/dashboard')} variant="secondary">
            Back to Dashboard
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleDelete} variant="danger" className="flex-1">
                Delete
              </Button>
              <Button onClick={() => setDeleteModalOpen(false)} variant="secondary" className="flex-1">
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

export default TaskDetail;
