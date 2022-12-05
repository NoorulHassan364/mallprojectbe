const mongoose = require("mongoose");
const leveySchema = new mongoose.Schema({
  leveyBillName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  attachment: {
    type: String,
    // requirejd: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  IsPayed: {
    type: Boolean,
    default: false,
  },
  invoiceNo: {
    type: String,
    required: false,
  },
  payedDate: {
    type: Date,
    required: false,
  },
});

const Levey = mongoose.model("Levey", leveySchema);
module.exports = Levey;
