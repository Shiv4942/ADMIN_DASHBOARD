import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/health`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Workout API calls
export const workoutService = {
  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data;
    } catch (error) {
      console.error('Create workout error:', error);
      throw error;
    }
  },

  getWorkouts: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Get workouts error:', error);
      throw error;
    }
  },

  getWorkoutStats: async () => {
    try {
      const response = await api.get('/workouts/stats');
      return response.data;
    } catch (error) {
      console.error('Get workout stats error:', error);
      throw error;
    }
  },

  updateWorkout: async (id, workoutData) => {
    try {
      const response = await api.put(`/workouts/${id}`, workoutData);
      return response.data;
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    }
  },

  deleteWorkout: async (id) => {
    try {
      const response = await api.delete(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    }
  }
};

// Goal API calls
export const goalService = {
  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals', goalData);
      return response.data;
    } catch (error) {
      console.error('Create goal error:', error);
      throw error;
    }
  },

  getGoals: async (params = {}) => {
    try {
      const response = await api.get('/goals', { params });
      return response.data;
    } catch (error) {
      console.error('Get goals error:', error);
      throw error;
    }
  },

  getGoalStats: async () => {
    try {
      const response = await api.get('/goals/stats');
      return response.data;
    } catch (error) {
      console.error('Get goal stats error:', error);
      throw error;
    }
  },

  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      console.error('Update goal error:', error);
      throw error;
    }
  },

  deleteGoal: async (id) => {
    try {
      const response = await api.delete(`/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete goal error:', error);
      throw error;
    }
  }
};

// Diet Log API calls
export const dietLogService = {
  createDietLog: async (dietLogData) => {
    try {
      const response = await api.post('/diet-logs', dietLogData);
      return response.data;
    } catch (error) {
      console.error('Create diet log error:', error);
      throw error;
    }
  },

  getDietLogs: async (params = {}) => {
    try {
      const response = await api.get('/diet-logs', { params });
      return response.data;
    } catch (error) {
      console.error('Get diet logs error:', error);
      throw error;
    }
  },

  getNutritionStats: async (params = {}) => {
    try {
      const response = await api.get('/diet-logs/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get nutrition stats error:', error);
      throw error;
    }
  },

  updateDietLog: async (id, dietLogData) => {
    try {
      const response = await api.put(`/diet-logs/${id}`, dietLogData);
      return response.data;
    } catch (error) {
      console.error('Update diet log error:', error);
      throw error;
    }
  },

  deleteDietLog: async (id) => {
    try {
      const response = await api.delete(`/diet-logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete diet log error:', error);
      throw error;
    }
  }
};

// Export all services
export default {
  workout: workoutService,
  goal: goalService,
  dietLog: dietLogService
};
