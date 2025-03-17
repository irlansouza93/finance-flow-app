import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeDemo() {
  const { theme, isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evita incompatibilidade de renderização entre servidor e cliente
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Demonstração de Tema</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Tema Atual:</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">{theme}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Modo Escuro Ativo:</span>
          <span className={`font-medium ${isDarkMode ? 'text-green-500' : 'text-red-500'}`}>
            {isDarkMode ? 'Sim' : 'Não'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Persistência:</span>
          <span className="font-medium text-green-500">Ativa (localStorage)</span>
        </div>
        
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
          <p className="mb-1">Para testar a persistência:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Mude o tema usando o botão de alternância</li>
            <li>Atualize a página (F5)</li>
            <li>O tema deve permanecer o mesmo que você escolheu</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 