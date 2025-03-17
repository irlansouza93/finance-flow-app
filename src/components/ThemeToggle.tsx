import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  // Usa o hook personalizado para acessar o contexto de tema
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={`flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors ${className}`}
      aria-label={isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {isDarkMode ? (
        <>
          <Sun className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium">Escuro</span>
        </>
      )}
    </button>
  );
} 