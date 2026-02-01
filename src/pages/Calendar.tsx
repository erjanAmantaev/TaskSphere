import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { taskService } from '../services/task.service';
import type { Task } from '../types';
import { FiChevronLeft, FiChevronRight, FiClock, FiCheckCircle } from 'react-icons/fi';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ is_completed: 'false' });
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = task.due_date.split('T')[0];
      return taskDate === dateStr;
    });
  };

  const getDayTasks = () => {
    if (!selectedDate) return [];
    const day = selectedDate.getDate();
    return getTasksForDay(day);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'important': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'very_important': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'extremely_important': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg" />
      );
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
      const dayTasks = getTasksForDay(day);
      const today = isToday(day);
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedDate(date)}
          className={`
            min-h-[100px] border rounded-lg p-2 cursor-pointer transition-all
            ${
              today 
                ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
            }
            ${isSelected ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}
            hover:shadow-md
          `}
        >
          <div className={`
            text-sm font-semibold mb-1
            ${today ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}
          `}>
            {day}
          </div>
          
          {dayTasks.length > 0 && (
            <div className="flex items-center justify-center mt-2">
              <div className={`
                text-xs font-semibold px-2 py-1 rounded-full
                ${
                  today 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                }
              `}>
                {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        
        <div className="flex-1 ml-64">
          <Navbar />
          
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <Navbar />

        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View your tasks by date</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* Selected Day Tasks */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                {selectedDate ? (
                  <>
                    Tasks for {selectedDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </>
                ) : (
                  'Select a date'
                )}
              </h3>

              {selectedDate ? (
                <div className="space-y-3">
                  {getDayTasks().length === 0 ? (
                    <div className="text-center py-8">
                      <FiCheckCircle className="mx-auto text-gray-300 mb-2" size={48} />
                      <p className="text-gray-500">No tasks scheduled</p>
                    </div>
                  ) : (
                    getDayTasks().map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <FiClock size={14} className="text-gray-400" />
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                            {task.priority.replace('_', ' ')}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Click on a date to see tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
