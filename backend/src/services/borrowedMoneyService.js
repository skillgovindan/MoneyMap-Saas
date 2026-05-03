const borrowedMoneyRepository = require("../repositories/borrowedMoneyRepository");
const personRepository = require("../repositories/personRepository");


const createBorrowedMoney = async (data) => {
  try {
    const { person, category, amount, takenDate } = data;
    if (!person || !category || amount === undefined || !takenDate) {
      throw new Error("person, category, amount, and takenDate are required");
    }
    if (amount <= 0) {
      throw new Error("amount must be greater than 0");
    }

    try {
      const existingPerson = await personRepository.getPersonById(person);
      if (!existingPerson) {
        throw new Error("Invalid person");
      }
    } catch (err) {
      throw new Error("Invalid person");
    }

    return await borrowedMoneyRepository.createBorrowedMoney({
      ...data,
      isPaid: data.isPaid || false,
    });
  } catch (error) {
    throw error;
  }
};

const getAllBorrowedMoney = async () => {
  try {
    return await borrowedMoneyRepository.getAllBorrowedMoney();
  } catch (error) {
    throw error;
  }
};

const getBorrowedMoneyById = async (id) => {
  try {
    const record = await borrowedMoneyRepository.getBorrowedMoneyById(id);
    if (!record) {
      throw new Error("Borrowed money record not found");
    }
    return record;
  } catch (error) {
    throw error;
  }
};

const updateBorrowedMoneyById = async (id, data) => {
  try {
    const { person, category, amount, takenDate } = data;
    if (!person || !category || amount === undefined || !takenDate) {
      throw new Error("person, category, amount, and takenDate are required");
    }
    if (amount <= 0) {
      throw new Error("amount must be greater than 0");
    }

    try {
      const existingPerson = await personRepository.getPersonById(person);
      if (!existingPerson) {
        throw new Error("Invalid person");
      }
    } catch (err) {
      throw new Error("Invalid person");
    }

    
    const existingRecord = await borrowedMoneyRepository.getBorrowedMoneyById(id);
    if (!existingRecord) {
      throw new Error("Borrowed money record not found");
    }

    return await borrowedMoneyRepository.updateBorrowedMoneyById(id, {
      ...data,
      isPaid: data.isPaid !== undefined ? data.isPaid : existingRecord.isPaid,
    });
  } catch (error) {
    throw error;
  }
};

const patchBorrowedMoneyById = async (id, data) => {
  try {
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }

    if (data.person) {
      try {
        const existingPerson = await personRepository.getPersonById(data.person);
        if (!existingPerson) {
          throw new Error("Invalid person");
        }
      } catch (err) {
        throw new Error("Invalid person");
      }
    }


    const existingRecord = await borrowedMoneyRepository.getBorrowedMoneyById(id);
    if (!existingRecord) {
      throw new Error("Borrowed money record not found");
    }

    return await borrowedMoneyRepository.patchBorrowedMoneyById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteBorrowedMoneyById = async (id) => {
  try {
    const existingRecord = await borrowedMoneyRepository.getBorrowedMoneyById(id);
    if (!existingRecord) {
      throw new Error("Borrowed money record not found");
    }
    
    return await borrowedMoneyRepository.deleteBorrowedMoneyById(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createBorrowedMoney,
  getAllBorrowedMoney,
  getBorrowedMoneyById,
  updateBorrowedMoneyById,
  patchBorrowedMoneyById,
  deleteBorrowedMoneyById,
};
