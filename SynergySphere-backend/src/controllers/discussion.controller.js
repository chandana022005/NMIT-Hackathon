const prisma = require('../utils/prisma');

/**
 * Create a new message in a project discussion
 */
const createMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, parentMessageId } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: 'Message content is required'
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

    // If parentMessageId is provided, check if it exists
    if (parentMessageId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: parentMessageId }
      });

      if (!parentMessage || parentMessage.projectId !== projectId) {
        return res.status(404).json({
          status: 'error',
          message: 'Parent message not found in this project'
        });
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        project: {
          connect: { id: projectId }
        },
        user: {
          connect: { id: userId }
        },
        parentMessage: parentMessageId ? {
          connect: { id: parentMessageId }
        } : undefined
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

    // Create notifications for all team members except the message creator
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        projectId,
        userId: { not: userId }
      },
      select: {
        userId: true
      }
    });

    // Also include project creator if not the message creator
    if (project.createdById !== userId) {
      teamMembers.push({ userId: project.createdById });
    }

    // Create notifications
    const notificationPromises = teamMembers.map(member => {
      return prisma.notification.create({
        data: {
          userId: member.userId,
          type: 'message_posted',
          content: `New message in project ${project.title}`
        }
      });
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      status: 'success',
      message: 'Message posted successfully',
      data: message
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while posting message'
    });
  }
};

/**
 * Get all messages for a project
 */
const getProjectMessages = async (req, res) => {
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

    // Get top-level messages (no parent)
    const messages = await prisma.message.findMany({
      where: {
        projectId,
        parentMessageId: null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      data: messages
    });
  } catch (error) {
    console.error('Get project messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching messages'
    });
  }
};

/**
 * Get a single message thread by ID
 */
const getMessageThread = async (req, res) => {
  try {
    const { projectId, messageId } = req.params;

    // Check if message exists and belongs to the project
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!message || message.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found in this project'
      });
    }

    res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    console.error('Get message thread error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching message thread'
    });
  }
};

/**
 * Delete a message
 */
const deleteMessage = async (req, res) => {
  try {
    const { projectId, messageId } = req.params;
    const userId = req.user.id;

    // Check if message exists and belongs to the project
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message || message.projectId !== projectId) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found in this project'
      });
    }

    // Check if user is the message creator
    if (message.userId !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own messages'
      });
    }

    // Delete message
    await prisma.message.delete({
      where: { id: messageId }
    });

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting message'
    });
  }
};

module.exports = {
  createMessage,
  getProjectMessages,
  getMessageThread,
  deleteMessage
};