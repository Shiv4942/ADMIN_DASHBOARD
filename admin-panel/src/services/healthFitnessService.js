import axios from 'axios';

const API_URL = 'http://localhost:5000/api/health';

// Helper function to get auth header with token
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { 'x-auth-token': user.token };
  } else {
    return {};
  }
};

// Workout API calls
export const workoutService = {
  createWorkout: async (workoutData) => {
    const response = await axios.post(`${API_URL}/workouts`, workoutData, {
      headers: authHeader()
    });
    return response.data;
  },

  getWorkouts: async () => {
    const response = await axios.get(`${API_URL}/workouts`, {
      headers: authHeader()
    });
    return response.data;
  },

  getWorkoutStats: async () => {
    const response = await axios.get(`${API_URL}/workouts/stats`, {
      headers: authHeader()
    });
    return response.data;
  },

  updateWorkout: async (id, workoutData) => {
    const response = await axios.put(`${API_URL}/workouts/${id}`, workoutData, {
      headers: authHeader()
    });
    return response.data;
  },

  deleteWorkout: async (id) => {
    const response = await axios.delete(`${API_URL}/workouts/${id}`, {
      headers: authHeader()
    });
    return response.data;
  }
};

// Goal API calls
export const goalService = {
  createGoal: async (goalData) => {
    const response = await axios.post(`${API_URL}/goals`, goalData, {
      headers: authHeader()
    });
    return response.data;
  },

  getGoals: async (params = {}) => {
    const response = await axios.get(`${API_URL}/goals`, {
      params,
      headers: authHeader()
    });
    return response.data;
  },

  getGoalStats: async () => {
    const response = await axios.get(`${API_URL}/goals/stats`, {
      headers: authHeader()
    });
    return response.data;
  },

  updateGoal: async (id, goalData) => {
    const response = await axios.put(`${API_URL}/goals/${id}`, goalData, {
      headers: authHeader()
    });
    return response.data;
  },

  deleteGoal: async (id) => {
    const response = await axios.delete(`${API_URL}/goals/${id}`, {
      headers: authHeader()
    });
    return response.data;
  }
};

// Diet Log API calls
export const dietLogService = {
  createDietLog: async (dietLogData) => {
    const response = await axios.post(`${API_URL}/diet-logs`, dietLogData, {
      headers: authHeader()
    });
    return response.data;
  },

  getDietLogs: async (params = {}) => {
    const response = await axios.get(`${API_URL}/diet-logs`, {
      params,
      headers: authHeader()
    });
    return response.data;
  },

  getNutritionStats: async (params = {}) => {
    const response = await axios.get(`${API_URL}/diet-logs/stats`, {
      params,
      headers: authHeader()
    });
    return response.data;
  },

  updateDietLog: async (id, dietLogData) => {
    const response = await axios.put(`${API_URL}/diet-logs/${id}`, dietLogData, {
      headers: authHeader()
    });
    return response.data;
  },

  deleteDietLog: async (id) => {
    const response = await axios.delete(`${API_URL}/diet-logs/${id}`, {
      headers: authHeader()
    });
    return response.data;
  }
};

// Export all services
export default {
  workout: workoutService,
  goal: goalService,
  dietLog: dietLogService
};
