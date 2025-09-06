// Mock Prisma client for testing
const mockPrisma = {
  notification: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    findMany: jest.fn().mockResolvedValue([]),
    updateMany: jest.fn().mockResolvedValue({ count: 5 }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-notification-id',
      userId: 'mock-user-id',
      type: 'test',
      content: 'Test notification',
      read: false,
      createdAt: new Date()
    })
  },
  message: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-message-id',
      content: 'Test message',
      projectId: 'mock-project-id',
      userId: 'mock-user-id',
      createdAt: new Date()
    }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({
      id: 'mock-message-id',
      content: 'Test message',
      projectId: 'mock-project-id',
      userId: 'mock-user-id',
      createdAt: new Date()
    })
  },
  task: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-task-id',
      title: 'Test task',
      description: 'Test task description',
      status: 'To-Do',
      projectId: 'mock-project-id',
      assignedToId: 'mock-user-id',
      createdAt: new Date()
    }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({
      id: 'mock-task-id',
      title: 'Test task',
      description: 'Test task description',
      status: 'To-Do',
      projectId: 'mock-project-id',
      assignedToId: 'mock-user-id',
      createdAt: new Date()
    }),
    update: jest.fn().mockResolvedValue({
      id: 'mock-task-id',
      title: 'Updated task',
      description: 'Updated task description',
      status: 'In-Progress',
      projectId: 'mock-project-id',
      assignedToId: 'mock-user-id',
      createdAt: new Date()
    })
  },
  teamMember: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-team-member-id',
      userId: 'mock-user-id',
      projectId: 'mock-project-id',
      role: 'member'
    }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({
      id: 'mock-team-member-id',
      userId: 'mock-user-id',
      projectId: 'mock-project-id',
      role: 'member'
    })
  },
  project: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-project-id',
      title: 'Test Project',
      description: 'A test project for API testing',
      createdById: 'mock-user-id',
      createdAt: new Date()
    }),
    findMany: jest.fn().mockResolvedValue([]),
    findUnique: jest.fn().mockResolvedValue({
      id: 'mock-project-id',
      title: 'Test Project',
      description: 'A test project for API testing',
      createdById: 'mock-user-id',
      createdAt: new Date()
    }),
    update: jest.fn().mockResolvedValue({
      id: 'mock-project-id',
      title: 'Updated Project',
      description: 'Updated project description',
      createdById: 'mock-user-id',
      createdAt: new Date()
    })
  },
  user: {
    deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    findUnique: jest.fn().mockResolvedValue({
      id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz',
      createdAt: new Date()
    }),
    create: jest.fn().mockResolvedValue({
      id: 'mock-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz',
      createdAt: new Date()
    })
  },
  $disconnect: jest.fn()
};

module.exports = mockPrisma;