// Mock data
let mockCourses = [
  {
    id: '1',
    title: 'Introduction to React',
    platform: 'Udemy',
    instructor: 'John Doe',
    progress: 45,
    status: 'In Progress',
    startDate: '2023-05-15',
    estimatedCompletion: '2023-08-30',
    description: 'Learn the fundamentals of React including components, state, and props.',
    category: 'Web Development',
    priority: 'High',
    notes: 'Complete the hooks section next',
    isActive: true
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    platform: 'Coursera',
    instructor: 'Jane Smith',
    progress: 80,
    status: 'In Progress',
    startDate: '2023-04-10',
    estimatedCompletion: '2023-07-20',
    description: 'Deep dive into advanced JavaScript concepts',
    category: 'Programming',
    priority: 'Medium',
    notes: 'Review closures and prototypes',
    isActive: true
  },
  {
    id: '3',
    title: 'Complete Node.js Developer',
    platform: 'Udemy',
    instructor: 'Mike Johnson',
    progress: 0,
    status: 'Not Started',
    startDate: '',
    estimatedCompletion: '',
    description: 'Learn to build scalable network applications with Node.js',
    category: 'Backend Development',
    priority: 'Medium',
    notes: '',
    isActive: true
  }
];

let mockLearningMethods = [
  {
    id: '1',
    name: 'Pomodoro Technique',
    description: '25 minutes focused work, 5 minutes break',
    timeSpent: 45,
    effectiveness: 4,
    isActive: true,
    tags: ['productivity', 'focus'],
    recommendedFor: ['focused coding', 'studying'],
    duration: 30,
    difficulty: 'Medium'
  },
  {
    id: '2',
    name: 'Spaced Repetition',
    description: 'Review material at increasing intervals',
    timeSpent: 20,
    effectiveness: 5,
    isActive: true,
    tags: ['memory', 'retention'],
    recommendedFor: ['language learning', 'memorization'],
    duration: 20,
    difficulty: 'Easy'
  }
];

let mockSkills = [
  {
    id: '1',
    name: 'React',
    description: 'Frontend JavaScript library',
    level: 'Intermediate',
    confidence: 7,
    category: 'Frontend',
    lastPracticed: new Date().toISOString().split('T')[0],
    isActive: true,
    targetLevel: 'Advanced',
    priority: 'High',
    relatedSkills: ['JavaScript', 'Redux', 'React Router']
  },
  {
    id: '2',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    level: 'Beginner',
    confidence: 5,
    category: 'Backend',
    lastPracticed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    targetLevel: 'Intermediate',
    priority: 'High',
    relatedSkills: ['Express', 'REST APIs', 'MongoDB']
  }
];

// Helper function to generate a unique ID
const generateId = (prefix = '') => {
  return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
};

// Courses API
const getCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockCourses]), 500);
  });
};

const getCourse = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = mockCourses.find(c => c.id === id);
      if (course) {
        resolve({ ...course });
      } else {
        reject(new Error('Course not found'));
      }
    }, 300);
  });
};

const createCourse = async (courseData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCourse = {
        id: generateId('course_'),
        progress: 0,
        status: 'Not Started',
        isActive: true,
        ...courseData
      };
      mockCourses.push(newCourse);
      resolve(newCourse);
    }, 300);
  });
};

const updateCourse = async (id, courseData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCourses.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCourses[index] = { ...mockCourses[index], ...courseData };
        resolve(mockCourses[index]);
      } else {
        reject(new Error('Course not found'));
      }
    }, 300);
  });
};

const deleteCourse = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockCourses.length;
      mockCourses = mockCourses.filter(c => c.id !== id);
      if (mockCourses.length < initialLength) {
        resolve({ success: true });
      } else {
        reject(new Error('Course not found'));
      }
    }, 300);
  });
};

// Learning Methods API
const getLearningMethods = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockLearningMethods]), 500);
  });
};

