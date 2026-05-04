const Order = require("../model/Order");

// ✅ Create new order (called from Checkout page)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    const order = new Order({
      user: req.userId,
      userName: req.user?.name,
      userEmail: req.user?.email,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    const saved = await order.save();
    res.status(201).json({ message: "Order placed successfully", order: saved });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get ALL orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};