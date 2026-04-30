const mongoose = require("mongoose");
const weeklyReportSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    incomeCount: { type: Number, default: 0 },
    expenseCount: { type: Number, default: 0 },
    generatedAt: { type: Date, default: Date.now },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true }
  },
  { timestamps: true }
);
module.exports = mongoose.model("WeeklyReport", weeklyReportSchema);
