const express = require('express');
const { query, getClient } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateId, validatePagination } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSessionAssignmentEmail } = require('../services/emailService');

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/dashboard', authenticateToken, requireAdmin, asyncHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
      (SELECT COUNT(*) FROM users WHERE role = 'technician') as total_technicians,
      (SELECT COUNT(*) FROM sessions) as total_sessions,
      (SELECT COUNT(*) FROM sessions WHERE status = 'pending') as pending_sessions,
      (SELECT COUNT(*) FROM sessions WHERE status = 'in_progress') as active_sessions,
      (SELECT COUNT(*) FROM sessions WHERE status = 'completed') as completed_sessions,
      (SELECT SUM(amount) FROM transactions WHERE status = 'completed') as total_revenue,
      (SELECT AVG(rating) FROM sessions WHERE rating IS NOT NULL) as avg_rating,
      (SELECT COUNT(*) FROM sessions WHERE created_at >= NOW() - INTERVAL '30 days') as sessions_last_30_days,
      (SELECT SUM(amount) FROM transactions WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '30 days') as revenue_last_30_days
  `;

  const result = await query(statsQuery);
  const stats = result.rows[0];

  // Get recent sessions
  const recentSessionsResult = await query(`
    SELECT s.*, 
           c.name as customer_name, c.email as customer_email,
           t.name as technician_name
    FROM sessions s
    LEFT JOIN users c ON s.customer_id = c.id
    LEFT JOIN users t ON s.technician_id = t.id
    ORDER BY s.created_at DESC
    LIMIT 10
  `);

  res.json({
    stats: {
      ...stats,
      total_revenue: parseFloat(stats.total_revenue) || 0,
      revenue_last_30_days: parseFloat(stats.revenue_last_30_days) || 0,
      avg_rating: parseFloat(stats.avg_rating) || 0
    },
    recent_sessions: recentSessionsResult.rows
  });
}));

/**
 * @swagger
 * /api/admin/sessions:
 *   get:
 *     summary: Get all sessions with filters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, assigned, in_progress, completed, cancelled]
 *       - in: query
 *         name: technician_id
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
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: Sessions retrieved successfully
 */
router.get('/sessions', 
  authenticateToken, 
  requireAdmin, 
  validatePagination, 
  asyncHandler(async (req, res) => {
    const { status, technician_id, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [limit, offset];
    let paramCount = 3;

    const conditions = [];
    if (status) {
      conditions.push(`s.status = $${paramCount++}`);
      params.push(status);
    }

    if (technician_id) {
      conditions.push(`s.technician_id = $${paramCount++}`);
      params.push(technician_id);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const sessionsQuery = `
      SELECT s.*, 
             c.name as customer_name, c.email as customer_email,
             t.name as technician_name, t.email as technician_email
      FROM sessions s
      LEFT JOIN users c ON s.customer_id = c.id
      LEFT JOIN users t ON s.technician_id = t.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sessions s
      ${whereClause}
    `;

    const [sessionsResult, countResult] = await Promise.all([
      query(sessionsQuery, params),
      query(countQuery, params.slice(2)) // Remove limit and offset for count
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      sessions: sessionsResult.rows,
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
 * /api/admin/sessions/{id}/assign:
 *   post:
 *     summary: Assign technician to a session
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - technician_id
 *             properties:
 *               technician_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 *       404:
 *         description: Session or technician not found
 */
router.post('/sessions/:id/assign', 
  authenticateToken, 
  requireAdmin, 
  validateId, 
  asyncHandler(async (req, res) => {
    const sessionId = req.params.id;
    const { technician_id } = req.body;

    if (!technician_id) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const client = await getClient();

    try {
      await client.query('BEGIN');

      // Verify session exists and is assignable
      const sessionResult = await client.query(
        'SELECT * FROM sessions WHERE id = $1',
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Session not found' });
      }

      const session = sessionResult.rows[0];

      if (!['pending', 'assigned'].includes(session.status)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: `Cannot assign technician to session with status: ${session.status}` 
        });
      }

      // Verify technician exists and is active
      const technicianResult = await client.query(
        "SELECT * FROM users WHERE id = $1 AND role = 'technician' AND active = true",
        [technician_id]
      );

      if (technicianResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Technician not found or inactive' });
      }

      const technician = technicianResult.rows[0];

      // Check technician workload
      const workloadResult = await client.query(
        `SELECT COUNT(*) as active_sessions 
         FROM sessions 
         WHERE technician_id = $1 AND status IN ('assigned', 'in_progress')`,
        [technician_id]
      );

      const activeSessionsCount = parseInt(workloadResult.rows[0].active_sessions);
      if (activeSessionsCount >= 3) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          error: 'Technician has reached maximum concurrent sessions (3)' 
        });
      }

      // Assign technician to session
      const updateResult = await client.query(
        `UPDATE sessions 
         SET technician_id = $1, status = 'assigned', updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [technician_id, sessionId]
      );

      await client.query('COMMIT');

      // Get customer details for email
      const customerResult = await query(
        'SELECT name, email FROM users WHERE id = $1',
        [session.customer_id]
      );

      const customer = customerResult.rows[0];

      // Send assignment email
      sendSessionAssignmentEmail(
        customer.email, 
        customer.name, 
        technician.name, 
        updateResult.rows[0]
      ).catch(console.error);

      res.json({
        message: 'Technician assigned successfully',
        session: updateResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  })
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with filters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, technician, admin]
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', 
  authenticateToken, 
  requireAdmin, 
  validatePagination, 
  asyncHandler(async (req, res) => {
    const { role, active, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [limit, offset];
    let paramCount = 3;

    const conditions = [];
    
    if (role) {
      conditions.push(`role = $${paramCount++}`);
      params.push(role);
    }

    if (active !== undefined) {
      conditions.push(`active = $${paramCount++}`);
      params.push(active === 'true');
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramCount} OR email ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const usersQuery = `
      SELECT u.id, u.name, u.email, u.role, u.active, u.created_at, u.last_login,
             COUNT(s.id) as total_sessions,
             COUNT(CASE WHEN s.status = 'completed' THEN 1 END) as completed_sessions,
             AVG(s.rating) as avg_rating
      FROM users u
      LEFT JOIN sessions s ON (
        (u.role = 'customer' AND s.customer_id = u.id) OR
        (u.role = 'technician' AND s.technician_id = u.id)
      )
      ${whereClause}
      GROUP BY u.id, u.name, u.email, u.role, u.active, u.created_at, u.last_login
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users u
      ${whereClause}
    `;

    const [usersResult, countResult] = await Promise.all([
      query(usersQuery, params),
      query(countQuery, params.slice(2)) // Remove limit and offset for count
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users: usersResult.rows,
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
 * /api/admin/users/{id}/toggle-status:
 *   post:
 *     summary: Toggle user active status
 *     tags: [Admin]
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
 *         description: User status updated successfully
 */
router.post('/users/:id/toggle-status', 
  authenticateToken, 
  requireAdmin, 
  validateId, 
  asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Prevent admin from deactivating themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    const result = await query(
      'UPDATE users SET active = NOT active, updated_at = NOW() WHERE id = $1 RETURNING id, name, email, role, active',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user: result.rows[0]
    });
  })
);

/**
 * @swagger
 * /api/admin/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: monthly
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 */
router.get('/revenue', 
  authenticateToken, 
  requireAdmin, 
  asyncHandler(async (req, res) => {
    const { period = 'monthly', start_date, end_date } = req.query;

    let dateFormat, dateInterval;
    switch (period) {
      case 'daily':
        dateFormat = 'YYYY-MM-DD';
        dateInterval = '1 day';
        break;
      case 'weekly':
        dateFormat = 'YYYY-"W"WW';
        dateInterval = '1 week';
        break;
      case 'monthly':
      default:
        dateFormat = 'YYYY-MM';
        dateInterval = '1 month';
        break;
    }

    let dateFilter = '';
    const params = [];
    
    if (start_date && end_date) {
      dateFilter = 'WHERE t.created_at BETWEEN $1 AND $2';
      params.push(start_date, end_date);
    } else {
      // Default to last 12 periods
      dateFilter = `WHERE t.created_at >= NOW() - INTERVAL '12 ${dateInterval.split(' ')[1]}'`;
    }

    const revenueQuery = `
      SELECT 
        TO_CHAR(t.created_at, '${dateFormat}') as period,
        SUM(CASE WHEN t.status = 'completed' THEN t.amount ELSE 0 END) as revenue,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_transactions,
        COUNT(*) as total_transactions
      FROM transactions t
      ${dateFilter}
      GROUP BY TO_CHAR(t.created_at, '${dateFormat}')
      ORDER BY period DESC
    `;

    const result = await query(revenueQuery, params);

    res.json({
      period,
      data: result.rows.map(row => ({
        ...row,
        revenue: parseFloat(row.revenue) || 0
      }))
    });
  })
);

module.exports = router;