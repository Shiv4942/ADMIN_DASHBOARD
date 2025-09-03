import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const SkillList = ({ 
  skills, 
  loading, 
  onEdit, 
  onDelete, 
  onAddSkill, 
  onRefresh,
  onUpdateConfidence,
  onUpdateLastPracticed
}) => {
  const [isDeleting, setIsDeleting] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'lastPracticed', direction: 'desc' });

  const getConfidenceColor = (confidence) => {
    if (confidence >= 4) return 'bg-green-100 text-green-800';
    if (confidence >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-blue-100 text-blue-800',
      'Intermediate': 'bg-purple-100 text-purple-800',
      'Advanced': 'bg-indigo-100 text-indigo-800',
      'Expert': 'bg-pink-100 text-pink-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        setIsDeleting(id);
        await onDelete(id);
        toast.success('Skill deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete skill');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSkills = [...skills].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <ArrowUpIcon className="ml-1 h-3 w-3 inline" />
    ) : (
      <ArrowDownIcon className="ml-1 h-3 w-3 inline" />
    );
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
        <h3 className="text-lg font-semibold">My Skills</h3>
        <div className="space-x-2">
          <button
            onClick={onRefresh}
            className="btn-secondary"
            disabled={loading}
          >
            Refresh
          </button>
          <button
            onClick={onAddSkill}
            className="btn-primary"
            disabled={loading}
          >
            Add Skill
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No skills added yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by adding a new skill to track your progress.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={onAddSkill}
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
              New Skill
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Skill {getSortIcon('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category {getSortIcon('category')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('level')}
                >
                  <div className="flex items-center">
                    Level {getSortIcon('level')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('confidence')}
                >
                  <div className="flex items-center">
                    Confidence {getSortIcon('confidence')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  onClick={() => handleSort('lastPracticed')}
                >
                  <div className="flex items-center">
                    Last Practiced {getSortIcon('lastPracticed')}
                  </div>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedSkills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <div className="font-medium">{skill.name}</div>
                    {skill.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {skill.description}
                      </div>
                    )}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {skill.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                        {skill.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{skill.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {skill.category || 'Uncategorized'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-24 mr-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getConfidenceColor(skill.confidence).replace('text-', 'bg-').split(' ')[0]}`}
                            style={{ width: `${(skill.confidence / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceColor(skill.confidence)}`}>
                        {skill.confidence}/5
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {skill.lastPracticed ? (
                      <div className="flex flex-col">
                        <span>{new Date(skill.lastPracticed).toLocaleDateString()}</span>
                        <button
                          onClick={() => onUpdateLastPracticed(skill._id, new Date().toISOString())}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          Mark as practiced today
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">Never</span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onUpdateConfidence(skill._id, Math.min(5, skill.confidence + 1))}
                        disabled={skill.confidence >= 5}
                        className={`p-1 rounded ${skill.confidence >= 5 ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
                        title="Increase confidence"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => onUpdateConfidence(skill._id, Math.max(1, skill.confidence - 1))}
                        disabled={skill.confidence <= 1}
                        className={`p-1 rounded ${skill.confidence <= 1 ? 'text-gray-300' : 'text-red-600 hover:bg-red-50'}`}
                        title="Decrease confidence"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => onEdit(skill)}
                        className="p-1 text-gray-500 hover:text-primary-600"
                        title="Edit skill"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                        disabled={isDeleting === skill._id}
                        title="Delete skill"
                      >
                        {isDeleting === skill._id ? (
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SkillList;
