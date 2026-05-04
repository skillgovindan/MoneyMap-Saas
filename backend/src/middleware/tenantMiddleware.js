const getTenantDb = require("../config/tenantDb");

/**
 * Requires authMiddleware to run first (so req.user exists).
 * Attaches req.tenantDb = user-specific MongoDB connection.
 */
const tenantMiddleware = (req, res, next) => {
  try {
    const dbName = req.user && req.user.dbName;
    if (!dbName) {
      return res.status(400).json({ message: "Tenant database not found." });
    }
    req.tenantDb = getTenantDb(dbName);
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = tenantMiddleware;
