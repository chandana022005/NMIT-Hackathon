const prisma = require('../utils/prisma');

/**
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedToId, status, dueDate } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'Task title is required'
      });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'To-Do',
        dueDate: dueDate ? new Date(dueDate) : null,
        project: {
          connect: { id: projectId }
        },
        assignedTo: assignedToId ? {
          connect: { id: assignedToId }
        } : undefined
      }
    });

    // If task is assigned to a user, create a notification
    if (assignedToId) {
      await prisma.notification.create({
        data: {
          userId: assignedToId,
          type: 'task_assigned',
          content: `You have been assigned a new task: ${title}`
        }
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating task'
    });
  }
};

/**
 * Get all tasks for a project
 */
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Get tasks
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tasks'
    });
  }
};

/**
 * Get a single task by ID
 */
const getTaskById = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!task || task.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found in this project'
      });
    }

    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching task'
    });
  }
};

/**
 * Update a task
 */
const updateTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, assignedToId, status, dueDate } = req.body;

    // Check if task exists and belongs to the project
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task || task.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found in this project'
      });
    }

    // Check if assignedToId has changed
    const isNewAssignment = assignedToId && task.assignedToId !== assignedToId;

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        assignedTo: assignedToId ? {
          connect: { id: assignedToId }
        } : undefined
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // If task is newly assigned to a user, create a notification
    if (isNewAssignment) {
      await prisma.notification.create({
        data: {
          userId: assignedToId,
          type: 'task_assigned',
          content: `You have been assigned a task: ${updatedTask.title}`
        }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating task'
    });
  }
};

/**
 * Delete a task
 */
const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    // Check if task exists and belongs to the project
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task || task.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found in this project'
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting task'
    });
  }
};

/**
 * Get tasks assigned to current user
 */
const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        project: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    res.status(200).json({
      status: 'success',
      data: tasks
    });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching tasks'
    });
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUserTasks
};