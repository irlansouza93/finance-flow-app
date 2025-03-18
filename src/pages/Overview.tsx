import React, { useState, useEffect } from 'react';
import { OverviewCards } from '../components/OverviewCards';
import { RecentTransactions } from '../components/RecentTransactions';
import { BudgetProgress } from '../components/BudgetProgress';
import { useFinance } from '../context/FinanceContext';
import { ThemeToggle } from '../components/ThemeToggle';

/**
 * # Página de Visão Geral (Dashboard)
 * Mostra um resumo da situação financeira do usuário, incluindo:
 * - Informações do usuário e progresso geral
 * - Cards com resumo financeiro
 * - Transações recentes
 * - Progresso do orçamento por categoria
 */
export function Overview() {
  // # Obtém dados financeiros do contexto
  const { summary, transactions, savingsGoals } = useFinance();
  
  // # Estado para nome do usuário (será substituído por autenticação)
  const [userName, setUserName] = useState('Usuário');
  
  // # Estado para o percentual de progresso das metas de economia
  const [progressPercentage, setProgressPercentage] = useState(60);
  
  /**
   * # Calcula o progresso geral baseado nas metas de economia
   * Soma o valor alvo de todas as metas e o valor atual,
   * então calcula o percentual de progresso
   */
  useEffect(() => {
    if (savingsGoals.length > 0) {
      const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
      const totalCurrent = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
      const percentage = Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) || 0;
      setProgressPercentage(percentage);
    }
  }, [savingsGoals]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* # Cabeçalho com informações do usuário e toggle de tema */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* # Avatar do usuário com círculo de progresso */}
          <div className="relative mr-4">
            {/* # Avatar com iniciais do usuário */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
              {userName.substring(0, 2).toUpperCase()}
            </div>
            {/* # SVG para o círculo de progresso ao redor do avatar */}
            <svg className="absolute -top-1 -right-1 w-16 h-16" viewBox="0 0 36 36">
              {/* # Círculo de fundo */}
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2" className="dark:opacity-25"></circle>
              {/* # Círculo de progresso */}
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="3" 
                strokeDasharray="100" 
                strokeDashoffset={100 - progressPercentage} 
                strokeLinecap="round"
              ></circle>
            </svg>
          </div>
          {/* # Saudação e mensagem de status */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Olá, {userName}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {/* # Mensagem condicional baseada no saldo disponível */}
              {summary.remainingMoney > 0 
                ? 'Seu planejamento financeiro está no caminho certo!' 
                : 'Cuidado, você está gastando mais do que ganha!'}
            </p>
          </div>
        </div>
        {/* # Botão para alternar entre temas claro/escuro */}
        <ThemeToggle />
      </div>
      
      {/* # Cards com visão geral das finanças */}
      <OverviewCards />
      
      {/* # Grid com transações recentes e progresso do orçamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions />
        <BudgetProgress />
      </div>
    </div>
  );
}