const transactionRepository = require("../repositories/transactionRepository");

const getTransactions = async (query) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = query;

    // Validation
    if (type && type !== "income" && type !== "expense" && type !== "all") {
      throw new Error("Invalid type. Allowed values: income, expense, all");
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      throw new Error("Page must be a positive number");
    }
    if (isNaN(limitNumber) || limitNumber <= 0) {
      throw new Error("Limit must be a positive number");
    }

    // Build filter
    const filter = {};
    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) throw new Error("Invalid startDate provided");
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) throw new Error("Invalid endDate provided");
        filter.date.$lte = end;
      }
    }

    let combinedTransactions = [];

    const fetchIncome = !type || type === "all" || type === "income";
    const fetchExpense = !type || type === "all" || type === "expense";

    if (fetchIncome) {
      const incomes = await transactionRepository.getIncomeTransactions(filter);
      const formattedIncomes = incomes.map((inc) => ({
        _id: inc._id,
        title: inc.title,
        amount: inc.amount,
        type: "income",
        category: inc.category,
        date: inc.date,
        description: inc.description,
        paymentMethod: inc.paymentMethod,
        createdAt: inc.createdAt,
        updatedAt: inc.updatedAt,
      }));
      combinedTransactions.push(...formattedIncomes);
    }

    if (fetchExpense) {
      const expenses = await transactionRepository.getExpenseTransactions(filter);
      const formattedExpenses = expenses.map((exp) => ({
        _id: exp._id,
        title: exp.title,
        amount: exp.amount,
        type: "expense",
        category: exp.category,
        date: exp.date,
        description: exp.description,
        paymentMethod: exp.paymentMethod,
        createdAt: exp.createdAt,
        updatedAt: exp.updatedAt,
      }));
      combinedTransactions.push(...formattedExpenses);
    }

    // Sort combined transactions by date descending, then createdAt descending
    combinedTransactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) {
        return dateB - dateA;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const totalTransactions = combinedTransactions.length;
    const totalPages = Math.ceil(totalTransactions / limitNumber);
    
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const paginatedTransactions = combinedTransactions.slice(startIndex, endIndex);

    return {
      transactions: paginatedTransactions,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalTransactions,
        totalPages,
      },
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTransactions,
};
