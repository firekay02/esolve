const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { query, getClient } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create payment intent for a session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session_id
 *               - amount
 *             properties:
 *               session_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 description: Amount in cents
 *               currency:
 *                 type: string
 *                 default: usd
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       404:
 *         description: Session not found
 */
router.post('/create-intent', authenticateToken, asyncHandler(async (req, res) => {
  const { session_id, amount, currency = 'usd' } = req.body;

  if (!session_id || !amount) {
    return res.status(400).json({ error: 'Session ID and amount are required' });
  }

  // Verify session exists and user has access
  const sessionResult = await query(
    'SELECT * FROM sessions WHERE id = $1 AND customer_id = $2',
    [session_id, req.user.id]
  );

  if (sessionResult.rows.length === 0) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const session = sessionResult.rows[0];

  // Check if payment already exists for this session
  const existingPayment = await query(
    'SELECT * FROM transactions WHERE session_id = $1 AND status IN ($2, $3)',
    [session_id, 'completed', 'pending']
  );

  if (existingPayment.rows.length > 0) {
    return res.status(400).json({ error: 'Payment already exists for this session' });
  }

  try {
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        session_id: session_id.toString(),
        user_id: req.user.id.toString()
      }
    });

    // Create transaction record
    const transactionResult = await query(
      `INSERT INTO transactions (user_id, session_id, amount, currency, stripe_payment_id, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [req.user.id, session_id, amount, currency, paymentIntent.id]
    );

    res.json({
      client_secret: paymentIntent.client_secret,
      transaction: transactionResult.rows[0]
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(400).json({ error: 'Failed to create payment intent' });
  }
}));

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment completion
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_intent_id
 *             properties:
 *               payment_intent_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 */
router.post('/confirm', authenticateToken, asyncHandler(async (req, res) => {
  const { payment_intent_id } = req.body;

  if (!payment_intent_id) {
    return res.status(400).json({ error: 'Payment intent ID is required' });
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Update transaction status
    const result = await query(
      `UPDATE transactions 
       SET status = 'completed', payment_method = $1, updated_at = NOW()
       WHERE stripe_payment_id = $2 AND user_id = $3
       RETURNING *`,
      [paymentIntent.payment_method_types[0], payment_intent_id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      message: 'Payment confirmed successfully',
      transaction: result.rows[0]
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(400).json({ error: 'Failed to confirm payment' });
  }
}));

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update transaction status
      await query(
        `UPDATE transactions 
         SET status = 'completed', updated_at = NOW()
         WHERE stripe_payment_id = $1`,
        [paymentIntent.id]
      );
      
      console.log('Payment succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      
      // Update transaction status
      await query(
        `UPDATE transactions 
         SET status = 'failed', updated_at = NOW()
         WHERE stripe_payment_id = $1`,
        [failedPayment.id]
      );
      
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}));

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get payment history for current user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *           default: 10
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 */
router.get('/history', 
  authenticateToken, 
  require('../middleware/validation').validatePagination, 
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const paymentsQuery = `
      SELECT t.*, s.issue_type, s.scheduled_time
      FROM transactions t
      LEFT JOIN sessions s ON t.session_id = s.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM transactions
      WHERE user_id = $1
    `;

    const [paymentsResult, countResult] = await Promise.all([
      query(paymentsQuery, [req.user.id, limit, offset]),
      query(countQuery, [req.user.id])
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      payments: paymentsResult.rows,
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
 * /api/payments/{id}/refund:
 *   post:
 *     summary: Request refund for a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for refund request
 *     responses:
 *       200:
 *         description: Refund processed successfully
 */
router.post('/:id/refund', 
  authenticateToken, 
  validateId, 
  asyncHandler(async (req, res) => {
    const transactionId = req.params.id;
    const { reason } = req.body;

    // Get transaction details
    const transactionResult = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [transactionId, req.user.id]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactionResult.rows[0];

    if (transaction.status !== 'completed') {
      return res.status(400).json({ error: 'Can only refund completed payments' });
    }

    if (transaction.status === 'refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    try {
      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: transaction.stripe_payment_id,
        reason: 'requested_by_customer',
        metadata: {
          reason: reason || 'Customer requested refund'
        }
      });

      // Update transaction status
      await query(
        `UPDATE transactions 
         SET status = 'refunded', refund_reason = $1, updated_at = NOW()
         WHERE id = $2`,
        [reason, transactionId]
      );

      res.json({
        message: 'Refund processed successfully',
        refund_id: refund.id
      });
    } catch (error) {
      console.error('Refund error:', error);
      res.status(400).json({ error: 'Failed to process refund' });
    }
  })
);

module.exports = router;