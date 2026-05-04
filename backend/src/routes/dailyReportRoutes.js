const express = require("express");
const dailyReportService = require("../services/dailyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const report = await dailyReportService.getDailyReport(req.tenantDb, date);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
