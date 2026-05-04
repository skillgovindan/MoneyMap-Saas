const express = require("express");
const weeklyReportService = require("../services/weeklyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await weeklyReportService.getWeeklyReport(req.tenantDb, startDate, endDate);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
