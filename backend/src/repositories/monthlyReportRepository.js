const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const MonthlyReport = require("../models/monthlyReportModel");

const getIncomeByDateRange = (startDate, endDate) => {
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

const createMonthlyReport = (data) => {
  return MonthlyReport.create(data);
};

const getAllMonthlyReports = () => {
  return MonthlyReport.find().sort({ createdAt: -1 });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
  createMonthlyReport,
  getAllMonthlyReports
};
