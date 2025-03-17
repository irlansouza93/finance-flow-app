import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './layouts/AppLayout';
import { AppRoutes } from './routes';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar mudanças no tema
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Verificar tema inicial
    checkTheme();

    // Observar mudanças no tema
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <FinanceProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
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
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;