const incomeSchema = require("../models/incomeModel");

// All functions receive tenantDb — DB operations only, no business logic

const createIncome = (tenantDb, data) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.create(data);
};

const getAllIncome = (tenantDb) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.find()
    .populate("paymentMethod", "name description isActive")
    .sort({ createdAt: -1 });
};

const getIncomeById = (tenantDb, id) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.findById(id).populate("paymentMethod", "name description isActive");
};

const updateIncomeById = (tenantDb, id, data) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
    "paymentMethod",
    "name description isActive"
  );
};

const patchIncomeById = (tenantDb, id, data) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
    "paymentMethod",
    "name description isActive"
  );
};

const deleteIncomeById = (tenantDb, id) => {
  const Income = tenantDb.model("Income", incomeSchema);
  return Income.findByIdAndDelete(id);
};

module.exports = {
  createIncome,
  getAllIncome,
  getIncomeById,
  updateIncomeById,
  patchIncomeById,
  deleteIncomeById,
};
