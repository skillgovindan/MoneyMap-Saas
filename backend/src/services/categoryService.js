const categoryRepository = require("../repositories/categoryRepository");

const createCategory = async (data) => {
  try {
    const { name, type } = data;
    if (!name || !type) {
      throw new Error("Missing required fields: name, type");
    }
    if (type !== "income" && type !== "expense") {
      throw new Error("Type must be either 'income' or 'expense'");
    }

    const existingCategory = await categoryRepository.getCategoryByNameAndType(name.trim(), type);
    if (existingCategory) {
      throw new Error("Category already exists");
    }

    return await categoryRepository.createCategory(data);
  } catch (error) {
    throw error;
  }
};

const getAllCategories = async () => {
  try {
    return await categoryRepository.getAllCategories();
  } catch (error) {
    throw error;
  }
};

const getCategoriesByType = async (type) => {
  try {
    if (type !== "income" && type !== "expense") {
      throw new Error("Type must be either 'income' or 'expense'");
    }
    return await categoryRepository.getCategoriesByType(type);
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    const category = await categoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategoryById = async (id, data) => {
  try {
    const { name, type } = data;
    if (!name || !type) {
      throw new Error("Missing required fields: name, type");
    }
    if (type !== "income" && type !== "expense") {
      throw new Error("Type must be either 'income' or 'expense'");
    }

    // Ensure we are not updating to a duplicate name+type
    const existingCategory = await categoryRepository.getCategoryByNameAndType(name.trim(), type);
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new Error("Category already exists");
    }

    const updatedCategory = await categoryRepository.updateCategoryById(id, data);
    if (!updatedCategory) {
      throw new Error("Category not found");
    }
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const patchCategoryById = async (id, data) => {
  try {
    if (data.type !== undefined && data.type !== "income" && data.type !== "expense") {
      throw new Error("Type must be either 'income' or 'expense'");
    }

    if (data.name !== undefined || data.type !== undefined) {
      const categoryToUpdate = await categoryRepository.getCategoryById(id);
      if (!categoryToUpdate) {
        throw new Error("Category not found");
      }
      
      const newName = data.name !== undefined ? data.name.trim() : categoryToUpdate.name;
      const newType = data.type !== undefined ? data.type : categoryToUpdate.type;

      const existingCategory = await categoryRepository.getCategoryByNameAndType(newName, newType);
      if (existingCategory && existingCategory._id.toString() !== id) {
        throw new Error("Category already exists");
      }
    }

    const patchedCategory = await categoryRepository.patchCategoryById(id, data);
    if (!patchedCategory) {
      throw new Error("Category not found");
    }
    return patchedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteCategoryById = async (id) => {
  try {
    const deletedCategory = await categoryRepository.deleteCategoryById(id);
    if (!deletedCategory) {
      throw new Error("Category not found");
    }
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoriesByType,
  getCategoryById,
  updateCategoryById,
  patchCategoryById,
  deleteCategoryById,
};
