const express = require("express");
const paymentMethodService = require("../services/paymentMethodService");

const router = express.Router();

const handleErrorResponse = (error, res) => {
  if (error.message === "Payment method not found") {
    return res.status(404).json({ message: error.message });
  }
  if (
    error.message === "Payment method already exists" || 
    error.message.includes("Missing required fields")
  ) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

router.post("/", async (req, res) => {
  try {
    const newPaymentMethod = await paymentMethodService.createPaymentMethod(req.body);
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const paymentMethods = await paymentMethodService.getAllPaymentMethods();
    res.status(200).json(paymentMethods);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/active", async (req, res) => {
  try {
    const activePaymentMethods = await paymentMethodService.getActivePaymentMethods();
    res.status(200).json(activePaymentMethods);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const paymentMethod = await paymentMethodService.getPaymentMethodById(req.params.id);
    res.status(200).json(paymentMethod);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPaymentMethod = await paymentMethodService.updatePaymentMethodById(req.params.id, req.body);
    res.status(200).json(updatedPaymentMethod);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const patchedPaymentMethod = await paymentMethodService.patchPaymentMethodById(req.params.id, req.body);
    res.status(200).json(patchedPaymentMethod);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPaymentMethod = await paymentMethodService.deletePaymentMethodById(req.params.id);
    res.status(200).json(deletedPaymentMethod);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

module.exports = router;
