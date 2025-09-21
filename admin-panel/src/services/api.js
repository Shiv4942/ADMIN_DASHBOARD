import axios from 'axios';

const API_URL = 'https://admin-dashboard-qdgo.onrender.com/api' | 'http://localhost:5000/api';

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
  const response = await api.get(`/projects?search=${search}`);
  return response.data;
};

const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// Task API
const getTasksByProject = async (projectId) => {
  const response = await api.get(`/tasks/project/${projectId}`);
  return response.data;
};

const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

const updateTaskStatus = async (id, status) => {
  const response = await api.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
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
