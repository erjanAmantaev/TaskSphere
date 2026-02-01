import api from './api';
import type { Category, Tag } from '../types';

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/tasks/categories/');
    return response.data;
  },

  // Get single category
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get(`/tasks/categories/${id}/`);
    return response.data;
  },

  // Create category
  createCategory: async (name: string): Promise<Category> => {
    const response = await api.post('/tasks/categories/create/', { name });
    return response.data;
  },

  // Update category
  updateCategory: async (id: number, name: string): Promise<Category> => {
    const response = await api.patch(`/tasks/categories/${id}/update/`, { name });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/tasks/categories/${id}/delete/`);
  },
};

export const tagService = {
  // Get all tags
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get('/tasks/tags/');
    return response.data;
  },

  // Get single tag
  getTag: async (id: number): Promise<Tag> => {
    const response = await api.get(`/tasks/tags/${id}/`);
    return response.data;
  },

  // Create tag
  createTag: async (name: string): Promise<Tag> => {
    const response = await api.post('/tasks/tags/create/', { name });
    return response.data;
  },

  // Update tag
  updateTag: async (id: number, name: string): Promise<Tag> => {
    const response = await api.patch(`/tasks/tags/${id}/update/`, { name });
    return response.data;
  },

  // Delete tag
  deleteTag: async (id: number): Promise<void> => {
    await api.delete(`/tasks/tags/${id}/delete/`);
  },
};
