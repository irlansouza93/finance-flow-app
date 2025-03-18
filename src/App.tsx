import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppLayout } from './layouts/AppLayout';
import { AppRoutes } from './routes';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

/**
 * # Componente ThemedToaster
 * Configura as notificações toast com suporte a tema claro/escuro
 */
function ThemedToaster() {
  // # Obtém o estado do tema atual usando o hook useTheme
  const { isDarkMode } = useTheme();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: `toast ${isDarkMode ? 'dark' : ''}`,
        style: {
          // # Aplica cores diferentes baseadas no tema atual
          background: isDarkMode ? '#1F2937' : '#fff',
          color: isDarkMode ? '#F9FAFB' : '#111827',
          border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
        },
        // # Configuração para mensagens de sucesso
        success: {
          className: 'toast-success',
          iconTheme: {
            primary: '#10B981',  // # Verde
            secondary: 'white',
          },
        },
        // # Configuração para mensagens de erro
        error: {
          className: 'toast-error',
          duration: 5000,  // # Duração maior para mensagens de erro
          iconTheme: {
            primary: '#EF4444',  // # Vermelho
            secondary: 'white',
          },
        },
      }}
    />
  );
}

/**
 * # Componente principal da aplicação
 * Configura os providers de contexto e roteamento
 */
function App() {
  return (
    <ThemeProvider>
      {/* # Provider do tema que envolve toda a aplicação */}
      <FinanceProvider>
        {/* # Provider do contexto financeiro com os dados da aplicação */}
        <BrowserRouter>
          {/* # Configuração de roteamento */}
          <AppLayout>
            {/* # Layout principal da aplicação */}
            <AppRoutes />
            {/* # Componente de rotas que renderiza as páginas */}
          </AppLayout>
          <ThemedToaster />
          {/* # Sistema de notificações toast */}
        </BrowserRouter>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;