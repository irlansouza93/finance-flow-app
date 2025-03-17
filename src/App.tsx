import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './layouts/AppLayout';
import { AppRoutes } from './routes';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Componente para o Toaster com tema
function ThemedToaster() {
  const { isDarkMode } = useTheme();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: `toast ${isDarkMode ? 'dark' : ''}`,
        style: {
          background: isDarkMode ? '#1F2937' : '#fff',
          color: isDarkMode ? '#F9FAFB' : '#111827',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
        },
        success: {
          className: 'toast-success',
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          className: 'toast-error',
          duration: 5000,
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
      }}
    />
  );
}

// Componente principal da aplicação
function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <BrowserRouter>
          <AppLayout>
            <AppRoutes />
          </AppLayout>
          <ThemedToaster />
        </BrowserRouter>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;