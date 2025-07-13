const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  getBookOrders,
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  getOrdersByDeliveryStatus,
  markAsReturned,
  updateDeliveryDetails,
  getSingleOrder,
  getBooksReturnedToMe,
  confirmReturnReceived,
  
} = require("../controllers/orderController");
const { protect } = require("../middlewares/auth");

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/received", protect, getReceivedOrders);
router.put("/:id/update-status", protect,updateOrderStatus);
router.put("/orders/:orderId/delivery-details",protect, updateDeliveryDetails);
router.delete("/:orderId", protect, deleteOrder);
router.put("/return/:orderId", protect, markAsReturned);
router.get("/orders/:orderId",protect, getSingleOrder);
router.get("/id/:orderId", protect, getOrderById);
router.get("/returned-to-me",protect, getBooksReturnedToMe);
router.put("/confirm-return/:id",protect, confirmReturnReceived);


// Admin routes
router.get("/", protect, getAllOrders);
router.get("/stats", protect, getOrderStats);
router.get("/book/:bookId", protect, getBookOrders);
router.get("/status/:status", protect, getOrdersByStatus);
router.get("/delivery/:deliveryStatus", protect, getOrdersByDeliveryStatus);

module.exports = router;
