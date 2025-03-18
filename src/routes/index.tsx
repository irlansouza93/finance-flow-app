import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componente de loading
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy loading dos componentes
const Overview = lazy(() => import('../pages/Overview.tsx').then(module => ({ default: module.Overview })));
const Income = lazy(() => import('../pages/Income.tsx').then(module => ({ default: module.Income })));
const Expenses = lazy(() => import('../pages/Expenses.tsx').then(module => ({ default: module.Expenses })));
const Budget = lazy(() => import('../pages/Budget.tsx').then(module => ({ default: module.Budget })));
const Goals = lazy(() => import('../pages/Goals.tsx').then(module => ({ default: module.Goals })));
const Chat = lazy(() => import('../pages/Chat.tsx').then(module => ({ default: module.Chat })));
const CreditCards = lazy(() => import('../pages/CreditCards').then(module => ({ default: module.CreditCards })));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/credit-cards" element={<CreditCards />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Suspense>
  );
}