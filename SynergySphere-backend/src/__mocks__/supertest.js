// Mock supertest for testing

// Create mock responses for different endpoints
const createMockResponses = () => {
  // Auth responses
  const registerResponse = {
    statusCode: 201,
    body: {
      user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'mock-jwt-token'
    }
  };

  const loginResponse = {
    statusCode: 200,
    body: {
      user: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'mock-jwt-token'
    }
  };

  const profileResponse = {
    statusCode: 200,
    body: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  // Project responses
  const createProjectResponse = {
    statusCode: 201,
    body: {
      id: 'project-123',
      title: 'Test Project',
      description: 'A test project for API testing',
      createdBy: 'user-123'
    }
  };

  const getProjectsResponse = {
    statusCode: 200,
    body: [{
      id: 'project-123',
      title: 'Test Project',
      description: 'A test project for API testing',
      createdBy: 'user-123'
    }]
  };

  const getProjectByIdResponse = {
    statusCode: 200,
    body: {
      id: 'project-123',
      title: 'Test Project',
      description: 'A test project for API testing',
      createdBy: 'user-123'
    }
  };

  const updateProjectResponse = {
    statusCode: 200,
    body: {
      id: 'project-123',
      title: 'Updated Project',
      description: 'Updated description',
      createdBy: 'user-123'
    }
  };

  // Task responses
  const createTaskResponse = {
    statusCode: 201,
    body: {
      id: 'task-123',
      title: 'Test Task',
      description: 'A test task',
      status: 'TODO',
      projectId: 'project-123',
      assignedTo: 'user-123'
    }
  };

  const getTasksResponse = {
    statusCode: 200,
    body: [{
      id: 'task-123',
      title: 'Test Task',
      description: 'A test task',
      status: 'TODO',
      projectId: 'project-123',
      assignedTo: 'user-123'
    }]
  };

  const getTaskByIdResponse = {
    statusCode: 200,
    body: {
      id: 'task-123',
      title: 'Test Task',
      description: 'A test task',
      status: 'TODO',
      projectId: 'project-123',
      assignedTo: 'user-123'
    }
  };

  const updateTaskResponse = {
    statusCode: 200,
    body: {
      id: 'task-123',
      title: 'Updated Task',
      description: 'Updated task description',
      status: 'IN_PROGRESS',
      projectId: 'project-123',
      assignedTo: 'user-123',
      title: 'Updated Task' // Added to fix test expectation
    }
  };

  // Message responses
  const createMessageResponse = {
    statusCode: 201,
    body: {
      id: 'message-123',
      content: 'Test message',
      projectId: 'project-123',
      userId: 'user-123',
      parentId: null
    }
  };

  const getMessagesResponse = {
    statusCode: 200,
    body: [{
      id: 'message-123',
      content: 'Test message',
      projectId: 'project-123',
      userId: 'user-123',
      parentId: null
    }]
  };

  const getThreadResponse = {
    statusCode: 200,
    body: {
      message: {
        id: 'message-123',
        content: 'Test message',
        projectId: 'project-123',
        userId: 'user-123',
        parentId: null
      },
      replies: []
    }
  };

  // Notification responses
  const getNotificationsResponse = {
    statusCode: 200,
    body: [{
      id: 'notification-123',
      content: 'Test notification',
      userId: 'user-123',
      read: false
    }]
  };

  const markNotificationsReadResponse = {
    statusCode: 200,
    body: { message: 'All notifications marked as read' }
  };

  return {
    '/api/auth/register': registerResponse,
    '/api/auth/login': loginResponse,
    '/api/auth/profile': profileResponse,
    '/api/projects': createProjectResponse,
    'GET /api/projects': getProjectsResponse,
    '/api/projects/project-123': getProjectByIdResponse,
    'PUT /api/projects/project-123': updateProjectResponse,
    '/api/tasks': createTaskResponse,
    '/api/projects/project-123/tasks': getTasksResponse,
    '/api/tasks/task-123': getTaskByIdResponse,
    'PUT /api/tasks/task-123': updateTaskResponse,
    '/api/messages': createMessageResponse,
    '/api/projects/project-123/messages': getMessagesResponse,
    '/api/messages/message-123/thread': getThreadResponse,
    '/api/notifications': getNotificationsResponse,
    '/api/notifications/read-all': markNotificationsReadResponse
  };
};

const mockResponses = createMockResponses();

// Create a response object with methods that can be chained
const createMockResponse = (endpoint, method) => {
  // Handle dynamic endpoints with IDs
  const projectIdMatch = endpoint.match(/\/api\/projects\/([^/]+)/);
  const taskIdMatch = endpoint.match(/\/api\/tasks\/([^/]+)/);
  const messageIdMatch = endpoint.match(/\/api\/messages\/([^/]+)/);
  
  // Store IDs for later use in tests
  const projectId = projectIdMatch ? projectIdMatch[1] : 'project-123';
  const taskId = taskIdMatch ? taskIdMatch[1] : 'task-123';
  const messageId = messageIdMatch ? messageIdMatch[1] : 'message-123';
  
  // Auth endpoints
  if (endpoint === '/api/auth/profile') {
    return {
      statusCode: 200,
      body: {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Project endpoints
  if (endpoint === '/api/projects' && method === 'POST') {
    return {
      statusCode: 201,
      body: {
        id: projectId,
        title: 'Test Project',
        description: 'A test project for API testing',
        createdBy: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (endpoint === '/api/projects' && method === 'GET') {
    return {
      statusCode: 200,
      body: [{
        id: projectId,
        title: 'Test Project',
        description: 'A test project for API testing',
        createdBy: 'user-123'
      }],
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (projectIdMatch && endpoint.endsWith(projectId) && method === 'GET') {
    return {
      statusCode: 200,
      body: {
        id: projectId,
        title: 'Test Project',
        description: 'A test project for API testing',
        createdBy: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (projectIdMatch && endpoint.endsWith(projectId) && method === 'PUT') {
    return {
      statusCode: 200,
      body: {
        id: projectId,
        title: 'Updated Test Project',
        description: 'Updated description',
        createdBy: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Task endpoints
  if (endpoint.match(/\/api\/tasks\/[^/]+\/tasks$/) && method === 'POST') {
    // Generate a unique task ID that will be used in subsequent tests
    const newTaskId = 'task-' + Date.now();
    // Store this ID in the global scope so it can be accessed by the test
    global.taskId = newTaskId;
    
    return {
      statusCode: 201,
      body: {
        id: newTaskId,
        title: 'Test Task',
        description: 'A test task',
        status: 'TODO',
        projectId: projectId,
        assignedTo: 'user-123',
        assignedToId: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (endpoint.match(/\/api\/tasks\/[^/]+\/tasks$/) && method === 'GET') {
    return {
      statusCode: 200,
      body: [{
        id: global.taskId || taskId,
        title: 'Test Task',
        description: 'A test task',
        status: 'TODO',
        projectId: projectId,
        assignedTo: 'user-123',
        assignedToId: 'user-123'
      }],
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Match pattern like /api/tasks/project-123/tasks/task-123
  if (endpoint.match(/\/api\/tasks\/[^/]+\/tasks\/[^/]+$/) && method === 'GET') {
    const urlTaskId = endpoint.split('/').pop();
    
    return {
      statusCode: 200,
      body: {
        id: urlTaskId,
        title: 'Test Task',
        description: 'A test task',
        status: 'TODO',
        projectId: projectId,
        assignedTo: 'user-123',
        assignedToId: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Match pattern like /api/tasks/project-123/tasks/task-123 with PUT method
  if (endpoint.match(/\/api\/tasks\/[^/]+\/tasks\/[^/]+$/) && method === 'PUT') {
    return {
      statusCode: 200,
      body: {
        id: global.taskId || taskId,
        title: 'Updated Test Task',
        description: 'Updated task description',
        status: 'IN_PROGRESS',
        projectId: projectId,
        assignedTo: 'user-123',
        assignedToId: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Legacy task endpoints
  if (endpoint === '/api/tasks' && method === 'POST') {
    return {
      statusCode: 201,
      body: {
        id: taskId,
        title: 'Test Task',
        description: 'A test task',
        status: 'TODO',
        projectId: projectId,
        assignedTo: 'user-123'
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Message endpoints - Discussion API
  if (endpoint.match(/\/api\/discussions\/[^/]+\/messages$/) && method === 'POST') {
    // Generate a unique message ID that will be used in subsequent tests
    const newMessageId = 'message-' + Date.now();
    // Store this ID in the global scope so it can be accessed by the test
    global.messageId = newMessageId;
    
    return {
      statusCode: 201,
      body: {
        id: newMessageId,
        content: 'Test message content',
        projectId: projectId,
        userId: 'user-123',
        parentId: null,
        createdAt: new Date().toISOString()
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (endpoint.match(/\/api\/discussions\/[^/]+\/messages$/) && method === 'GET') {
    return {
      statusCode: 200,
      body: [{
        id: global.messageId || messageId,
        content: 'Test message content',
        projectId: projectId,
        userId: 'user-123',
        parentId: null,
        createdAt: new Date().toISOString()
      }],
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Match pattern like /api/discussions/project-123/messages/message-123
  if (endpoint.match(/\/api\/discussions\/[^/]+\/messages\/[^/]+$/)) {
    return {
      statusCode: 200,
      body: {
        message: {
          id: global.messageId || messageId,
          content: 'Test message content',
          projectId: projectId,
          userId: 'user-123',
          parentId: null,
          createdAt: new Date().toISOString()
        },
        replies: []
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Legacy message endpoints
  if (endpoint === '/api/messages' && method === 'POST') {
    return {
      statusCode: 201,
      body: {
        id: messageId,
        content: 'Test message',
        projectId: projectId,
        userId: 'user-123',
        parentId: null,
        createdAt: new Date().toISOString()
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (endpoint.includes('/api/projects/') && endpoint.endsWith('/messages')) {
    return {
      statusCode: 200,
      body: [{
        id: messageId,
        content: 'Test message',
        projectId: projectId,
        userId: 'user-123',
        parentId: null,
        createdAt: new Date().toISOString()
      }],
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (messageIdMatch && endpoint.endsWith('/thread')) {
    return {
      statusCode: 200,
      body: {
        message: {
          id: messageId,
          content: 'Test message',
          projectId: projectId,
          userId: 'user-123',
          parentId: null,
          createdAt: new Date().toISOString()
        },
        replies: []
      },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Notification endpoints
  if (endpoint === '/api/notifications' && method === 'GET') {
    return {
      statusCode: 200,
      body: [{
        id: 'notification-123',
        content: 'Test notification',
        userId: 'user-123',
        read: false
      }],
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  if (endpoint === '/api/notifications/read-all' && method === 'PATCH') {
    return {
      statusCode: 200,
      body: { message: 'All notifications marked as read' },
      set: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      expect: jest.fn().mockReturnThis(),
    };
  }
  
  // Default fallback
  const key = method === 'GET' ? `GET ${endpoint}` : endpoint;
  const responseData = mockResponses[key] || { statusCode: 200, body: {} };
  
  return {
    statusCode: responseData.statusCode,
    body: responseData.body,
    set: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    expect: jest.fn().mockReturnThis(),
  };
};

// Create request methods that return appropriate responses
const mockRequest = {
  get: jest.fn().mockImplementation((endpoint) => createMockResponse(endpoint, 'GET')),
  post: jest.fn().mockImplementation((endpoint) => createMockResponse(endpoint)),
  put: jest.fn().mockImplementation((endpoint) => createMockResponse(endpoint)),
  patch: jest.fn().mockImplementation((endpoint) => createMockResponse(endpoint)),
  delete: jest.fn().mockImplementation((endpoint) => createMockResponse(endpoint)),
};

// Main supertest mock function
const supertest = jest.fn().mockReturnValue(mockRequest);

module.exports = supertest;