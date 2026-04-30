const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const YearlyReport = require("../models/yearlyReportModel");

const getIncomeByDateRange = (startDate, endDate) => {
  return Income.find({ date: { $gte: startDate, $lte: endDate } });
};

const getExpenseByDateRange = (startDate, endDate) => {
  return Expense.find({ date: { $gte: startDate, $lte: endDate } });
};

const createYearlyReport = (data) => {
  return YearlyReport.create(data);
};

const getAllYearlyReports = () => {
  return YearlyReport.find().sort({ createdAt: -1 });
};

module.exports = {
  getIncomeByDateRange,
  getExpenseByDateRange,
  createYearlyReport,
  getAllYearlyReports
};
