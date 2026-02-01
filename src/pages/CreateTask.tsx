import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import DatePicker from '../components/DatePicker';
import Select from '../components/Select';
import { taskService } from '../services/task.service';
import { categoryService, tagService } from '../services/category-tag.service';
import type { Category, Tag, CreateTaskData } from '../types';
import { FiX, FiPlus } from 'react-icons/fi';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [reminder, setReminder] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('daily');
  const [interval, setInterval] = useState(1);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        categoryService.getCategories(),
        tagService.getTags(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load categories and tags:', error);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim() && subtasks.length < 10) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData: CreateTaskData = {
        title,
        description: description || undefined,
        priority,
        due_date: dueDate || undefined,
        reminder: reminder || undefined,
        category: categoryId ? parseInt(categoryId) : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        is_recurring: isRecurring,
        recurrence_rule: isRecurring
          ? {
              frequency,
              interval,
            }
          : undefined,
        subtasks: subtasks.map((title) => ({ title })),
      };

      await taskService.createTask(taskData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create New Task</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Task Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />

            {/* Description */}
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
            />

            {/* Priority */}
            <Select
              label="Priority"
              value={priority}
              onChange={(value) => setPriority(value as string)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'important', label: 'Important' },
                { value: 'very_important', label: 'Very Important' },
                { value: 'extremely_important', label: 'Extremely Important' },
              ]}
            />

            {/* Due Date & Reminder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={setDueDate}
                placeholder="Select due date"
                minDate={new Date().toISOString().split('T')[0]}
              />
              <DatePicker
                label="Reminder"
                value={reminder}
                onChange={setReminder}
                placeholder="Select reminder date"
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Category */}
            <Select
              label="Category"
              value={categoryId}
              onChange={(value) => setCategoryId(value as string)}
              options={[
                { value: '', label: 'No Category' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
              ]}
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                      } else {
                        setSelectedTags([...selectedTags, tag.id]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurring */}
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring Task</span>
              </label>
            </div>

            {isRecurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Select
                  label="Frequency"
                  value={frequency}
                  onChange={(value) => setFrequency(value as string)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
                <Input
                  label="Interval"
                  type="number"
                  min="1"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                />
              </div>
            )}

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtasks</label>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm dark:text-gray-200">
                      {subtask}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  />
                  <Button type="button" onClick={handleAddSubtask} variant="secondary">
                    <FiPlus size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button type="submit" variant="primary" loading={loading} className="flex-1">
                Create Task
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
