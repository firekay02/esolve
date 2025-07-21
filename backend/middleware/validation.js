const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['customer', 'technician'])
    .withMessage('Role must be either customer or technician'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Session validation rules
const validateSessionBooking = [
  body('issue_type')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Issue type is required and must be less than 100 characters'),
  body('issue_description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Issue description must be between 10 and 1000 characters'),
  body('scheduled_time')
    .isISO8601()
    .withMessage('Valid scheduled time is required')
    .custom((value) => {
      const scheduledTime = new Date(value);
      const now = new Date();
      if (scheduledTime <= now) {
        throw new Error('Scheduled time must be in the future');
      }
      return true;
    }),
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Urgency must be one of: low, medium, high, urgent'),
  handleValidationErrors
];

const validateSessionUpdate = [
  body('status')
    .optional()
    .isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('remote_link')
    .optional()
    .isURL()
    .withMessage('Remote link must be a valid URL'),
  body('technician_notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Technician notes must be less than 1000 characters'),
  handleValidationErrors
];

// Feedback validation rules
const validateFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback must be less than 1000 characters'),
  handleValidationErrors
];

// Parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateSessionBooking,
  validateSessionUpdate,
  validateFeedback,
  validateId,
  validatePagination
};