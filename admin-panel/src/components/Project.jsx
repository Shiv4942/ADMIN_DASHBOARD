import React, { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiClock, FiTrendingUp, FiEdit2, FiTrash2 } from "react-icons/fi";
import { projectService, taskService } from "../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data for task management (replace with actual API calls)
const taskManagementList = [
  {
    id: 1,
    name: "Development",
    tasks: [
      {
        id: 1,
        title: "Implement user authentication",
        status: "In Progress",
        assignedTo: [{ name: "John", avatar: "" }],
      },
      {
        id: 2,
        title: "Design database schema",
        status: "In Review",
        assignedTo: [{ name: "Sarah", avatar: "" }],
      },
    ],
  },
  // Add more task management categories as needed
];

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    projectId: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Not Started",
    progress: 0,
  });

  // Filter projects based on search
  useEffect(() => {
    let result = [...projects];
    if (searchTerm) {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (!showAll && result.length > 4) {
      result = result.slice(0, 4);
    }
    setFilteredProjects(result);
  }, [projects, searchTerm, showAll]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects(searchTerm);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProject) {
        // Update existing project
        await projectService.updateProject(currentProject._id, formData);
        toast.success("Project updated successfully");
      } else {
        // Create new project
        await projectService.createProject(formData);
        toast.success("Project created successfully");
      }
      // Refresh projects
      const data = await projectService.getProjects();
      setProjects(data);
      setShowProjectModal(false);
      setFormData({ name: "", description: "", status: "Not Started", progress: 0 });
      setCurrentProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error(error.response?.data?.message || "Failed to save project");
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectId = currentProject?._id || taskForm.projectId;
      if (!projectId) {
        toast.error("Please select a project");
        return;
      }
      
      const taskData = {
        title: taskForm.title,
        description: taskForm.description,
        status: taskForm.status,
        priority: taskForm.priority,
        project: projectId, // Changed from projectId to project to match backend expectation
      };
      
      await taskService.createTask(taskData);
      toast.success("Task created successfully");
      setShowTaskModal(false);
      setTaskForm({
        title: "",
        description: "",
        status: "Not Started",
        priority: "Medium",
        projectId: ""
      });
      
      // Refresh project details if viewing details
      if (currentProject) {
        const tasks = await taskService.getTasksByProject(currentProject._id);
        setProjectDetails(prev => ({
          ...prev,
          tasks: tasks || []
        }));
      }
      
      // Refresh projects list to update task counts
      const projects = await projectService.getProjects();
      setProjects(projects);
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const viewProjectDetails = async (project) => {
    try {
      setLoading(true);
      // First get the project details
      const details = await projectService.getProjectById(project._id);
      // Then get the tasks for this project
      const tasks = await taskService.getTasksByProject(project._id);
      // Combine the data
      const projectWithTasks = {
        ...details,
        tasks: tasks || []
      };
      setProjectDetails(projectWithTasks);
      setCurrentProject(projectWithTasks);
      setShowTaskModal(true);
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      progress: project.progress || 0,
    });
    setShowProjectModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.deleteProject(id);
        const updatedProjects = projects.filter((project) => project._id !== id);
        setProjects(updatedProjects);
        if (currentProject?._id === id) {
          setCurrentProject(null);
          setProjectDetails(null);
          setShowTaskModal(false);
        }
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Project Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
              />
            </div>
            <button
              onClick={() => {
                setCurrentProject(null);
                setFormData({ name: "", description: "", status: "Not Started", progress: 0 });
                setShowProjectModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
            >
              <FiPlus className="text-lg" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {projects.length > 0 ? "Active Projects" : "No Projects Found"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => {
                const progress = project.progress || 0;
                const progressColor =
                  progress < 30 ? "bg-red-500" : progress < 70 ? "bg-yellow-500" : "bg-green-500";

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {project.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <FiClock className="mr-1" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${progressColor}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                            title="Edit Project"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                            title="Delete Project"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => viewProjectDetails(project)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {projectDetails ? `${projectDetails.name} - Tasks` : 'Add New Task'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowTaskModal(false);
                      setProjectDetails(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {projectDetails && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-800">{projectDetails.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{projectDetails.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(projectDetails.status)}`}>
                        {projectDetails.status}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Progress: {projectDetails.progress || 0}%</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleTaskSubmit} className="mb-6">
                  {!projectDetails && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project
                      </label>
                      <select
                        name="projectId"
                        value={taskForm.projectId}
                        onChange={(e) => setTaskForm({...taskForm, projectId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={taskForm.status}
                        onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTaskModal(false);
                        setProjectDetails(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {projectDetails ? 'Add Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Scrollable container */}
              <div className="overflow-y-auto flex-1">
                <div className="p-4 space-y-4">
                  {/* Scroll to tasks button */}
                  {projectDetails?.tasks?.length > 0 && (
                    <button 
                      onClick={() => {
                        const taskList = document.getElementById('task-list');
                        if (taskList) {
                          taskList.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border-b border-gray-100"
                    >
                      ↓ View Tasks ({projectDetails.tasks.length})
                    </button>
                  )}
                  
                  {/* Task Form */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-3">Add New Task</h3>
                  </div>
                  
                  {/* Task List Section */}
                  {projectDetails?.tasks?.length > 0 ? (
                    <div id="task-list" className="pt-4 mt-4 border-t border-gray-100">
                      <h3 className="font-medium text-gray-800 mb-2 text-sm">Tasks ({projectDetails.tasks.length})</h3>
                      <div className="space-y-2">
                        {projectDetails.tasks.map((task) => (
                          <div key={task._id} className="p-2 bg-white rounded-md border border-gray-100 hover:shadow-sm transition-shadow text-sm">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 truncate">{task.title}</h4>
                                {task.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>}
                              </div>
                              <span className={`px-1.5 py-0.5 text-[10px] rounded-full whitespace-nowrap ml-2 ${
                                task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                task.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            {task.priority && (
                              <div className="mt-1 flex items-center text-[10px] text-gray-500">
                                <span>Priority:</span>
                                <span className={`ml-1 px-1.5 py-0.5 rounded ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Back to top button */}
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 border-t border-gray-100"
                      >
                        ↑ Back to Top
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Add a task to get started!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Management Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Task Management</h2>
            <button 
              onClick={toggleShowAll}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              {showAll ? 'Show Less' : 'View All'} <span className="ml-1">{showAll ? '↑' : '→'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {['Not Started', 'In Progress', 'In Review', 'Completed'].map((status) => {
              // Filter tasks by status
              const statusTasks = projects.flatMap(project => 
                (project.tasks || []).filter(task => task.status === status)
              );
              
              return (
                <div
                  key={status}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {status}
                      </h3>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FiTrendingUp className="text-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {statusTasks.length > 0 ? (
                        statusTasks.map((task) => (
                          <div
                            key={task._id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                          >
                            <p className="text-sm font-medium text-gray-800 mb-1">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex justify-between items-center">
                              <div className="flex -space-x-2">
                                {task.assignedTo?.length > 0 ? (
                                  task.assignedTo.map((user, idx) => (
                                    <div
                                      key={idx}
                                      className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-medium text-blue-800 border-2 border-white"
                                    >
                                      {user.name?.charAt(0) || 'U'}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400">Unassigned</span>
                                )}
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                  task.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>
                            {task.priority && (
                              <div className="mt-1 flex items-center text-[10px] text-gray-500">
                                <span>Priority:</span>
                                <span className={`ml-1 px-1.5 py-0.5 rounded ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                            )}
                            {task.project && (
                              <div className="mt-1 text-xs text-gray-500">
                                Project: {typeof task.project === 'object' ? task.project.name : 'N/A'}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No {status.toLowerCase()} tasks</p>
                      )}
                    </div>

                    <button
                      className="mt-4 w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      onClick={() => {
                        setTaskForm({
                          title: "",
                          description: "",
                          status: status,
                          priority: "Medium",
                          projectId: projects[0]?._id || ""
                        });
                        setShowTaskModal(true);
                      }}
                    >
                      + Add New Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentProject ? "Edit Project" : "Add New Project"}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        name="progress"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {currentProject ? "Update" : "Create"} Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container - This is just a placeholder, actual toast is configured in App.js */}
        <div className="fixed top-4 right-4 z-50" />
      </div>
    </div>
  );
};

export default Project;
