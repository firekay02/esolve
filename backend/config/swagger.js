const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FixItNow API',
      version: '1.0.0',
      description: 'Backend API for FixItNow remote tech support platform',
      contact: {
        name: 'FixItNow Support',
        email: 'support@fixitnow.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.fixitnow.com' 
          : `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['customer', 'technician', 'admin'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Session: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            customer_id: { type: 'integer' },
            technician_id: { type: 'integer' },
            issue_type: { type: 'string' },
            issue_description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'] },
            scheduled_time: { type: 'string', format: 'date-time' },
            remote_link: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            feedback: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            session_id: { type: 'integer' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            payment_method: { type: 'string' },
            stripe_payment_id: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'FixItNow API Documentation'
  }));
};

module.exports = { setupSwagger, specs };