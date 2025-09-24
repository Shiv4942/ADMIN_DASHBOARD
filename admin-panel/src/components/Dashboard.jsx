import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { 
  BookOpenIcon, 
  BoltIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Skeleton Loader Component
const SkeletonLoader = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Activity type to icon mapping
const activityIcons = {
  workout: BoltIcon,
  course: AcademicCapIcon,
  finance: CurrencyDollarIcon,
  user: UserIcon,
  default: DocumentTextIcon
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    coursesCompleted: 0,
    monthlyRevenue: 0,
    activeUsers: 0,
    monthlyChange: {
      workouts: 0,
      courses: 0,
      revenue: 0,
      users: 0
    }
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const activitiesPerPage = 5;

  const [quickActions] = useState([
    { 
      id: 1, 
      title: 'Add Workout', 
      icon: BoltIcon, 
      color: 'bg-blue-500',
      action: 'workouts',
      path: '/workouts/new'
    },
    { 
      id: 2, 
      title: 'Analyze Income', 
      icon: CheckCircleIcon, 
      color: 'bg-green-500',
      action: 'finances',
      path: '/finances/new'
    },
    { 
      id: 3, 
      title: 'Start Course', 
      icon: BookOpenIcon, 
      color: 'bg-purple-500',
      action: 'courses',
      path: '/courses/start'
    },
    { 
      id: 4, 
      title: 'Add Project', 
      icon: CheckCircleIcon, 
      color: 'bg-orange-500',
      action: 'projects',
      path: '/projects/new'
    }
  ]);

  // Fetch dashboard data function
  const fetchDashboardData = useCallback(async (abortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const signal = abortSignal || controller.signal;
      
      const dashboardRes = await fetch(`${API_ENDPOINTS.DASHBOARD.OVERVIEW}?page=${currentPage}&limit=${activitiesPerPage}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: signal
      });

      if (!dashboardRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await dashboardRes.json();
      
      setStats({
        totalWorkouts: data.stats?.totalWorkouts || 0,
        coursesCompleted: data.stats?.coursesCompleted || 0,
        monthlyRevenue: data.stats?.monthlyRevenue || 0,
        activeUsers: data.stats?.activeUsers || 0,
        monthlyChange: {
          workouts: data.monthlyChange?.workouts || 0,
          courses: data.monthlyChange?.courses || 0,
          revenue: data.monthlyChange?.revenue || 0,
          users: data.monthlyChange?.users || 0
        }
      });
      
      setRecentActivities(data.recentActivities || []);
      setTotalPages(data.totalPages || 1);
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPage, activitiesPerPage]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
  };

  // Handle quick actions
  const handleAction = (action) => {
    try {
      if (action.path) {
        navigate(action.path);
      } else {
        console.warn('No path specified for action:', action.action);
      }
    } catch (err) {
      console.error('Navigation failed:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Render stat card
  const renderStatCard = (title, value, icon, change, isCurrency = false) => {
    const isPositive = change >= 0;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="mt-1">
              {isLoading ? (
                <SkeletonLoader className="h-8 w-20" />
              ) : (
                <span className="text-2xl font-semibold text-gray-900">
                  {isCurrency ? formatCurrency(value) : value.toLocaleString()}
                </span>
              )}
            </div>
            {!isLoading && !isNaN(change) && change !== 0 && (
              <div className={`mt-2 flex items-center text-sm ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${
            icon === BookOpenIcon ? 'bg-blue-50 text-blue-600' : 
            icon === BoltIcon ? 'bg-purple-50 text-purple-600' : 
            icon === CurrencyDollarIcon ? 'bg-green-50 text-green-600' : 
            'bg-orange-50 text-orange-600'
          }`}>
            {React.createElement(icon, { className: "h-6 w-6" })}
          </div>
        </div>
      </div>
    );
  };

  // Use effect for initial load
  useEffect(() => {
    const abortController = new AbortController();
    fetchDashboardData(abortController.signal);
    
    return () => {
      abortController.abort();
    };
  }, [fetchDashboardData]);

  // Render loading state
  if (isLoading && !stats.totalWorkouts) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <SkeletonLoader className="h-8 w-64 mb-2" />
            <SkeletonLoader className="h-4 w-48" />
          </div>
          <SkeletonLoader className="h-10 w-24" />
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <SkeletonLoader className="h-6 w-32 mb-2" />
              <SkeletonLoader className="h-8 w-20 mb-4" />
              <SkeletonLoader className="h-4 w-24" />
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <SkeletonLoader className="h-6 w-48" />
            <SkeletonLoader className="h-8 w-24" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <SkeletonLoader className="h-10 w-10 rounded-full" />
                  <div>
                    <SkeletonLoader className="h-4 w-32 mb-2" />
                    <SkeletonLoader className="h-3 w-24" />
                  </div>
                </div>
                <SkeletonLoader className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !stats.totalWorkouts) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
        <div className="text-red-600 font-medium mb-4">Error Loading Dashboard</div>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
              Refreshing...
            </>
          ) : 'Try Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! {lastUpdated && `Last updated at ${lastUpdated}`}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={`mt-4 sm:mt-0 px-4 py-2 text-sm font-medium rounded-md flex items-center ${
            isRefreshing 
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
          disabled={isRefreshing}
        >
          <ArrowPathIcon 
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard(
          'Total Workouts', 
          stats.totalWorkouts, 
          BoltIcon, 
          stats.monthlyChange.workouts
        )}
        
        {renderStatCard(
          'Courses Completed', 
          stats.coursesCompleted, 
          BookOpenIcon, 
          stats.monthlyChange.courses
        )}
        
        {renderStatCard(
          'Monthly Revenue', 
          stats.monthlyRevenue, 
          CurrencyDollarIcon, 
          stats.monthlyChange.revenue,
          true
        )}
        
        {renderStatCard(
          'Active Users', 
          stats.activeUsers, 
          UserGroupIcon, 
          stats.monthlyChange.users
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action)}
              className={`flex items-center justify-center space-x-2 p-4 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 ${action.color} shadow-sm hover:shadow-md`}
            >
              <action.icon className="h-5 w-5" />
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <button 
              onClick={() => navigate('/activities')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          {error && (
            <div className="flex items-center justify-center p-4 text-red-600 bg-red-50 rounded-lg mb-4">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {recentActivities.length > 0 ? (
            <>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = activityIcons[activity.type] || activityIcons.default;
                  return (
                    <div 
                      key={`${activity.id || index}-${activity.timestamp}`} 
                      className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${
                          activity.type === 'workout' ? 'bg-blue-50 text-blue-600' :
                          activity.type === 'course' ? 'bg-purple-50 text-purple-600' :
                          activity.type === 'finance' ? 'bg-green-50 text-green-600' :
                          'bg-gray-50 text-gray-600'
                        } flex items-center justify-center`}>
                          <ActivityIcon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-400">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recent'}
                          </p>
                          {activity.user && (
                            <span className="inline-flex items-center text-xs text-gray-500">
                              <UserIcon className="h-3 w-3 mr-1" />
                              {activity.user.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Previous
                  </button>
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">No recent activities found</p>
              <button
                onClick={() => fetchDashboardData()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center"
              >
                {isRefreshing ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-1" />
                    Refreshing...
                  </>
                ) : 'Refresh'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;