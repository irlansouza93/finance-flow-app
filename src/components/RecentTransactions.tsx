import React from 'react';
import { ShoppingBag, Coffee, Home, Car, CreditCard, DollarSign, PlusCircle, ChevronRight } from 'lucide-react';
import type { Transaction } from '../types';
import { useFinance } from '../context/FinanceContext';

// Mapeamento de ícones para categorias
const categoryIcons: Record<string, React.ElementType> = {
  'Supermercado': ShoppingBag,
  'Café': Coffee,
  'Aluguel': Home,
  'Transporte': Car,
  'Lazer': CreditCard,
  'Internet': Home,
  'Água': Home,
  'Energia': Home,
  'Salário': DollarSign,
  'Freelance': DollarSign,
  'Dividendos': DollarSign
};

// Para categorias que não têm ícone definido
const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || ShoppingBag;
};

// Obter a cor do ícone baseado no tipo de transação
const getCategoryIconColor = (type: 'income' | 'expense') => {
  return type === 'income' ? 'text-green-600' : 'text-red-600';
};

// Obter a cor do fundo do ícone baseado no tipo de transação
const getCategoryIconBg = (type: 'income' | 'expense') => {
  return type === 'income' ? 'bg-green-100' : 'bg-red-100';
};

export function RecentTransactions() {
  const { transactions } = useFinance();
  
  // Ordenar transações por data (mais recentes primeiro) e limitar a 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  // Função para formatar moeda
  const formatCurrency = (value: number, type: 'income' | 'expense') => {
    const prefix = type === 'income' ? '+' : '-';
    return prefix + new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Transações Recentes</h2>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center">
            Ver todas <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma transação encontrada</p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <PlusCircle className="w-4 h-4 mr-2" />
              Adicionar Transação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              return (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 ${getCategoryIconBg(transaction.type)} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${getCategoryIconColor(transaction.type)}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(transaction.amount, transaction.type)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
        <button className="w-full py-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg transition-colors flex items-center justify-center">
          <PlusCircle className="w-4 h-4 mr-2" />
          Adicionar Nova Transação
        </button>
      </div>
    </div>
  );
}