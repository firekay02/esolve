const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validatePagination, validateId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, email, role, created_at, last_login,
            (SELECT COUNT(*) FROM sessions WHERE customer_id = $1) as total_sessions,
            (SELECT COUNT(*) FROM sessions WHERE customer_id = $1 AND status = 'completed') as completed_sessions
     FROM users WHERE id = $1`,
    [req.user.id]
  );

  res.json({ user: result.rows[0] });
}));

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const updates = [];
  const params = [];
  let paramCount = 1;

  if (name) {
    updates.push(`name = $${paramCount++}`);
    params.push(name.trim());
  }

  if (email) {
    // Check if email is already taken by another user
    const emailCheck = await query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, req.user.id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    updates.push(`email = $${paramCount++}`);
    params.push(email.toLowerCase().trim());
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  updates.push(`updated_at = NOW()`);
  params.push(req.user.id);

  const result = await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} 
     RETURNING id, name, email, role, created_at, updated_at`,
    params
  );

  res.json({
    message: 'Profile updated successfully',
    user: result.rows[0]
  });
}));

/**
 * @swagger
 * /api/users/technicians:
 *   get:
 *     summary: Get list of available technicians (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: Technicians list retrieved successfully
 */
router.get('/technicians', 
  authenticateToken, 
  requireAdmin, 
  validatePagination, 
  asyncHandler(async (req, res) => {
    const { available, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE role = 'technician' AND active = true";
    const params = [limit, offset];

    if (available === 'true') {
      // Technicians with no active sessions or less than 3 active sessions
      whereClause += ` AND (
        SELECT COUNT(*) FROM sessions 
        WHERE technician_id = users.id 
        AND status IN ('assigned', 'in_progress')
      ) < 3`;
    }

    const techniciansQuery = `
      SELECT u.id, u.name, u.email, u.created_at,
             COUNT(s.id) as total_sessions,
             COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
             AVG(s.rating) as avg_rating,
             COUNT(CASE WHEN s.status IN ('assigned', 'in_progress') THEN 1 END) as active_sessions
      FROM users u
      LEFT JOIN sessions s ON u.id = s.technician_id
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY avg_rating DESC NULLS LAST, completed_sessions DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause.replace(/GROUP BY.*|ORDER BY.*|LIMIT.*|OFFSET.*/g, '')}
    `;

    const [techniciansResult, countResult] = await Promise.all([
      query(techniciansQuery, params),
      query(countQuery, [])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      technicians: techniciansResult.rows,
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
 * /api/users/{id}/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 */
router.get('/:id/stats', 
  authenticateToken, 
  validateId, 
  asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Check if user can access these stats
    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await query(
      `SELECT 
         u.id, u.name, u.email, u.role,
         COUNT(s.id) as total_sessions,
         COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
         COUNT(CASE WHEN s.status = 'cancelled' THEN 1 END) as cancelled_sessions,
         AVG(CASE WHEN s.rating IS NOT NULL THEN s.rating END) as avg_rating,
         SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as total_revenue
       FROM users u
       LEFT JOIN sessions s ON (
         (u.role = 'customer' AND s.customer_id = u.id) OR
         (u.role = 'technician' AND s.technician_id = u.id)
       )
       LEFT JOIN transactions t ON s.id = t.session_id
       WHERE u.id = $1
       GROUP BY u.id, u.name, u.email, u.role`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ stats: result.rows[0] });
  })
);

module.exports = router;