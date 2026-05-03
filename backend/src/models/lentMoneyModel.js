const mongoose = require("mongoose");

const lentMoneySchema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    takenDate: {
      type: Date,
      required: true,
    },
    payingDate: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LentMoney", lentMoneySchema);
