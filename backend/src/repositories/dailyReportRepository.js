const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const DailyReport = require("../models/dailyReportModel");

const getIncomeByDateRange = (startDate, endDate) => {
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

const createDailyReport = (data) => {
  return DailyReport.create(data);
};

const getAllDailyReports = () => {
  return DailyReport.find().sort({ createdAt: -1 });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
  createDailyReport,
  getAllDailyReports
};
