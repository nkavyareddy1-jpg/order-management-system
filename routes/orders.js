const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");

const router = express.Router();

// GET /api/orders - get all orders, with optional search and status filter.
router.get("/", async (req, res) => {
  try {
    const { search = "", status = "All" } = req.query;
    const filter = {};

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { customerName: { $regex: safeSearch, $options: "i" } },
        { product: { $regex: safeSearch, $options: "i" } }
      ];
    }

    if (status !== "All") filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch orders" });
  }
});

// GET /api/orders/:id - get one order.
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not fetch order" });
  }
});

// POST /api/orders - create an order.
router.post("/", async (req, res) => {
  try {
    const { customerName, product, quantity, price, status } = req.body;
    const order = await Order.create({ customerName, product, quantity, price, status });
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    const message = error.name === "ValidationError"
      ? Object.values(error.errors).map(item => item.message).join(", ")
      : "Could not create order";
    res.status(400).json({ success: false, message });
  }
});

// PUT /api/orders/:id - update an order.
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    const allowed = ["customerName", "product", "quantity", "price", "status"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order updated successfully", data: order });
  } catch (error) {
    const message = error.name === "ValidationError"
      ? Object.values(error.errors).map(item => item.message).join(", ")
      : "Could not update order";
    res.status(400).json({ success: false, message });
  }
});

// DELETE /api/orders/:id - delete an order.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not delete order" });
  }
});

module.exports = router;
