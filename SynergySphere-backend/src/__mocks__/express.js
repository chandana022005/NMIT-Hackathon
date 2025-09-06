// Mock Express for testing

const router = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
};

const express = jest.fn(() => {
  const app = {
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    listen: jest.fn().mockImplementation(() => ({
      close: jest.fn(cb => cb())
    })),
    address: jest.fn().mockReturnValue({ port: 3000 })
  };
  return app;
});

// Add Router method to express
express.Router = jest.fn(() => router);

// Add middleware functions
express.json = jest.fn(() => (req, res, next) => next());
express.urlencoded = jest.fn(() => (req, res, next) => next());
express.static = jest.fn(() => (req, res, next) => next());

module.exports = express;