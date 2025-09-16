import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ChartBarIcon, BookOpenIcon, AcademicCapIcon, LightBulbIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Error handling utilities
class AppError extends Error {
  constructor(message, type = 'GENERAL', statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION: 'PERMISSION',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER: 'SERVER',
  GENERAL: 'GENERAL'
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested item could not be found.',
  [ERROR_TYPES.PERMISSION]: 'You don\'t have permission to perform this action.',
  [ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.GENERAL]: 'Something went wrong. Please try again.'
};

const parseError = (error) => {
  // Network errors
  if (!navigator.onLine) {
    return new AppError(ERROR_MESSAGES[ERROR_TYPES.NETWORK], ERROR_TYPES.NETWORK, 0);
  }
  
  // API errors with response
  if (error.response) {
    const { status, data } = error.response;
    let errorType = ERROR_TYPES.SERVER;
    let message = data?.message || ERROR_MESSAGES[ERROR_TYPES.SERVER];
    
    switch (status) {
      case 400:
        errorType = ERROR_TYPES.VALIDATION;
        message = data?.message || ERROR_MESSAGES[ERROR_TYPES.VALIDATION];
        break;
      case 404:
        errorType = ERROR_TYPES.NOT_FOUND;
        message = ERROR_MESSAGES[ERROR_TYPES.NOT_FOUND];
        break;
      case 403:
        errorType = ERROR_TYPES.PERMISSION;
        message = ERROR_MESSAGES[ERROR_TYPES.PERMISSION];
        break;
      case 429:
        errorType = ERROR_TYPES.RATE_LIMIT;
        message = ERROR_MESSAGES[ERROR_TYPES.RATE_LIMIT];
        break;
      case 500:
      default:
        errorType = ERROR_TYPES.SERVER;
        break;
    }
    
    return new AppError(message, errorType, status, data?.details);
  }
  
  // Network timeout or connection refused
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return new AppError(ERROR_MESSAGES[ERROR_TYPES.NETWORK], ERROR_TYPES.NETWORK, 0);
  }
  
  // Default error
  return new AppError(
    error.message || ERROR_MESSAGES[ERROR_TYPES.GENERAL], 
    ERROR_TYPES.GENERAL, 
    500
  );
};

