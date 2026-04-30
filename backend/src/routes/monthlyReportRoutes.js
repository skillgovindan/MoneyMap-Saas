const express = require("express");
const monthlyReportService = require("../services/monthlyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const report = await monthlyReportService.generateMonthlyReport(req.query.year, req.query.month);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("Missing required") || error.message.includes("Invalid")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
