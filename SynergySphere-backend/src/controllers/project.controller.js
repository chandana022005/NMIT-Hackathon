const prisma = require('../utils/prisma');

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'Project title is required'
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdBy: {
          connect: { id: userId }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating project'
    });
  }
};

/**
 * Get all projects for current user
 */
const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects created by user
    const createdProjects = await prisma.project.findMany({
      where: { createdById: userId },
      include: {
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Get projects where user is a team member
    const teamProjects = await prisma.teamMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            teamMembers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Combine and format results
    const memberProjects = teamProjects.map(tm => tm.project);
    const allProjects = [...createdProjects, ...memberProjects];

    res.status(200).json({
      status: 'success',
      data: allProjects
    });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching projects'
    });
  }
};

/**
 * Get a single project by ID
 */
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        tasks: true
      }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching project'
    });
  }
};

/**
 * Update a project
 */
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    // Check if project exists and user is the creator
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    if (project.createdById !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the project creator can update project details'
      });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: title || project.title,
        description: description !== undefined ? description : project.description
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating project'
    });
  }
};

/**
 * Delete a project
 */
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if project exists and user is the creator
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    if (project.createdById !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the project creator can delete the project'
      });
    }

    // Delete project (Prisma will cascade delete related records)
    await prisma.project.delete({
      where: { id: projectId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting project'
    });
  }
};

/**
 * Add a team member to a project
 */
const addTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!email || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and role are required'
      });
    }

    // Check if project exists and user is the creator
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    if (project.createdById !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the project creator can add team members'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if user is already a team member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId
        }
      }
    });

    if (existingMember) {
      return res.status(400).json({
        status: 'error',
        message: 'User is already a team member'
      });
    }

    // Add team member
    const teamMember = await prisma.teamMember.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        project: {
          connect: { id: projectId }
        },
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Team member added successfully',
      data: teamMember
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding team member'
    });
  }
};

/**
 * Remove a team member from a project
 */
const removeTeamMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.user.id;

    // Check if project exists and user is the creator
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    if (project.createdById !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the project creator can remove team members'
      });
    }

    // Check if team member exists
    const teamMember = await prisma.teamMember.findUnique({
      where: { id: memberId }
    });

    if (!teamMember || teamMember.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Team member not found in this project'
      });
    }

    // Remove team member
    await prisma.teamMember.delete({
      where: { id: memberId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Team member removed successfully'
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing team member'
    });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember
};