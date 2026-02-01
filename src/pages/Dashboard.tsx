import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { FiPlus, FiFilter } from 'react-icons/fi';
import { taskService } from '../services/task.service';
import type { Task } from '../types';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      
      if (filter === 'completed') {
        filters.is_completed = 'true';
      } else if (filter === 'active') {
        filters.is_completed = 'false';
      }

      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      await taskService.toggleTaskCompletion(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const filteredTasks = tasks;
  const activeTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);
  const overdueTasks = tasks.filter(t => t.is_overdue && !t.is_completed);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeTasks.length} active tasks • {completedTasks.length} completed
              {overdueTasks.length > 0 && (
                <span className="text-red-600 dark:text-red-400 font-semibold ml-2">
                  • {overdueTasks.length} overdue
                </span>
              )}
            </p>
          </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === filterOption
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
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
            <div className="text-gray-400 mb-4">
              <FiFilter size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'active'
                ? "You don't have any active tasks. Create one to get started!"
                : filter === 'completed'
                ? "You haven't completed any tasks yet."
                : "You don't have any tasks. Create your first task!"}
            </p>
            {filter === 'active' && (
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

export default Dashboard;
