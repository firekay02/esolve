const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireCustomer } = require('../middleware/auth');
const { validateFeedback, validateId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /api/feedback/{sessionId}:
 *   post:
 *     summary: Submit feedback for a completed session
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               feedback:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Session not eligible for feedback
 *       404:
 *         description: Session not found
 */
router.post('/:sessionId', 
  authenticateToken, 
  requireCustomer, 
  validateId, 
  validateFeedback, 
  asyncHandler(async (req, res) => {
    const sessionId = req.params.sessionId;
    const { rating, feedback } = req.body;

    // Verify session exists, belongs to user, and is completed
    const sessionResult = await query(
      'SELECT * FROM sessions WHERE id = $1 AND customer_id = $2',
      [sessionId, req.user.id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionResult.rows[0];

    if (session.status !== 'completed') {
      return res.status(400).json({ 
        error: 'Can only provide feedback for completed sessions' 
      });
    }

    if (session.rating !== null) {
      return res.status(400).json({ 
        error: 'Feedback already submitted for this session' 
      });
    }

    // Update session with feedback
    const result = await query(
      `UPDATE sessions 
       SET rating = $1, feedback = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [rating, feedback, sessionId]
    );

    res.json({
      message: 'Feedback submitted successfully',
      session: result.rows[0]
    });
  })
);

/**
 * @swagger
 * /api/feedback/technician/{technicianId}:
 *   get:
 *     summary: Get feedback for a specific technician
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: technicianId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Technician feedback retrieved successfully
 */
router.get('/technician/:technicianId', 
  authenticateToken, 
  validateId, 
  require('../middleware/validation').validatePagination, 
  asyncHandler(async (req, res) => {
    const technicianId = req.params.technicianId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Verify technician exists
    const technicianResult = await query(
      "SELECT id, name FROM users WHERE id = $1 AND role = 'technician'",
      [technicianId]
    );

    if (technicianResult.rows.length === 0) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    const technician = technicianResult.rows[0];

    // Get feedback with pagination
    const feedbackQuery = `
      SELECT s.id, s.rating, s.feedback, s.issue_type, s.created_at, s.updated_at,
             c.name as customer_name
      FROM sessions s
      LEFT JOIN users c ON s.customer_id = c.id
      WHERE s.technician_id = $1 AND s.rating IS NOT NULL
      ORDER BY s.updated_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total,
             AVG(rating) as avg_rating,
             COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
             COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
             COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
             COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
             COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
      FROM sessions
      WHERE technician_id = $1 AND rating IS NOT NULL
    `;

    const [feedbackResult, statsResult] = await Promise.all([
      query(feedbackQuery, [technicianId, limit, offset]),
      query(countQuery, [technicianId])
    ]);

    const stats = statsResult.rows[0];
    const total = parseInt(stats.total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      technician,
      feedback: feedbackResult.rows,
      stats: {
        total_reviews: total,
        avg_rating: parseFloat(stats.avg_rating) || 0,
        rating_distribution: {
          5: parseInt(stats.five_star_count),
          4: parseInt(stats.four_star_count),
          3: parseInt(stats.three_star_count),
          2: parseInt(stats.two_star_count),
          1: parseInt(stats.one_star_count)
        }
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  })
);

/**
 * @swagger
 * /api/feedback/session/{sessionId}:
 *   get:
 *     summary: Get feedback for a specific session
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Session feedback retrieved successfully
 *       404:
 *         description: Session not found or no feedback available
 */
router.get('/session/:sessionId', 
  authenticateToken, 
  validateId, 
  asyncHandler(async (req, res) => {
    const sessionId = req.params.sessionId;

    // Check user access to this session
    let whereClause = 'WHERE s.id = $1';
    const params = [sessionId];

    if (req.user.role === 'customer') {
      whereClause += ' AND s.customer_id = $2';
      params.push(req.user.id);
    } else if (req.user.role === 'technician') {
      whereClause += ' AND s.technician_id = $2';
      params.push(req.user.id);
    }

    const result = await query(
      `SELECT s.id, s.rating, s.feedback, s.issue_type, s.status, s.created_at, s.updated_at,
              c.name as customer_name,
              t.name as technician_name
       FROM sessions s
       LEFT JOIN users c ON s.customer_id = c.id
       LEFT JOIN users t ON s.technician_id = t.id
       ${whereClause}`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = result.rows[0];

    if (session.rating === null) {
      return res.status(404).json({ error: 'No feedback available for this session' });
    }

    res.json({ feedback: session });
  })
);

module.exports = router;