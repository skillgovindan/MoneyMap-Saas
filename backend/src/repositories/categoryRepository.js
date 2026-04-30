const Category = require("../models/categoryModel");

const createCategory = (data) => {
  return Category.create(data);
};

const getAllCategories = () => {
  return Category.find().sort({ createdAt: -1 });
};

const getCategoriesByType = (type) => {
  return Category.find({ type }).sort({ createdAt: -1 });
};

const getCategoryById = (id) => {
  return Category.findById(id);
};

const getCategoryByNameAndType = (name, type) => {
  return Category.findOne({ name, type });
};

const updateCategoryById = (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const patchCategoryById = (id, data) => {
  return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCategoryById = (id) => {
  return Category.findByIdAndDelete(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  getCategoryByNameAndType,
  updateCategoryById,
  patchCategoryById,
  deleteCategoryById,
};
