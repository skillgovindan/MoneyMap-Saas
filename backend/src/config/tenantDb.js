const mongoose = require("mongoose");

/**
 * Returns a Mongoose connection scoped to the user's own database.
 * Uses useCache:true so the same connection object is reused per dbName.
 */
const getTenantDb = (dbName) => {
  if (!dbName) {
    throw new Error("Tenant database name is required");
  }
  return mongoose.connection.useDb(dbName, { useCache: true });
};

module.exports = getTenantDb;