// Helper functions for localStorage
const storage = {
  get: (key, defaultValue = []) => {
    try {
      const item = localStorage.getItem(`learning_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`learning_${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  }
};

// Mock learning service with localStorage persistence
const mockLearningService = {
  // Simulate network delay
  delay: () => new Promise(resolve => setTimeout(resolve, 300)),
  
  // Courses
  getCourses: async () => {
    await mockLearningService.delay();
    return storage.get('courses', [
      { _id: '1', title: 'React Fundamentals', status: 'active', progress: 75 },
      { _id: '2', title: 'JavaScript Advanced', status: 'completed', progress: 100 }
    ]);
  },
  
  createCourse: async (data) => {
    const courses = await mockLearningService.getCourses();
    const newCourse = {
      _id: Date.now().toString(),
      title: data.title || 'New Course',
      status: data.status || 'active',
      progress: data.progress || 0,
      ...data
    };
    courses.push(newCourse);
    storage.set('courses', courses);
    return newCourse;
  },
  
  updateCourse: async (id, data) => {
    const courses = await mockLearningService.getCourses();
    const index = courses.findIndex(c => c._id === id);
    if (index === -1) throw new Error('Course not found');
    const updatedCourse = { ...courses[index], ...data, _id: id };
    courses[index] = updatedCourse;
    storage.set('courses', courses);
    return updatedCourse;
  },
  
  deleteCourse: async (id) => {
    const courses = await mockLearningService.getCourses();
    const filtered = courses.filter(c => c._id !== id);
    storage.set('courses', filtered);
    return { success: true };
  },
  
  // Learning Methods
  getLearningMethods: async () => {
    await mockLearningService.delay();
    return storage.get('methods', [
      { _id: '1', name: 'Video Learning', duration: 120, effectiveness: 8 },
      { _id: '2', name: 'Hands-on Practice', duration: 180, effectiveness: 9 }
    ]);
  },
  
  createLearningMethod: async (data) => {
    const methods = await mockLearningService.getLearningMethods();
    const newMethod = {
      _id: Date.now().toString(),
      name: data.name || 'New Learning Method',
      duration: data.duration || 0,
      effectiveness: data.effectiveness || 5,
      ...data
    };
    methods.push(newMethod);
    storage.set('methods', methods);
    return newMethod;
  },
  
  updateLearningMethod: async (id, data) => {
    const methods = await mockLearningService.getLearningMethods();
    const index = methods.findIndex(m => m._id === id);
    if (index === -1) throw new Error('Method not found');
    const updatedMethod = { ...methods[index], ...data, _id: id };
    methods[index] = updatedMethod;
    storage.set('methods', methods);
    return updatedMethod;
  },
  
  deleteLearningMethod: async (id) => {
    const methods = await mockLearningService.getLearningMethods();
    const filtered = methods.filter(m => m._id !== id);
    storage.set('methods', filtered);
    return { success: true };
  },
  
  // Skills
  getSkills: async () => {
    await mockLearningService.delay();
    return storage.get('skills', [
      { _id: '1', name: 'React', confidence: 7, lastPracticed: '2025-01-01' },
      { _id: '2', name: 'Node.js', confidence: 6, lastPracticed: '2025-01-02' }
    ]);
  },
  
  createSkill: async (data) => {
    const skills = await mockLearningService.getSkills();
    const newSkill = {
      _id: Date.now().toString(),
      name: data.name || 'New Skill',
      confidence: data.confidence || 5,
      lastPracticed: data.lastPracticed || new Date().toISOString().split('T')[0],
      ...data
    };
    skills.push(newSkill);
    storage.set('skills', skills);
    return newSkill;
  },
  
  updateSkill: async (id, data) => {
    const skills = await mockLearningService.getSkills();
    const index = skills.findIndex(s => s._id === id);
    if (index === -1) throw new Error('Skill not found');
    const updatedSkill = { ...skills[index], ...data, _id: id };
    skills[index] = updatedSkill;
    storage.set('skills', skills);
    return updatedSkill;
  },
  
  deleteSkill: async (id) => {
    const skills = await mockLearningService.getSkills();
    const filtered = skills.filter(s => s._id !== id);
    storage.set('skills', filtered);
    return { success: true };
  },
  
  updateSkillConfidence: async (id, data) => {
    return mockLearningService.updateSkill(id, { confidence: data.confidence });
  },
  
  updateSkillLastPracticed: async (id, data) => {
    return mockLearningService.updateSkill(id, { lastPracticed: data.lastPracticed });
  },
  
  // Stats (these are still calculated, not stored)
  getCourseStats: async () => {
    const courses = await mockLearningService.getCourses();
    return {
      totalCourses: courses.length,
      inProgress: courses.filter(c => c.status === 'active').length,
      completed: courses.filter(c => c.status === 'completed').length
    };
  },
  
  getLearningMethodStats: async () => {
    const methods = await mockLearningService.getLearningMethods();
    return {
      totalMethods: methods.length,
      totalTimeSpent: methods.reduce((sum, m) => sum + (parseInt(m.duration) || 0), 0)
    };
  },
  
  getSkillStats: async () => {
    const skills = await mockLearningService.getSkills();
    return {
      totalSkills: skills.length
    };
  }
};

// Error boundary component
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleError = (event) => {
      setError(event.error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  const handleReset = () => {
    setHasError(false);
    setError(null);
  };
  
  if (hasError) {
    return fallback ? fallback(error, handleReset) : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
          </div>
          <p className="text-gray-600 mb-4">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

// Retry component for failed operations
const RetryComponent = ({ onRetry, error, loading }) => (
  <div className="text-center py-8">
    <ExclamationTriangleIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load data</h3>
    <p className="text-gray-600 mb-4">{error?.message}</p>
    <button
      onClick={onRetry}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Retrying...' : 'Try Again'}
    </button>
  </div>
);

const LearningDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('courses');
  
  // Data states
  const [courses, setCourses] = useState([]);
  const [learningMethods, setLearningMethods] = useState([]);
  const [skills, setSkills] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState({
    courses: false,
    methods: false,
    skills: false,
    stats: false
  });
  
  const [errors, setErrors] = useState({
    courses: null,
    methods: null,
    skills: null,
    stats: null
  });
  
  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  
  // Current item being edited
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form data states
  const [courseFormData, setCourseFormData] = useState({ title: '', status: 'active' });
  const [methodFormData, setMethodFormData] = useState({ name: '', duration: '', effectiveness: 5 });
  const [skillFormData, setSkillFormData] = useState({ name: '', confidence: 5, lastPracticed: new Date().toISOString().split('T')[0] });
  
  // Stats state
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    totalSkills: 0,
    learningMethods: 0,
    totalTimeSpent: 0
  });

  // Generic error handler with retry capability
  const handleAsyncOperation = async (operation, type, successMessage = null, onSuccess = null, retries = 3) => {
    let lastError = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setLoading(prev => ({ ...prev, [type]: true }));
        setErrors(prev => ({ ...prev, [type]: null }));
        
        const result = await operation();
        
        if (successMessage) {
          toast.success(successMessage);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (error) {
        lastError = error;
        const parsedError = parseError(error);
        
        // Only show error toast on last attempt
        if (attempt === retries) {
          console.error(`Error in ${type} (attempt ${attempt}/${retries}):`, parsedError);
          setErrors(prev => ({ ...prev, [type]: parsedError }));
          
          if (parsedError.type === ERROR_TYPES.NETWORK) {
            toast.error(parsedError.message, {
              toastId: 'network-error',
              autoClose: 5000
            });
          } else if (parsedError.type === ERROR_TYPES.VALIDATION) {
            toast.warn(parsedError.message);
          } else {
            toast.error(parsedError.message);
          }
        } else {
          console.warn(`Retry ${attempt}/${retries} for ${type}:`, parsedError.message);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
      }
    }
    
    // If we get here, all retries failed
    throw lastError;
  };

  // Fetch data with error handling and retry capability
  const fetchData = useCallback(async () => {
    const operations = {
      courses: () => mockLearningService.getCourses(),
      methods: () => mockLearningService.getLearningMethods(),
      skills: () => mockLearningService.getSkills()
    };

    if (operations[activeTab]) {
      try {
        const data = await handleAsyncOperation(
          operations[activeTab],
          activeTab,
          null,
          (result) => {
            switch (activeTab) {
              case 'courses':
                setCourses(result);
                break;
              case 'methods':
                setLearningMethods(result);
                break;
              case 'skills':
                setSkills(result);
                break;
            }
          }
        );
      } catch (error) {
        // Error already handled in handleAsyncOperation
      }
    }
  }, [activeTab]);

  // Load stats with error handling
  const loadStats = useCallback(async () => {
    try {
      await handleAsyncOperation(
        async () => {
          const [courses, methods, skills] = await Promise.all([
            mockLearningService.getCourseStats(),
            mockLearningService.getLearningMethodStats(),
            mockLearningService.getSkillStats()
          ]);
          
          return {
            totalCourses: courses.totalCourses,
            activeCourses: courses.inProgress,
            completedCourses: courses.completed,
            totalSkills: skills.totalSkills,
            learningMethods: methods.totalMethods,
            totalTimeSpent: methods.totalTimeSpent
          };
        },
        'stats',
        null,
        (result) => setStats(result)
      );
    } catch (error) {
      // Stats errors are non-critical, just log them
      console.warn('Failed to load stats:', error);
    }
  }, []);

  // CRUD operations with consistent error handling
  const handleSaveCourse = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    try {
      await handleAsyncOperation(
        async () => {
          if (currentItem) {
            const updatedCourse = await mockLearningService.updateCourse(currentItem._id, courseFormData);
            setCourses(prev => prev.map(c => c._id === currentItem._id ? updatedCourse : c));
            return updatedCourse;
          } else {
            const newCourse = await mockLearningService.createCourse(courseFormData);
            setCourses(prev => [...prev, newCourse]);
            return newCourse;
          }
        },
        'courses',
        currentItem ? 'Course updated successfully' : 'Course created successfully'
      );
      
      setShowCourseForm(false);
      setCurrentItem(null);
      await loadStats();
    } catch (error) {
      // Keep form open on error
    }
  };
  
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value, 10) : value
    }));
  };

  const handleDeleteCourse = async (id) => {
    try {
      await handleAsyncOperation(
        () => mockLearningService.deleteCourse(id),
        'courses',
        'Course deleted successfully',
        () => setCourses(prev => prev.filter(course => course._id !== id))
      );
      await loadStats();
    } catch (error) {
      // Error already handled
    }
  };

  // Learning Method operations
  const handleSaveMethod = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    try {
      await handleAsyncOperation(
        async () => {
          if (currentItem) {
            const updatedMethod = await mockLearningService.updateLearningMethod(currentItem._id, methodFormData);
            setLearningMethods(prev => prev.map(m => m._id === currentItem._id ? updatedMethod : m));
            return updatedMethod;
          } else {
            const newMethod = await mockLearningService.createLearningMethod(methodFormData);
            setLearningMethods(prev => [...prev, newMethod]);
            return newMethod;
          }
        },
        'methods',
        currentItem ? 'Learning method updated successfully' : 'Learning method created successfully'
      );
      
      setShowMethodForm(false);
      setCurrentItem(null);
      await loadStats();
    } catch (error) {
      // Keep form open on error
    }
  };
  
  const handleMethodInputChange = (e) => {
    const { name, value, type } = e.target;
    setMethodFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleDeleteMethod = async (id) => {
    try {
      await handleAsyncOperation(
        () => mockLearningService.deleteLearningMethod(id),
        'methods',
        'Learning method deleted successfully',
        () => setLearningMethods(prev => prev.filter(method => method._id !== id))
      );
      await loadStats();
    } catch (error) {
      // Error already handled
    }
  };

  // Skill operations
  const handleSaveSkill = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    try {
      await handleAsyncOperation(
        async () => {
          if (currentItem) {
            const updatedSkill = await mockLearningService.updateSkill(currentItem._id, skillFormData);
            setSkills(prev => prev.map(s => s._id === currentItem._id ? updatedSkill : s));
            return updatedSkill;
          } else {
            const newSkill = await mockLearningService.createSkill(skillFormData);
            setSkills(prev => [...prev, newSkill]);
            return newSkill;
          }
        },
        'skills',
        currentItem ? 'Skill updated successfully' : 'Skill created successfully'
      );
      
      setShowSkillForm(false);
      setCurrentItem(null);
      await loadStats();
    } catch (error) {
      // Keep form open on error
    }
  };
  
  const handleSkillInputChange = (e) => {
    const { name, value, type } = e.target;
    setSkillFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  const handleDeleteSkill = async (id) => {
    try {
      await handleAsyncOperation(
        () => mockLearningService.deleteSkill(id),
        'skills',
        'Skill deleted successfully',
        () => setSkills(prev => prev.filter(skill => skill._id !== id))
      );
      await loadStats();
    } catch (error) {
      // Error already handled
    }
  };

  const handleUpdateConfidence = async (id, confidence) => {
    try {
      await handleAsyncOperation(
        () => mockLearningService.updateSkillConfidence(id, { confidence }),
        'skills',
        null,
        (updatedSkill) => setSkills(prev => prev.map(skill => 
          skill._id === id ? updatedSkill : skill
        ))
      );
    } catch (error) {
      // Error already handled
    }
  };

  const handleUpdateLastPracticed = async (id, lastPracticed) => {
    try {
      await handleAsyncOperation(
        () => mockLearningService.updateSkillLastPracticed(id, { lastPracticed }),
        'skills',
        'Last practiced date updated',
        (updatedSkill) => setSkills(prev => prev.map(skill => 
          skill._id === id ? updatedSkill : skill
        ))
      );
    } catch (error) {
      // Error already handled
    }
  };

  // Event handlers for forms
  const handleAddCourse = () => {
    setCurrentItem(null);
    setCourseFormData({ title: '', status: 'active' });
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setCurrentItem(course);
    setCourseFormData({
      title: course.title || '',
      status: course.status || 'active',
      progress: course.progress || 0
    });
    setShowCourseForm(true);
  };

  const handleAddMethod = () => {
    setCurrentItem(null);
    setMethodFormData({ name: '', duration: '', effectiveness: 5 });
    setShowMethodForm(true);
  };

  const handleEditMethod = (method) => {
    setCurrentItem(method);
    setMethodFormData({
      name: method.name || '',
      duration: method.duration || '',
      effectiveness: method.effectiveness || 5
    });
    setShowMethodForm(true);
  };

  const handleAddSkill = () => {
    setCurrentItem(null);
    setSkillFormData({ 
      name: '', 
      confidence: 5, 
      lastPracticed: new Date().toISOString().split('T')[0] 
    });
    setShowSkillForm(true);
  };

  const handleEditSkill = (skill) => {
    setCurrentItem(skill);
    setSkillFormData({
      name: skill.name || '',
      confidence: skill.confidence || 5,
      lastPracticed: skill.lastPracticed || new Date().toISOString().split('T')[0]
    });
    setShowSkillForm(true);
  };

  // Initial data load
  useEffect(() => {
    fetchData();
    loadStats();
  }, [fetchData, loadStats]);

  // Render stats cards
  const renderStats = () => {
    if (errors.stats) {
      return (
        <div className="mt-6">
          <RetryComponent 
            onRetry={loadStats} 
            error={errors.stats} 
            loading={loading.stats}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">
                {loading.stats ? '...' : stats.totalCourses}
              </h4>
              <div className="text-gray-500">Total Courses</div>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">
                {loading.stats ? '...' : stats.totalSkills}
              </h4>
              <div className="text-gray-500">Skills Tracked</div>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <LightBulbIcon className="w-8 h-8 text-white" />
            </div>
            <div className="ml-5">
              <h4 className="text-2xl font-semibold text-gray-700">
                {loading.stats ? '...' : stats.learningMethods}
              </h4>
              <div className="text-gray-500">Learning Methods</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mock components for lists (in real app, these would be separate components)
  const renderList = (type, data, loading, error) => {
    if (error) {
      return <RetryComponent onRetry={fetchData} error={error} loading={loading} />;
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading {type}...</span>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <button
              onClick={() => {
                if (type === 'courses') handleAddCourse();
                if (type === 'methods') handleAddMethod();
                if (type === 'skills') handleAddSkill();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add {type.slice(0, -1)}
            </button>
          </div>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item._id || index} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {item.name || item.title || `Method ${index + 1}`}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        if (type === 'courses') handleEditCourse(item);
                        if (type === 'methods') handleEditMethod(item);
                        if (type === 'skills') handleEditSkill(item);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (type === 'courses') handleDeleteCourse(item._id);
                        if (type === 'methods') handleDeleteMethod(item._id);
                        if (type === 'skills') handleDeleteSkill(item._id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No {type} found. Add your first {type.slice(0, -1)} to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return renderList('courses', courses, loading.courses, errors.courses);
      case 'methods':
        return renderList('methods', learningMethods, loading.methods, errors.methods);
      case 'skills':
        return renderList('skills', skills, loading.skills, errors.skills);
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Learning Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Track your learning progress, skills, and methods in one place.
            </p>
          </div>
          
          {/* Stats */}
          {renderStats()}
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'courses', label: 'My Courses', count: courses.length },
                { key: 'skills', label: 'My Skills', count: skills.length },
                { key: 'methods', label: 'Learning Methods', count: learningMethods.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${activeTab === tab.key 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="py-4">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Course Form Modal */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <form onSubmit={handleSaveCourse} className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">
                {currentItem ? 'Edit Course' : 'Add Course'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={courseFormData.title}
                    onChange={handleCourseInputChange}
                    placeholder="Course Title"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={courseFormData.status}
                    onChange={handleCourseInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress ({courseFormData.progress || 0}%)
                  </label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    value={courseFormData.progress || 0}
                    onChange={handleCourseInputChange}
                    className="w-full"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading.courses}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading.courses ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCourseForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Learning Method Form Modal */}
        {showMethodForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMethod();
              }} 
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium mb-4">
                {currentItem ? 'Edit Learning Method' : 'Add Learning Method'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method Name</label>
                  <input
                    type="text"
                    name="name"
                    value={methodFormData.name}
                    onChange={handleMethodInputChange}
                    placeholder="Enter method name"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={methodFormData.duration}
                    onChange={handleMethodInputChange}
                    placeholder="Duration in minutes"
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effectiveness (1-10)</label>
                  <input
                    type="number"
                    name="effectiveness"
                    value={methodFormData.effectiveness}
                    onChange={handleMethodInputChange}
                    min="1"
                    max="10"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading.methods}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading.methods ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMethodForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Skill Form Modal */}
        {showSkillForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <form onSubmit={handleSaveSkill} className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">
                {currentItem ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    value={skillFormData.name}
                    onChange={handleSkillInputChange}
                    placeholder="e.g., React, Node.js"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confidence: {skillFormData.confidence}/10
                  </label>
                  <input
                    type="range"
                    name="confidence"
                    min="1"
                    max="10"
                    value={skillFormData.confidence}
                    onChange={handleSkillInputChange}
                    className="w-full mb-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Practiced
                  </label>
                  <input
                    type="date"
                    name="lastPracticed"
                    value={skillFormData.lastPracticed}
                    onChange={handleSkillInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading.skills}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading.skills ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkillForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Network Status Indicator */}
        {!navigator.onLine && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              You're offline. Some features may not work.
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default LearningDashboard;