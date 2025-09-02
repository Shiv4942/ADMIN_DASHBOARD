// API Configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Base API URL
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Development - local backend
  : 'https://admin-dashboard-qdgo.onrender.com/api'; // Production - deployed backend

// API endpoints
export const API_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  FINANCE: `${API_BASE_URL}/finance`,
  MEDICATIONS: `${API_BASE_URL}/medications`,
  THERAPY: `${API_BASE_URL}/therapies`,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
