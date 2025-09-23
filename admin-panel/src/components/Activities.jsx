import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  BoltIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { API_ENDPOINTS } from '../config/api';

// Activity type to icon mapping
const activityIcons = {
  workout: BoltIcon,
  course: AcademicCapIcon,
  finance: CurrencyDollarIcon,
  user: UserIcon,
  default: DocumentTextIcon
};

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const activitiesPerPage = 10;

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_ENDPOINTS.ACTIVITIES}?page=${currentPage}&limit=${activitiesPerPage}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data.activities || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activities. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [currentPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">All Activities</h1>
      </div>
      
      {error ? (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const ActivityIcon = activityIcons[activity.type] || activityIcons.default;
            return (
              <div 
                key={`${activity.id || index}-${activity.timestamp}`}
                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
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
                  {activity.description && (
                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                  )}
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(activity.timestamp || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No activities found</p>
          <button
            onClick={fetchActivities}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Activities;
