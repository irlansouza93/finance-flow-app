import React, { useState, useEffect } from 'react';
import { Info, AlertTriangle, ChevronRight } from 'lucide-react';
import type { BudgetCategory } from '../types';
import { useFinance } from '../context/FinanceContext';

export function BudgetProgress() {
  const { budgetCategories } = useFinance();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [animatedBudgets, setAnimatedBudgets] = useState<BudgetCategory[]>(
    budgetCategories.map(budget => ({ ...budget, spent: 0 }))
  );
  
  // Atualizar estado quando os orçamentos mudarem
  useEffect(() => {
    setAnimatedBudgets(budgetCategories.map(budget => ({ ...budget, spent: 0 })));
  }, [budgetCategories]);
  
  // Animação de carregamento das barras
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBudgets(budgetCategories);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [budgetCategories]);
  
  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Progresso do Orçamento</h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center">
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      {animatedBudgets.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma categoria de orçamento definida</p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Criar Categoria de Orçamento
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {animatedBudgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            let progressColor = '';
            let statusText = '';
            let statusColor = '';
            
            if (percentage >= 90) {
              progressColor = 'from-red-400 to-red-600';
              statusText = 'Atenção!';
              statusColor = 'text-red-600 dark:text-red-400';
            } else if (percentage >= 75) {
              progressColor = 'from-yellow-400 to-yellow-600';
              statusText = 'Monitorando';
              statusColor = 'text-yellow-600 dark:text-yellow-400';
            } else {
              progressColor = 'from-green-400 to-green-600';
              statusText = 'Bom';
              statusColor = 'text-green-600 dark:text-green-400';
            }
            
            const remaining = budget.allocated - budget.spent;
            const tooltipText = `${formatCurrency(budget.spent)} de ${formatCurrency(budget.allocated)} gastos em ${budget.name}`;
            
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{budget.name}</span>
                    {percentage >= 90 && (
                      <AlertTriangle className="w-4 h-4 ml-2 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      percentage >= 90 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                      percentage >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {statusText}
                    </span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      <span className={percentage >= 90 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                        {formatCurrency(remaining)}
                      </span> 
                      {' '}restantes
                    </span>
                  </div>
                </div>
                
                <div 
                  className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  onMouseEnter={() => setActiveTooltip(budget.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min(percentage, 100)}%`,
                      boxShadow: percentage >= 90 ? '0 0 8px rgba(220, 38, 38, 0.8)' : 'none'
                    }}
                  >
                    {percentage > 20 && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white drop-shadow-md">
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  
                  {activeTooltip === budget.id && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg py-2 px-3 z-10 min-w-max">
                      {tooltipText}
                      <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-l-transparent border-r-transparent border-t-gray-800 dark:border-t-gray-900"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="space-x-2">
                    <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-r from-green-400 to-green-600"></span>
                    <span>Bom (0-75%)</span>
                  </div>
                  <div className="space-x-2">
                    <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
                    <span>Médio (75-90%)</span>
                  </div>
                  <div className="space-x-2">
                    <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-r from-red-400 to-red-600"></span>
                    <span>Alto ({'>'}90%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}