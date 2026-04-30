const expenseRepository = require("../repositories/expenseRepository");
const paymentMethodRepository = require("../repositories/paymentMethodRepository");

const createExpense = async (data) => {
  try {
    const { title, amount, category, date } = data;
    
    if (!title || amount === undefined || !category || !date) {
      throw new Error("Missing required fields: title, amount, category, date");
    }
    
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (data.paymentMethod) {
      const paymentMethodExists = await paymentMethodRepository.getPaymentMethodById(data.paymentMethod);
      if (!paymentMethodExists) {
        throw new Error("Invalid payment method");
      }
    }

    return await expenseRepository.createExpense(data);
  } catch (error) {
    throw error;
  }
};

const getAllExpense = async () => {
  try {
    return await expenseRepository.getAllExpense();
  } catch (error) {
    throw error;
  }
};

const getExpenseById = async (id) => {
  try {
    const expense = await expenseRepository.getExpenseById(id);
    if (!expense) {
      throw new Error("Expense record not found");
    }
    return expense;
  } catch (error) {
    throw error;
  }
};

const updateExpenseById = async (id, data) => {
  try {
    const { title, amount, category, date } = data;
    
    if (!title || amount === undefined || !category || !date) {
      throw new Error("Missing required fields: title, amount, category, date");
    }
    
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (data.paymentMethod) {
      const paymentMethodExists = await paymentMethodRepository.getPaymentMethodById(data.paymentMethod);
      if (!paymentMethodExists) {
        throw new Error("Invalid payment method");
      }
    }

    const updatedExpense = await expenseRepository.updateExpenseById(id, data);
    if (!updatedExpense) {
      throw new Error("Expense record not found");
    }
    return updatedExpense;
  } catch (error) {
    throw error;
  }
};

const patchExpenseById = async (id, data) => {
  try {
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (data.paymentMethod) {
      const paymentMethodExists = await paymentMethodRepository.getPaymentMethodById(data.paymentMethod);
      if (!paymentMethodExists) {
        throw new Error("Invalid payment method");
      }
    }

    const patchedExpense = await expenseRepository.patchExpenseById(id, data);
    if (!patchedExpense) {
      throw new Error("Expense record not found");
    }
    return patchedExpense;
  } catch (error) {
    throw error;
  }
};

const deleteExpenseById = async (id) => {
  try {
    const deletedExpense = await expenseRepository.deleteExpenseById(id);
    if (!deletedExpense) {
      throw new Error("Expense record not found");
    }
    return deletedExpense;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createExpense,
  getAllExpense,
  getExpenseById,
  updateExpenseById,
  patchExpenseById,
  deleteExpenseById,
};