const getLearningMethod = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const method = mockLearningMethods.find(m => m.id === id);
      if (method) {
        resolve({ ...method });
      } else {
        reject(new Error('Learning method not found'));
      }
    }, 300);
  });
};

const createLearningMethod = async (methodData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMethod = {
        id: generateId('method_'),
        timeSpent: 0,
        effectiveness: 3,
        isActive: true,
        tags: [],
        ...methodData
      };
      mockLearningMethods.push(newMethod);
      resolve(newMethod);
    }, 300);
  });
};

const updateLearningMethod = async (id, methodData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLearningMethods.findIndex(m => m.id === id);
      if (index !== -1) {
        mockLearningMethods[index] = { ...mockLearningMethods[index], ...methodData };
        resolve(mockLearningMethods[index]);
      } else {
        reject(new Error('Learning method not found'));
      }
    }, 300);
  });
};

const deleteLearningMethod = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockLearningMethods.length;
      mockLearningMethods = mockLearningMethods.filter(m => m.id !== id);
      if (mockLearningMethods.length < initialLength) {
        resolve({ success: true });
      } else {
        reject(new Error('Learning method not found'));
      }
    }, 300);
  });
};

// Skills API
const getSkills = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockSkills]), 500);
  });
};

const getSkill = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const skill = mockSkills.find(s => s.id === id);
      if (skill) {
        resolve({ ...skill });
      } else {
        reject(new Error('Skill not found'));
      }
    }, 300);
  });
};

const createSkill = async (skillData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSkill = {
        id: generateId('skill_'),
        confidence: 3,
        level: 'Beginner',
        isActive: true,
        lastPracticed: new Date().toISOString().split('T')[0],
        ...skillData
      };
      mockSkills.push(newSkill);
      resolve(newSkill);
    }, 300);
  });
};

const updateSkill = async (id, skillData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockSkills.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSkills[index] = { ...mockSkills[index], ...skillData };
        resolve(mockSkills[index]);
      } else {
        reject(new Error('Skill not found'));
      }
    }, 300);
  });
};

const deleteSkill = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = mockSkills.length;
      mockSkills = mockSkills.filter(s => s.id !== id);
      if (mockSkills.length < initialLength) {
        resolve({ success: true });
      } else {
        reject(new Error('Skill not found'));
      }
    }, 300);
  });
};

// Stats API
const getCourseStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => ({
      totalCourses: mockCourses.length,
      completed: mockCourses.filter(c => c.status === 'Completed').length,
      inProgress: mockCourses.filter(c => c.status === 'In Progress').length,
      notStarted: mockCourses.filter(c => c.status === 'Not Started' || !c.status).length,
      averageProgress: Math.round(mockCourses.reduce((acc, curr) => acc + (curr.progress || 0), 0) / mockCourses.length) || 0
    }), 300);
  });
};

const getLearningMethodStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => ({
      totalMethods: mockLearningMethods.length,
      activeMethods: mockLearningMethods.filter(m => m.isActive).length,
      averageEffectiveness: Math.round(mockLearningMethods.reduce((acc, curr) => acc + curr.effectiveness, 0) / mockLearningMethods.length * 10) / 10 || 0,
      totalTimeSpent: mockLearningMethods.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0)
    }), 300);
  });
};

const getSkillStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => ({
      totalSkills: mockSkills.length,
      activeSkills: mockSkills.filter(s => s.isActive).length,
      averageConfidence: Math.round(mockSkills.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / mockSkills.length * 10) / 10 || 0,
      byLevel: mockSkills.reduce((acc, curr) => {
        acc[curr.level] = (acc[curr.level] || 0) + 1;
        return acc;
      }, {})
    }), 300);
  });
};

export {
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  
  // Learning Methods
  getLearningMethods,
  getLearningMethod,
  createLearningMethod,
  updateLearningMethod,
  deleteLearningMethod,
  
  // Skills
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  
  // Stats
  getCourseStats,
  getLearningMethodStats,
  getSkillStats
};
