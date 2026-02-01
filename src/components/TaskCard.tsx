import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import { FiCalendar, FiTag, FiCheckCircle, FiCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onToggleComplete?: () => void;
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

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onToggleComplete }) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`card card-hover cursor-pointer ${
        task.is_completed 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : task.is_overdue
          ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10'
          : ''
      }`}
      onClick={onClick}
    >
      {/* Overdue Badge */}
      {task.is_overdue && !task.is_completed && (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-semibold">
            <FiAlertCircle size={14} />
            <span>Overdue</span>
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className="mt-1 flex-shrink-0 focus:outline-none"
        >
          {task.is_completed ? (
            <FiCheckCircle className="text-primary-600" size={24} />
          ) : (
            <FiCircle className="text-gray-400 hover:text-primary-600 transition-colors" size={24} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className={`text-lg font-semibold ${
              task.is_completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p 
              className={`mt-1 text-sm ${
                task.is_completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div 
            className={`mt-3 flex flex-wrap items-center gap-3 text-sm ${
              task.is_completed ? 'text-gray-500' : ''
            }`}
          >
            {/* Priority */}
            <span className={`px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>

            {/* Due date */}
            {task.due_date && (
              <div className={`flex items-center gap-1 ${
                task.is_overdue && !task.is_completed
                  ? 'text-red-600 dark:text-red-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                <FiCalendar size={16} />
                <span>{format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
              </div>
            )}

            {/* Category */}
            {task.category && (
              <div className="flex items-center gap-1 text-gray-600">
                <FiTag size={16} />
                <span>{task.category.name}</span>
              </div>
            )}

            {/* Recurring indicator */}
            {task.is_recurring && (
              <div className="flex items-center gap-1 text-primary-600">
                <FiClock size={16} />
                <span>Recurring</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks progress */}
          {task.subtasks_completion_percentage !== undefined && task.subtasks_completion_percentage > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Subtasks</span>
                <span>{task.subtasks_completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.subtasks_completion_percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
