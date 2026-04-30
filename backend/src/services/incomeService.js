const incomeRepository = require("../repositories/incomeRepository");
const paymentMethodRepository = require("../repositories/paymentMethodRepository");

const createIncome = async (data) => {
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

    return await incomeRepository.createIncome(data);
  } catch (error) {
    throw error;
  }
};

const getAllIncome = async () => {
  try {
    return await incomeRepository.getAllIncome();
  } catch (error) {
    throw error;
  }
};

const getIncomeById = async (id) => {
  try {
    const income = await incomeRepository.getIncomeById(id);
    if (!income) {
      throw new Error("Income record not found");
    }
    return income;
  } catch (error) {
    throw error;
  }
};

const updateIncomeById = async (id, data) => {
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

    const updatedIncome = await incomeRepository.updateIncomeById(id, data);
    if (!updatedIncome) {
      throw new Error("Income record not found");
    }
    return updatedIncome;
  } catch (error) {
    throw error;
  }
};

const patchIncomeById = async (id, data) => {
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

    const patchedIncome = await incomeRepository.patchIncomeById(id, data);
    if (!patchedIncome) {
      throw new Error("Income record not found");
    }
    return patchedIncome;
  } catch (error) {
    throw error;
  }
};

const deleteIncomeById = async (id) => {
  try {
    const deletedIncome = await incomeRepository.deleteIncomeById(id);
    if (!deletedIncome) {
      throw new Error("Income record not found");
    }
    return deletedIncome;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createIncome,
  getAllIncome,
  getIncomeById,
  updateIncomeById,
  patchIncomeById,
  deleteIncomeById,
};
