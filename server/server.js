import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import financeRoutes from './routes/finance.js';
import dashboardRoutes from './routes/dashboard.js';
import medicationRoutes from './routes/medications.js';
import therapyRoutes from './routes/therapy.js';
import healthFitnessRoutes from './routes/healthFitness.js';
import learningRoutes from './routes/learning.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import mongoose from 'mongoose'; // Added for health check

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel deployment URLs (pattern: https://*.vercel.app)
    const vercelPattern = /^https?:\/\/([a-z0-9-]+\.)*vercel\.app$/;
    
    const allowedOrigins = [
      'http://localhost:5173', // Development
      'http://localhost:3000', // Alternative dev port
      'http://localhost:5174', // Vite dev server
      'https://admin-dashboard-qdgo.onrender.com', // Your backend domain
      'http://127.0.0.1:5173' // Localhost with IP
    ];
    
    // Check if the origin matches any allowed origin or the Vercel pattern
    const isVercelOrigin = vercelPattern.test(origin);
    const isAllowedOrigin = allowedOrigins.some(allowedOrigin => {
      // Handle wildcard in the middle of the string
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$');
        return regex.test(origin);
      }
      return origin === allowedOrigin;
    });
    
    if (isVercelOrigin || isAllowedOrigin) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Timeout middleware - prevent requests from hanging
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000); // 30 seconds
  next();
});

app.use(express.json());

// Routes
app.use('/api/finance', financeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/medications', medicationRoutes);

// Support both /api/therapy and /api/therapies for backward compatibility
app.use('/api/therapies', therapyRoutes);
app.use('/api/therapy', (req, res, next) => {
  // Redirect /api/therapy/* to /api/therapies/*
  const newPath = req.path.replace(/^\/api\/therapy/, '/api/therapies');
  return res.redirect(307, newPath);
});

app.use('/api/health', healthFitnessRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/health/workouts - GET/POST',
      '/api/health/workouts/stats - GET',
      '/api/health/workouts/:id - GET/PUT/DELETE',
      '/api/health/goals - GET/POST',
      '/api/health/goals/stats - GET',
      '/api/health/goals/:id - GET/PUT/DELETE',
      '/api/health/diet-logs - GET/POST',
      '/api/health/diet-logs/stats - GET',
      '/api/health/diet-logs/:id - GET/PUT/DELETE',
      '/api/projects - GET/POST',
      '/api/projects/:id - GET/PUT/DELETE',
      '/api/tasks - POST',
      '/api/tasks/project/:projectId - GET',
      '/api/tasks/:id - GET/PUT/DELETE',
      '/api/tasks/:id/status - PATCH'
    ]
  });
});

const start = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.warn('MONGODB_URI not set; running without DB');
    }
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();


