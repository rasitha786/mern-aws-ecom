const express = require("express");
const { authenticate, adminOnly } = require("../middleware/auth");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderController");

const router = express.Router();

// User routes
router.post("/orders", authenticate, createOrder);
router.get("/orders/my", authenticate, getMyOrders);

// Admin routes
router.get("/orders/all", authenticate, adminOnly, getAllOrders);
router.put("/orders/:id/status", authenticate, adminOnly, updateOrderStatus);

module.exports = router;