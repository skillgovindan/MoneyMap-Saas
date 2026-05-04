const express = require("express");
const monthlyReportService = require("../services/monthlyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    const report = await monthlyReportService.getMonthlyReport(req.tenantDb, year, month);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
