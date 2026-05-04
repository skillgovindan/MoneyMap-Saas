const express = require("express");
const yearlyReportService = require("../services/yearlyReportService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { year } = req.query;
    const report = await yearlyReportService.getYearlyReport(req.tenantDb, year);
    res.status(200).json(report);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
