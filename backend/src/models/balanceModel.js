const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema(
  {
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    currentBalance: { type: Number, default: 0 },
    calculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Balance", balanceSchema);
