const Order = require("../models/Order");
const Book = require("../models/Book");

// 📥 Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { bookId, toUser, deliveryDetails } = req.body;

    if (toUser === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot order your own book" });
    }

    const existingOrder = await Order.findOne({
      bookId,
      fromUser: req.user._id,
      status: "pending",
    });

    if (existingOrder) {
      return res
        .status(400)
        .json({ message: "You already requested this book." });
    }

    const order = await Order.create({
      bookId,
      fromUser: req.user._id,
      toUser,
      deliveryDetails, // ✅ Save delivery info
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// 📦 Get orders placed by the user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ fromUser: req.user._id })
      .populate("bookId")
      .populate("toUser", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get your orders" });
  }
};

// 📤 Get orders received for the user's books
exports.getReceivedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ toUser: req.user._id })
      .populate("bookId")
      .populate("fromUser", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get received orders" });
  }
};

// 🔄 Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update fields only if values are provided
    if (status) order.status = status;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;

    await order.save();

    res.json({ message: "Order updated successfully", order });
  } catch (err) {
    console.error("❌ Order update failed:", err);
    res
      .status(500)
      .json({ message: "Failed to update order", error: err.message });
  }
};

// 📌 Update delivery details
exports.updateDeliveryDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryDetails } = req.body;

    if (
      !deliveryDetails ||
      !deliveryDetails.fullName ||
      !deliveryDetails.phone ||
      !deliveryDetails.pinCode ||
      !deliveryDetails.address
    ) {
      return res
        .status(400)
        .json({ message: "All delivery fields are required." });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryDetails = deliveryDetails;
    await order.save();

    res.status(200).json({ message: "Delivery details updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to update delivery details",
        error: err.message,
      });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("bookId", "title author")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Get Order Error:", err.message);
    res.status(500).json({ message: "Server error while fetching order" });
  }
};

// 🗑️ Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.fromUser.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own orders" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// 📊 Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const returnedBooks = await Order.countDocuments({ returned: true });
    const deliveredBooks = await Order.countDocuments({
      deliveryStatus: "delivered",
    });

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      deliveredBooks,
      returnedBooks,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get order statistics" });
  }
};

// 📚 Get all orders for a specific book
exports.getBookOrders = async (req, res) => {
  try {
    const { bookId } = req.params;

    const orders = await Order.find({ bookId })
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this book" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get book orders" });
  }
};

// 🗃 Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("bookId")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all orders" });
  }
};

// 📄 Get order by ID (admin or owner)
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("bookId")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      order.fromUser._id.toString() !== req.user._id.toString() &&
      order.toUser._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order details" });
  }
};

// 🔎 Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await Order.find({ status })
      .populate("bookId")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: `No orders found with status ${status}` });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders by status" });
  }
};

// 🚚 Get orders by delivery status
exports.getOrdersByDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.params;

    const orders = await Order.find({ deliveryStatus })
      .populate("bookId")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: `No orders with delivery status ${deliveryStatus}` });
    }

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get orders by delivery status" });
  }
};

// 🔁 Mark order as returned
exports.markAsReturned = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.fromUser.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only return your own orders" });
    }

    if (order.deliveryStatus !== "delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered books can be returned" });
    }

    order.returned = true;
    await order.save();

    res.json({ message: "Book marked as returned", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to return book" });
  }
};
// 📦 Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      $or: [{ fromUser: userId }, { toUser: userId }],
    })
      .populate("bookId")
      .populate("fromUser", "name email")
      .populate("toUser", "name email");
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: " Failed to get orders by user ID",
      error: error.message,
    });
  }
};
// controllers/orderController.js
exports.getBooksReturnedToMe = async (req, res) => {
  try {
    const orders = await Order.find({
      toUser: req.user._id,       // You are the owner
      returned: true,             // Returned by borrower
      returnConfirmed: false      // But you haven't confirmed yet
    })
      .populate("bookId")
      .populate("fromUser");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch returned books." });
  }
};
exports.confirmReturnReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || String(order.toUser) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.returnConfirmed = true;
    await order.save();

    res.json({ message: "✅ Book return confirmed successfully." });
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to confirm book return." });
  }
};



