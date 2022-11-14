const mongoose = require("mongoose");
const shopPaymentsSchema = new mongoose.Schema({
  paymentName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  IsPayed: {
    type: Boolean,
    default: false,
  },
  invoiceNo: {
    type: String,
    required: true,
  },
  payedDate: {
    type: Date,
    required: false,
  },
});

const shopPayments = mongoose.model("shopPayments", shopPaymentsSchema);
module.exports = shopPayments;
