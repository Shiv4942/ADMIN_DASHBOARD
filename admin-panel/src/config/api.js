// API Configuration - using the deployed backend on Render
export const API_BASE_URL = 'https://admin-dashboard-qdgo.onrender.com/api';

// API endpoints
export const API_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  FINANCE: `${API_BASE_URL}/finance`,
  MEDICATIONS: `${API_BASE_URL}/medications`,
  THERAPY: `${API_BASE_URL}/therapies`,
  ACTIVITIES: `${API_BASE_URL}/activities`,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
