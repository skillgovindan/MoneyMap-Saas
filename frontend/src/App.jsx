import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import IncomeForm from './pages/IncomeForm';
import Expense from './pages/Expense';
import ExpenseForm from './pages/ExpenseForm';
import TransactionHistory from './pages/TransactionHistory';
import DailyReport from './pages/DailyReport';
import WeeklyReport from './pages/WeeklyReport';
import MonthlyReport from './pages/MonthlyReport';
import YearlyReport from './pages/YearlyReport';
import Categories from './pages/Categories';
import Persons from './pages/Persons';

import DueTracker from './pages/DueTracker';
import LentMoneyForm from './pages/LentMoneyForm';
import BorrowedMoneyForm from './pages/BorrowedMoneyForm';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions/income" element={<Income />} />
          <Route path="transactions/income/add" element={<IncomeForm />} />
          <Route path="transactions/income/edit/:id" element={<IncomeForm />} />
          <Route path="transactions/expense" element={<Expense />} />
          <Route path="transactions/expense/add" element={<ExpenseForm />} />
          <Route path="transactions/expense/edit/:id" element={<ExpenseForm />} />
          <Route path="transactions/history" element={<TransactionHistory />} />
          <Route path="reports/daily" element={<DailyReport />} />
          <Route path="reports/weekly" element={<WeeklyReport />} />
          <Route path="reports/monthly" element={<MonthlyReport />} />
          <Route path="reports/yearly" element={<YearlyReport />} />
          <Route path="categories" element={<Categories />} />
          <Route path="persons" element={<Persons />} />

          <Route path="due-tracker" element={<DueTracker />} />
          <Route path="due-tracker/lent/add" element={<LentMoneyForm />} />
          <Route path="due-tracker/lent/edit/:id" element={<LentMoneyForm />} />
          <Route path="due-tracker/borrowed/add" element={<BorrowedMoneyForm />} />
          <Route path="due-tracker/borrowed/edit/:id" element={<BorrowedMoneyForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
