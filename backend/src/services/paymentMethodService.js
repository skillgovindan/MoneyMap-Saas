const paymentMethodRepository = require("../repositories/paymentMethodRepository");

const createPaymentMethod = async (data) => {
  try {
    const { name } = data;
    if (!name) {
      throw new Error("Missing required fields: name");
    }

    const existingPaymentMethod = await paymentMethodRepository.getPaymentMethodByName(name.trim());
    if (existingPaymentMethod) {
      throw new Error("Payment method already exists");
    }

    return await paymentMethodRepository.createPaymentMethod(data);
  } catch (error) {
    throw error;
  }
};

const getAllPaymentMethods = async () => {
  try {
    return await paymentMethodRepository.getAllPaymentMethods();
  } catch (error) {
    throw error;
  }
};

const getActivePaymentMethods = async () => {
  try {
    return await paymentMethodRepository.getActivePaymentMethods();
  } catch (error) {
    throw error;
  }
};

const getPaymentMethodById = async (id) => {
  try {
    const paymentMethod = await paymentMethodRepository.getPaymentMethodById(id);
    if (!paymentMethod) {
      throw new Error("Payment method not found");
    }
    return paymentMethod;
  } catch (error) {
    throw error;
  }
};

const updatePaymentMethodById = async (id, data) => {
  try {
    const { name } = data;
    if (!name) {
      throw new Error("Missing required fields: name");
    }

    const existingPaymentMethod = await paymentMethodRepository.getPaymentMethodByName(name.trim());
    if (existingPaymentMethod && existingPaymentMethod._id.toString() !== id) {
      throw new Error("Payment method already exists");
    }

    const updatedPaymentMethod = await paymentMethodRepository.updatePaymentMethodById(id, data);
    if (!updatedPaymentMethod) {
      throw new Error("Payment method not found");
    }
    return updatedPaymentMethod;
  } catch (error) {
    throw error;
  }
};

const patchPaymentMethodById = async (id, data) => {
  try {
    if (data.name !== undefined) {
      const existingPaymentMethod = await paymentMethodRepository.getPaymentMethodByName(data.name.trim());
      if (existingPaymentMethod && existingPaymentMethod._id.toString() !== id) {
        throw new Error("Payment method already exists");
      }
    }

    const patchedPaymentMethod = await paymentMethodRepository.patchPaymentMethodById(id, data);
    if (!patchedPaymentMethod) {
      throw new Error("Payment method not found");
    }
    return patchedPaymentMethod;
  } catch (error) {
    throw error;
  }
};

const deletePaymentMethodById = async (id) => {
  try {
    const deletedPaymentMethod = await paymentMethodRepository.deletePaymentMethodById(id);
    if (!deletedPaymentMethod) {
      throw new Error("Payment method not found");
    }
    return deletedPaymentMethod;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getActivePaymentMethods,
  getPaymentMethodById,
  updatePaymentMethodById,
  patchPaymentMethodById,
  deletePaymentMethodById,
};
