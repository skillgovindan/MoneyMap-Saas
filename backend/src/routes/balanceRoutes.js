const express = require("express");
const balanceService = require("../services/balanceService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const balance = await balanceService.getBalance();
    res.status(200).json(balance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
