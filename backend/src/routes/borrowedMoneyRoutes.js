const express = require("express");
const router = express.Router();
const borrowedMoneyService = require("../services/borrowedMoneyService");

router.post("/", async (req, res) => {
  try {
    const record = await borrowedMoneyService.createBorrowedMoney(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await borrowedMoneyService.getAllBorrowedMoney();
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await borrowedMoneyService.getBorrowedMoneyById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Borrowed money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await borrowedMoneyService.updateBorrowedMoneyById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Borrowed money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const record = await borrowedMoneyService.patchBorrowedMoneyById(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Borrowed money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await borrowedMoneyService.deleteBorrowedMoneyById(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    if (error.message === "Borrowed money record not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
