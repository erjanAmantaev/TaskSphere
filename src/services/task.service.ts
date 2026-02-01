import api from './api';
import type { Task, CreateTaskData, SubTask } from '../types';

export const taskService = {
  // Get all tasks
  getTasks: async (filters?: Record<string, string>): Promise<Task[]> => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/tasks/list/?${params.toString()}`);
    return response.data.results || response.data;
  },

  // Get single task
  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  // Create task
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post('/tasks/create/', data);
    return response.data;
  },

  // Update task
  updateTask: async (id: number, data: Partial<CreateTaskData>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/update/`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}/delete/`);
  },

  // Toggle task completion
  toggleTaskCompletion: async (id: number): Promise<{ message: string; karma_change: number }> => {
    const response = await api.patch(`/tasks/${id}/toggle/`);
    return response.data;
  },

  // Toggle subtask completion
  toggleSubtaskCompletion: async (id: number): Promise<SubTask> => {
    const response = await api.patch(`/tasks/subtask/${id}/toggle/`);
    return response.data;
  },

  // Get calendar tasks
  getCalendarTasks: async (start_date: string, end_date: string): Promise<Task[]> => {
    const response = await api.get('/tasks/calendar/', {
      params: { start_date, end_date },
    });
    return response.data;
  },
};
