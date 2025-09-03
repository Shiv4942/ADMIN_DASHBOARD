import axios from 'axios';

const API_URL = '/api/learning';

// Courses API
const getCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`);
  return response.data;
};

const getCourse = async (id) => {
  const response = await axios.get(`${API_URL}/courses/${id}`);
  return response.data;
};

const createCourse = async (courseData) => {
  const response = await axios.post(`${API_URL}/courses`, courseData);
  return response.data;
};

const updateCourse = async (id, courseData) => {
  const response = await axios.put(`${API_URL}/courses/${id}`, courseData);
  return response.data;
};

const deleteCourse = async (id) => {
  await axios.delete(`${API_URL}/courses/${id}`);
  return id; // Return the deleted course ID
};

const getCourseStats = async () => {
  const response = await axios.get(`${API_URL}/courses/stats`);
  return response.data;
};

// Learning Methods API
const getLearningMethods = async (params = {}) => {
  const response = await axios.get(`${API_URL}/learning-methods`, { params });
  return response.data;
};

const getLearningMethod = async (id) => {
  const response = await axios.get(`${API_URL}/learning-methods/${id}`);
  return response.data;
};

const createLearningMethod = async (methodData) => {
  const response = await axios.post(`${API_URL}/learning-methods`, methodData);
  return response.data;
};

const updateLearningMethod = async (id, methodData) => {
  const response = await axios.put(`${API_URL}/learning-methods/${id}`, methodData);
  return response.data;
};

const deleteLearningMethod = async (id) => {
  await axios.delete(`${API_URL}/learning-methods/${id}`);
  return id;
};

const getLearningMethodStats = async () => {
  const response = await axios.get(`${API_URL}/learning-methods/stats`);
  return response.data;
};

// Skills API
const getSkills = async (params = {}) => {
  const response = await axios.get(`${API_URL}/skills`, { params });
  return response.data;
};

const getSkill = async (id) => {
  const response = await axios.get(`${API_URL}/skills/${id}`);
  return response.data;
};

const createSkill = async (skillData) => {
  const response = await axios.post(`${API_URL}/skills`, skillData);
  return response.data;
};

const updateSkill = async (id, skillData) => {
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData);
  return response.data;
};

const deleteSkill = async (id) => {
  await axios.delete(`${API_URL}/skills/${id}`);
  return id;
};

const updateSkillPractice = async (id, confidence) => {
  const response = await axios.patch(
    `${API_URL}/skills/${id}/practice`,
    { confidence }
  );
  return response.data;
};

const getSkillStats = async () => {
  const response = await axios.get(`${API_URL}/skills/stats`);
  return response.data;
};

export {
  // Courses
  getCourses,
  getCourse,
  createCourse,
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
