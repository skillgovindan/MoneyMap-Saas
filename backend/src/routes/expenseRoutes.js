const express = require("express");
const expenseService = require("../services/expenseService");

const router = express.Router();

// Error response helper
const handleErrorResponse = (error, res) => {
  if (error.message === "Expense record not found") {
    return res.status(404).json({ message: error.message });
  }
  if (error.message.includes("Amount must be greater than 0") || error.message.includes("Missing required fields")) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

router.post("/", async (req, res) => {
  try {
    const newExpense = await expenseService.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpense();
    res.status(200).json(expenses);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    res.status(200).json(expense);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await expenseService.updateExpenseById(req.params.id, req.body);
    res.status(200).json(updatedExpense);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const patchedExpense = await expenseService.patchExpenseById(req.params.id, req.body);
    res.status(200).json(patchedExpense);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedExpense = await expenseService.deleteExpenseById(req.params.id);
    res.status(200).json(deletedExpense);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

module.exports = router;
