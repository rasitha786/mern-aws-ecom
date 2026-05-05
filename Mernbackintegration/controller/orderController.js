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
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
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

// ✅ Sales Analytics (admin only)
exports.getSalesAnalytics = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // Total stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const deliveredOrders = orders.filter(o => o.orderStatus === "Delivered").length;
    const pendingOrders = orders.filter(o => o.orderStatus === "Processing").length;

    // Monthly revenue — last 6 months
    const monthlyData = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyData[key] = 0;
    }
    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (monthlyData[key] !== undefined) {
        monthlyData[key] += order.totalAmount || 0;
      }
    });

    // Order status breakdown
    const statusCounts = {
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((o) => {
      if (statusCounts[o.orderStatus] !== undefined) {
        statusCounts[o.orderStatus]++;
      }
    });

    res.json({
      totalOrders,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
      monthlyData,
      statusCounts,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Server error" });
  }
};