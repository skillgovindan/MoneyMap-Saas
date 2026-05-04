const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dailyReportRoutes = require("./routes/dailyReportRoutes");
const weeklyReportRoutes = require("./routes/weeklyReportRoutes");
const monthlyReportRoutes = require("./routes/monthlyReportRoutes");
const yearlyReportRoutes = require("./routes/yearlyReportRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const paymentMethodRoutes = require("./routes/paymentMethodRoutes");
const lentMoneyRoutes = require("./routes/lentMoneyRoutes");
const borrowedMoneyRoutes = require("./routes/borrowedMoneyRoutes");
const personRoutes = require("./routes/personRoutes");

// Middleware
const { protect } = require("./middleware/authMiddleware");
const tenantMiddleware = require("./middleware/tenantMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Public auth routes
app.use("/api/auth", authRoutes);

// ── Protected + Tenant-aware route (Income only for now) ──────────────────────
app.use("/api/income", protect, tenantMiddleware, incomeRoutes);

// ── Remaining routes (not yet tenant-scoped) ─────────────────────────────────
app.use("/api/expense", expenseRoutes);
app.use("/api/reports/daily", dailyReportRoutes);
app.use("/api/reports/weekly", weeklyReportRoutes);
app.use("/api/reports/monthly", monthlyReportRoutes);
app.use("/api/reports/yearly", yearlyReportRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/lent-money", lentMoneyRoutes);
app.use("/api/borrowed-money", borrowedMoneyRoutes);
app.use("/api/persons", personRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
