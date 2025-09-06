// Mock auth middleware for testing

const verifyToken = jest.fn((req, res, next) => {
  req.user = { id: 'mock-user-id' };
  next();
});

const isProjectMember = jest.fn((req, res, next) => {
  next();
});

const isProjectCreator = jest.fn((req, res, next) => {
  next();
});

module.exports = {
  verifyToken,
  isProjectMember,
  isProjectCreator
};