const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  updateOrderStatus,
  deleteOrder,
  markAsReturned,
  updateDeliveryDetails,
  getBooksReturnedToMe,
  confirmReturnReceived,
  
} = require("../controllers/orderController");
const { protect } = require("../middlewares/auth");

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/received", protect, getReceivedOrders);
router.put("/:id/update-status", protect,updateOrderStatus);
router.put("/:orderId/delivery-details",protect, updateDeliveryDetails);
router.delete("/:orderId", protect, deleteOrder);
router.put("/return/:orderId", protect, markAsReturned);
router.get("/returned-to-me",protect, getBooksReturnedToMe);
router.put("/confirm-return/:id",protect, confirmReturnReceived);


module.exports = router;
