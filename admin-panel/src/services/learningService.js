import axios from 'axios';
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl('/learning');

// Create axios instance with default config
const api = axios.create({
  withCredentials: true, // Include cookies in requests if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Courses API
const getCourses = async () => {
  try {
    const response = await api.get(`${API_URL}/courses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

const getCourse = async (id) => {
  try {
    const response = await api.get(`${API_URL}/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

const createCourse = async (courseData) => {
  try {
    const response = await api.post(`${API_URL}/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`${API_URL}/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

const deleteCourse = async (id) => {
  try {
    await api.delete(`${API_URL}/courses/${id}`);
    return id; // Return the deleted course ID
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};

const getCourseStats = async () => {
  try {
    const response = await api.get(`${API_URL}/courses/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course stats:', error);
    throw error;
  }
};

// Learning Methods API
const getLearningMethods = async (params = {}) => {
  try {
    const response = await api.get(`${API_URL}/learning-methods`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching learning methods:', error);
    throw error;
  }
};

const getLearningMethod = async (id) => {
  try {
    const response = await api.get(`${API_URL}/learning-methods/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching learning method ${id}:`, error);
    throw error;
  }
};

const createLearningMethod = async (methodData) => {
  try {
    const response = await api.post(`${API_URL}/learning-methods`, methodData);
    return response.data;
  } catch (error) {
    console.error('Error creating learning method:', error);
    throw error;
  }
};

const updateLearningMethod = async (id, methodData) => {
  try {
    const response = await api.put(`${API_URL}/learning-methods/${id}`, methodData);
    return response.data;
  } catch (error) {
    console.error(`Error updating learning method ${id}:`, error);
    throw error;
  }
};

const deleteLearningMethod = async (id) => {
  try {
    await api.delete(`${API_URL}/learning-methods/${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting learning method ${id}:`, error);
    throw error;
  }
};

const getLearningMethodStats = async () => {
  try {
    const response = await api.get(`${API_URL}/learning-methods/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching learning method stats:', error);
    throw error;
  }
};

// Skills API
const getSkills = async (params = {}) => {
  try {
    const response = await api.get(`${API_URL}/skills`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

const getSkill = async (id) => {
  try {
    const response = await api.get(`${API_URL}/skills/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching skill ${id}:`, error);
    throw error;
  }
};

const createSkill = async (skillData) => {
  try {
    const response = await api.post(`${API_URL}/skills`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
};

const updateSkill = async (id, skillData) => {
  try {
    const response = await api.put(`${API_URL}/skills/${id}`, skillData);
    return response.data;
  } catch (error) {
    console.error(`Error updating skill ${id}:`, error);
    throw error;
  }
};

const deleteSkill = async (id) => {
  try {
    await api.delete(`${API_URL}/skills/${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting skill ${id}:`, error);
    throw error;
  }
};

const updateSkillPractice = async (id, confidence) => {
  try {
    const response = await api.patch(
      `${API_URL}/skills/${id}/practice`,
      { confidence }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating skill practice for skill ${id}:`, error);
    throw error;
  }
};

const getSkillStats = async () => {
  try {
    const response = await api.get(`${API_URL}/skills/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching skill stats:', error);
    throw error;
  }
};

export {
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  
  // Learning Methods
  getLearningMethods,
  getLearningMethod,
  createLearningMethod,
  updateLearningMethod,
  deleteLearningMethod,
  getLearningMethodStats,
  
  // Skills
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillPractice,
  getSkillStats
};

const learningService = {
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  
  // Learning Methods
  getLearningMethods,
  getLearningMethod,
  createLearningMethod,
  updateLearningMethod,
  deleteLearningMethod,
  getLearningMethodStats,
  
  // Skills
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillPractice,
  getSkillStats,
};

export default learningService;
