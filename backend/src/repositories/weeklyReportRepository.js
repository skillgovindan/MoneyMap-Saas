const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const WeeklyReport = require("../models/weeklyReportModel");

const getIncomeByDateRange = (startDate, endDate) => {
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

const createWeeklyReport = (data) => {
  return WeeklyReport.create(data);
};

const getAllWeeklyReports = () => {
  return WeeklyReport.find().sort({ createdAt: -1 });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
  createWeeklyReport,
  getAllWeeklyReports
};
