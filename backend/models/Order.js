const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["not started", "in progress", "delivered"],
      default: "not started",
    },
    returned: {
      type: Boolean,
      default: false,
    },
      returnConfirmed: {
      type: Boolean,
      default: false,
    },
    deliveryDetails: {
      fullName: { type: String },
      address: { type: String },
      pinCode: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
