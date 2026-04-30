const express = require("express");
const weeklyReportService = require("../services/weeklyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const report = await weeklyReportService.generateWeeklyReport(req.query.startDate, req.query.endDate);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("Missing required") || error.message.includes("Invalid")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
