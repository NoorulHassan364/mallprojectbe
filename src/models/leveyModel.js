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
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    // required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  IsPayed: {
    type: Boolean,
    default: false,
  },
});

const Levey = mongoose.model("Levey", leveySchema);
module.exports = Levey;
