const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    default: "0000",
  },
  address: {
    type: String,
    default: "Not provided",
  },
  avatar: {
    type: String,
    default:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  },
  phone: {
    type:Number,
    default: "Not provided",
  },

  role: { type: String, enum: ["user", "admin"], default: "user" },

  membershipLevel: { type: String, default: "Bronze" },
});

module.exports = mongoose.model("User", userSchema);
