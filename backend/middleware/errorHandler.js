const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  };

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error = {
          message: 'Resource already exists',
          status: 409,
          details: err.detail
        };
        break;
      case '23503': // Foreign key violation
        error = {
          message: 'Referenced resource does not exist',
          status: 400,
          details: err.detail
        };
        break;
      case '23502': // Not null violation
        error = {
          message: 'Required field is missing',
          status: 400,
          details: err.detail
        };
        break;
      case '22P02': // Invalid input syntax
        error = {
          message: 'Invalid input format',
          status: 400
        };
        break;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      status: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      status: 401
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error = {
      message: 'Validation failed',
      status: 400,
      details: err.details
    };
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    error = {
      message: 'Payment processing error',
      status: 400,
      details: err.message
    };
  }

  // Send error response
  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};