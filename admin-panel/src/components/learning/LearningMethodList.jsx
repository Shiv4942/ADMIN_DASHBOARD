import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const LearningMethodList = ({ 
  methods, 
  loading, 
  onEdit, 
  onDelete, 
  onAddMethod, 
  onRefresh 
}) => {
  const [isDeleting, setIsDeleting] = useState(null);

  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness >= 8) return 'bg-green-100 text-green-800';
    if (effectiveness >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning method?')) {
      try {
        setIsDeleting(id);
        await onDelete(id);
        toast.success('Learning method deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete learning method');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Learning Methods</h3>
        <div className="space-x-2">
          <button
            onClick={onRefresh}
            className="btn-secondary"
            disabled={loading}
          >
            Refresh
          </button>
          <button
            onClick={onAddMethod}
            className="btn-primary"
            disabled={loading}
          >
            Add Method
          </button>
        </div>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No learning methods</h3>
          <p className="mt-1 text-sm text-gray-500">
            Track your learning methods to improve your study habits.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddMethod}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Method
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {methods.map((method) => (
            <div key={method._id} className="card p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {method.name}
                    </h4>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{method.timeSpent} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEffectivenessColor(method.effectiveness)}`}>
                        Effectiveness: {method.effectiveness}/10
                      </span>
                    </div>
                    {method.lastUsed && (
                      <div className="text-sm text-gray-500">
                        Last used: {new Date(method.lastUsed).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(method)}
                    className="p-1 text-gray-500 hover:text-primary-600"
                    title="Edit method"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(method._id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                    disabled={isDeleting === method._id}
                    title="Delete method"
                  >
                    {isDeleting === method._id ? (
                      <div className="h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {method.description && (
                <div className="mt-3 text-sm text-gray-600">
                  <p className="whitespace-pre-line">{method.description}</p>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => {
                    const newTime = prompt('Add minutes spent:', '30');
                    if (newTime && !isNaN(newTime) && parseInt(newTime) > 0) {
                      onEdit({
                        ...method,
                        timeSpent: method.timeSpent + parseInt(newTime),
                        lastUsed: new Date().toISOString()
                      });
                    }
                  }}
                >
                  <ClockIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Log Time
                </button>
                
                <button
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => {
                    const newEffectiveness = prompt('Rate effectiveness (1-10):', method.effectiveness);
                    if (newEffectiveness && !isNaN(newEffectiveness) && newEffectiveness >= 1 && newEffectiveness <= 10) {
                      onEdit({
                        ...method,
                        effectiveness: parseInt(newEffectiveness)
                      });
                    }
                  }}
                >
                  <CheckCircleIcon className="-ml-0.5 mr-2 h-4 w-4" />
                  Rate Effectiveness
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningMethodList;
