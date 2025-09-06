const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Invalid token.' 
    });
  }
};

/**
 * Middleware to check if user is project member
 * This will be used for project-specific routes
 */
const isProjectMember = async (req, res, next) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user is project creator
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project && project.createdById === userId) {
      return next();
    }

    // Check if user is team member
    const teamMember = await prisma.teamMember.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId
        }
      }
    });

    if (!teamMember) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. You are not a member of this project.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error while checking project membership.'
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { verifyToken, isProjectMember };