const lentMoneyRepository = require("../repositories/lentMoneyRepository");
const personRepository = require("../repositories/personRepository");


const createLentMoney = async (data) => {
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

    return await lentMoneyRepository.createLentMoney({
      ...data,
      isPaid: data.isPaid || false,
    });
  } catch (error) {
    throw error;
  }
};

const getAllLentMoney = async () => {
  try {
    return await lentMoneyRepository.getAllLentMoney();
  } catch (error) {
    throw error;
  }
};

const getLentMoneyById = async (id) => {
  try {
    const record = await lentMoneyRepository.getLentMoneyById(id);
    if (!record) {
      throw new Error("Lent money record not found");
    }
    return record;
  } catch (error) {
    throw error;
  }
};

const updateLentMoneyById = async (id, data) => {
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

    
    const existingRecord = await lentMoneyRepository.getLentMoneyById(id);
    if (!existingRecord) {
      throw new Error("Lent money record not found");
    }

    return await lentMoneyRepository.updateLentMoneyById(id, {
      ...data,
      isPaid: data.isPaid !== undefined ? data.isPaid : existingRecord.isPaid,
    });
  } catch (error) {
    throw error;
  }
};

const patchLentMoneyById = async (id, data) => {
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


    const existingRecord = await lentMoneyRepository.getLentMoneyById(id);
    if (!existingRecord) {
      throw new Error("Lent money record not found");
    }

    return await lentMoneyRepository.patchLentMoneyById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteLentMoneyById = async (id) => {
  try {
    const existingRecord = await lentMoneyRepository.getLentMoneyById(id);
    if (!existingRecord) {
      throw new Error("Lent money record not found");
    }
    
    return await lentMoneyRepository.deleteLentMoneyById(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createLentMoney,
  getAllLentMoney,
  getLentMoneyById,
  updateLentMoneyById,
  patchLentMoneyById,
  deleteLentMoneyById,
};
