/**
 * Error handling middleware
 * Catches all errors and sends appropriate response
 */

const errorHandler = (err, req, res, next) => {
  // Default error status and message
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  // Log error for debugging
  console.error(`Error: ${message}`);
  console.error(err.stack);
  
  // Determine error type and customize response
  let errorResponse = {
    success: false,
    message: message,
  };
  
  // Add validation errors if available
  if (err.errors) {
    errorResponse.errors = err.errors;
  }
  
  // Add specific error code if available
  if (err.code) {
    errorResponse.code = err.code;
  }
  
  // Send error response
  res.status(status).json(errorResponse);
};

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, statusCode, errors = null, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message, errors = null) {
    return new ApiError(message, 400, errors);
  }
  
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(message, 401);
  }
  
  static forbidden(message = 'Forbidden') {
    return new ApiError(message, 403);
  }
  
  static notFound(message = 'Resource not found') {
    return new ApiError(message, 404);
  }
  
  static conflict(message) {
    return new ApiError(message, 409);
  }
  
  static internal(message = 'Internal server error') {
    return new ApiError(message, 500);
  }
}

module.exports = {
  errorHandler,
  ApiError
};