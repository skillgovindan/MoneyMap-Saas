const express = require("express");
const categoryService = require("../services/categoryService");

const router = express.Router();

const handleErrorResponse = (error, res) => {
  if (error.message === "Category not found") {
    return res.status(404).json({ message: error.message });
  }
  if (
    error.message === "Category already exists" || 
    error.message.includes("Type must be either") || 
    error.message.includes("Missing required fields")
  ) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

router.post("/", async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const categories = await categoryService.getCategoriesByType(req.params.type);
    res.status(200).json(categories);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategoryById(req.params.id, req.body);
    res.status(200).json(updatedCategory);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const patchedCategory = await categoryService.patchCategoryById(req.params.id, req.body);
    res.status(200).json(patchedCategory);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await categoryService.deleteCategoryById(req.params.id);
    res.status(200).json(deletedCategory);
  } catch (error) {
    handleErrorResponse(error, res);
  }
});

module.exports = router;
