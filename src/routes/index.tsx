import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Overview } from '../pages/Overview.tsx';
import { Income } from '../pages/Income.tsx';
import { Expenses } from '../pages/Expenses.tsx';
import { Budget } from '../pages/Budget.tsx';
import { Goals } from '../pages/Goals.tsx';
import { Education } from '../pages/Education.tsx';
import { Chat } from '../pages/Chat.tsx';
import { CreditCards } from '../pages/CreditCards';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/income" element={<Income />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/credit-cards" element={<CreditCards />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/education" element={<Education />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}