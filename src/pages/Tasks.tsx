import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { taskService } from '../services/task.service';
import { categoryService } from '../services/category-tag.service';
import type { Task, Category } from '../types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedPriority, showCompleted, showOverdue]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedPriority) filters.priority = selectedPriority;
      if (!showCompleted) filters.is_completed = 'false';
      if (showOverdue) filters.is_overdue = 'true';

      const [tasksData, categoriesData] = await Promise.all([
        taskService.getTasks(filters),
        categoryService.getCategories(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      await taskService.toggleTaskCompletion(taskId);
      await loadData();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">All Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{filteredTasks.length} tasks</p>
          </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="important">Important</option>
              <option value="very_important">Very Important</option>
              <option value="extremely_important">Extremely Important</option>
            </select>

            {/* Show Completed */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Completed</span>
            </label>
          </div>
          
          {/* Overdue Filter */}
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOverdue}
                onChange={(e) => setShowOverdue(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Show Overdue Only</span>
            </label>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || selectedPriority
                ? 'Try adjusting your filters'
                : "You don't have any tasks. Create one to get started!"}
            </p>
            {!searchTerm && !selectedCategory && !selectedPriority && (
              <Button onClick={() => navigate('/tasks/create')} variant="primary" className="flex items-center gap-2">
                <FiPlus size={20} />
                New Task
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => navigate(`/tasks/${task.id}`)}
                onToggleComplete={() => handleToggleComplete(task.id)}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
