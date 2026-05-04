const express = require("express");
const incomeService = require("../services/incomeService");

const router = express.Router();

// Error response helper
const handleErrorResponse = (error, res) => {
  if (error.message === "Income record not found") {
    return res.status(404).json({ message: error.message });
  }
  if (
    error.message.includes("Amount must be greater than 0") ||
    error.message.includes("Missing required fields")
  ) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

// All routes receive req.tenantDb from tenantMiddleware (applied in server.js)

router.post("/", async (req, res) => {
  try {
    const newIncome = await incomeService.createIncome(req.tenantDb, req.body);
    res.status(201).json(newIncome);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const incomes = await incomeService.getAllIncome(req.tenantDb);
    res.status(200).json(incomes);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const income = await incomeService.getIncomeById(req.tenantDb, req.params.id);
    res.status(200).json(income);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedIncome = await incomeService.updateIncomeById(
      req.tenantDb,
      req.params.id,
      req.body
    );
    res.status(200).json(updatedIncome);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const patchedIncome = await incomeService.patchIncomeById(
      req.tenantDb,
      req.params.id,
      req.body
    );
    res.status(200).json(patchedIncome);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedIncome = await incomeService.deleteIncomeById(req.tenantDb, req.params.id);
    res.status(200).json(deletedIncome);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

module.exports = router;
