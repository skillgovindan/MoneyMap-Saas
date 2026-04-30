const express = require("express");
const transactionService = require("../services/transactionService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await transactionService.getTransactions(req.query);
    res.status(200).json(response);
  } catch (error) {
    if (
      error.message.includes("Invalid type") ||
      error.message.includes("must be a positive number") ||
      error.message.includes("Invalid")
    ) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
