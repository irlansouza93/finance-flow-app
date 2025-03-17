import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Valor padrão do contexto
const defaultContext: ThemeContextType = {
  theme: 'light',
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
};

// Criação do contexto
const ThemeContext = createContext<ThemeContextType>(defaultContext);

// Hook personalizado para usar o contexto de tema
export const useTheme = () => useContext(ThemeContext);

// Chave usada para armazenar o tema no localStorage
const THEME_STORAGE_KEY = 'financeflow-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para armazenar o tema atual
  const [theme, setThemeState] = useState<Theme>('light');
  
  // Efeito que é executado apenas uma vez ao montar o componente
  useEffect(() => {
    // Verifica se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    
    // Verifica a preferência do sistema do usuário
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Define o tema inicial baseado na preferência salva ou do sistema
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setThemeState('dark');
      document.documentElement.classList.add('dark');
    } else {
      setThemeState('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Configura um listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Função que será chamada quando a preferência de mídia mudar
    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Apenas muda o tema se o usuário não tiver uma preferência salva
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    
    // Adiciona o event listener
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Remove o event listener quando o componente é desmontado
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);
  
  // Função para definir explicitamente um tema
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Função para alternar entre os temas
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Valores que serão disponibilizados para os componentes filhos
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 