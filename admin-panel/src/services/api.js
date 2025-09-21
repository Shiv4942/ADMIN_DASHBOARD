import axios from 'axios';

// Use Render URL for production, fallback to localhost for development
const API_URL = 'https://admin-dashboard-qdgo.onrender.com/api';
// For local development, you can use:
// const API_URL = 'http://localhost:5000/api';

// Set up default config for axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Project API
const getProjects = async (search = '') => {
  const response = await api.get(`/api/projects?search=${search}`);
  return response.data;
};

const getProjectById = async (id) => {
  const response = await api.get(`/api/projects/${id}`);
  return response.data;
};

const createProject = async (projectData) => {
  const response = await api.post('/api/projects', projectData);
  return response.data;
};

const updateProject = async (id, projectData) => {
  const response = await api.put(`/api/projects/${id}`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await api.delete(`/api/projects/${id}`);
  return response.data;
};

// Task API
const getTasksByProject = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}/tasks`);
  return response.data;
};

const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/api/tasks/${id}`, taskData);
  return response.data;
};

const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/api/tasks/${id}/status`, { status });
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

export const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

export const taskService = {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};

export default api;
