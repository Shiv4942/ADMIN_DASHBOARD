import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';
import Project from '../models/projectModel.js';

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  
  const tasks = await Task.find({ project: projectId });
  res.json(tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
  
  // Verify project exists
  const projectExists = await Project.findById(project);
  if (!projectExists) {
    res.status(400);
    throw new Error('Project not found');
  }
  
  const task = new Task({
    title,
    description,
    status: status || 'Not Started',
    priority: priority || 'Medium',
    dueDate: dueDate || null,
    project,
    assignedTo: assignedTo || [],
  });
  
  const createdTask = await task.save();
  
  // Add task to project's tasks array
  projectExists.tasks.push(createdTask._id);
  await projectExists.save();
  
  res.status(201).json(createdTask);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;
  
  const task = await Task.findById(req.params.id);
  
  if (task) {
    task.title = title || task.title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const task = await Task.findById(req.params.id);
  
  if (task) {
    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
