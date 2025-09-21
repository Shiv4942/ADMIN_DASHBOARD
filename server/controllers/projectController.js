import asyncHandler from 'express-async-handler';
import Project from '../models/projectModel.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  
  const projects = await Project.find(query);
  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('tasks');
  
  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, status, startDate, endDate, team } = req.body;
  
  const project = new Project({
    name,
    description,
    status: status || 'Not Started',
    startDate: startDate || Date.now(),
    endDate: endDate || null,
    progress: 0,
    team: team || [],
  });
  
  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, status, progress, team } = req.body;
  
  const project = await Project.findById(req.params.id);
  
  if (project) {
    project.name = name || project.name;
    project.description = description || project.description;
    if (status) project.status = status;
    if (progress !== undefined) project.progress = progress;
    if (team) project.team = team;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (project) {
    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
