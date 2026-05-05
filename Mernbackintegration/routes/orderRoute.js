const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getSalesAnalytics,
} = require('../controller/orderController');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ── Admin: analytics MUST come before /:id ──
router.get('/analytics', authenticate, adminOnly, getSalesAnalytics); // GET /api/orders/analytics

// ── Admin: all orders ──
router.get('/all', authenticate, adminOnly, getAllOrders);             // GET /api/orders/all

// ── User: my orders ──
router.get('/my', authenticate, getMyOrders);                         // GET /api/orders/my

// ── User: place order ──
router.post('/', authenticate, createOrder);                          // POST /api/orders

// ── Admin: update order status ──
router.put('/:id', authenticate, adminOnly, updateOrderStatus);       // PUT /api/orders/:id

module.exports = router;