const express = require("express");
const router = express.Router();
const lentMoneyService = require("../services/lentMoneyService");

router.post("/", async (req, res) => {
  try {
    const record = await lentMoneyService.createLentMoney(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await lentMoneyService.getAllLentMoney();
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await lentMoneyService.getLentMoneyById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Lent money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await lentMoneyService.updateLentMoneyById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Lent money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const record = await lentMoneyService.patchLentMoneyById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Lent money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await lentMoneyService.deleteLentMoneyById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Lent money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
