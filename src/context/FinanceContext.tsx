import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, IncomeSource, BudgetCategory, SavingsGoal, CreditCard, FinancialSummary, Notification } from '../types';

// # Importação de dados mockados (em produção isso seria carregado de uma API)
import { 
  mockTransactions, 
  mockIncomes, 
  mockBudgets, 
  mockGoals, 
  mockCreditCards,
  mockNotifications
} from '../data/mockData';

/**
 * # Interface do Contexto Financeiro
 * Define todos os dados financeiros e métodos disponíveis no contexto
 */
interface FinanceContextType {
  // # Dados financeiros
  transactions: Transaction[];         // # Lista de transações
  incomeSources: IncomeSource[];       // # Lista de fontes de renda
  budgetCategories: BudgetCategory[];  // # Lista de categorias de orçamento
  savingsGoals: SavingsGoal[];         // # Lista de metas de economia
  creditCards: CreditCard[];           // # Lista de cartões de crédito
  notifications: Notification[];       // # Lista de notificações
  summary: FinancialSummary;           // # Resumo financeiro

  // # Funções para gerenciar transações
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  // # Funções para gerenciar fontes de renda
  addIncome: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncome: (income: IncomeSource) => void;
  deleteIncome: (id: string) => void;
  
  // # Funções para gerenciar cartões de crédito
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (card: CreditCard) => void;
  deleteCreditCard: (id: string) => void;
  
  // # Funções para gerenciar categorias de orçamento
  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (category: BudgetCategory) => void;
  deleteBudgetCategory: (id: string) => void;
  
  // # Funções para gerenciar metas de economia
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  
  // # Funções para gerenciar notificações
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // # Funções utilitárias
  recalculateSummary: () => void;
  getTransactionsByCardId: (cardId: string) => Transaction[];
  getCurrentBillingCycleForCard: (cardId: string) => { 
    transactions: Transaction[],
    totalAmount: number,
    closeDate: Date,
    dueDate: Date
  } | null;
}

// # Valor padrão para o contexto (implementações vazias)
const defaultContext: FinanceContextType = {
  transactions: [],
  incomeSources: [],
  budgetCategories: [],
  savingsGoals: [],
  creditCards: [],
  notifications: [],
  summary: {
    totalIncome: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    remainingMoney: 0,
    totalBalance: 0,
    creditCardExpenses: 0,
    pendingBills: 0
  },
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  addIncome: () => {},
  updateIncome: () => {},
  deleteIncome: () => {},
  addCreditCard: () => {},
  updateCreditCard: () => {},
  deleteCreditCard: () => {},
  addBudgetCategory: () => {},
  updateBudgetCategory: () => {},
  deleteBudgetCategory: () => {},
  addSavingsGoal: () => {},
  updateSavingsGoal: () => {},
  deleteSavingsGoal: () => {},
  markNotificationAsRead: () => {},
  deleteNotification: () => {},
  recalculateSummary: () => {},
  getTransactionsByCardId: () => [],
  getCurrentBillingCycleForCard: () => null
};

// # Criação do contexto de finanças
const FinanceContext = createContext<FinanceContextType>(defaultContext);

/**
 * # Hook personalizado para acessar o contexto financeiro
 * Facilita o uso do contexto em componentes
 */
export const useFinance = () => useContext(FinanceContext);

// # Props do Provider
interface FinanceProviderProps {
  children: ReactNode;
}

/**
 * # Componente Provider para o contexto financeiro
 * Gerencia todos os estados e funções relacionados às finanças
 */
export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  // # Estados para os diferentes tipos de dados financeiros
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions || []);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(mockIncomes || []);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(mockBudgets || []);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(mockGoals || []);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards || []);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications || []);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    remainingMoney: 0,
    totalBalance: 0,
    creditCardExpenses: 0,
    pendingBills: 0
  });

  /**
   * # Função para gerar ID único para novos registros
   */
  const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

  // # Funções para gerenciar transações
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
    
    // Lógica para processar pagamentos
    if (transaction.type === 'expense') {
      // Se for PIX, debitar do valor de renda
      if (transaction.paymentMethod === 'pix') {
        // Atualizar o totalBalance no resumo
        setSummary(prev => ({
          ...prev,
          totalBalance: prev.totalBalance - transaction.amount,
          remainingMoney: prev.remainingMoney - transaction.amount
        }));
      }
      
      // Se for cartão de crédito, debitar do limite do cartão
      if (transaction.paymentMethod === 'credit' && transaction.creditCardId) {
        const updatedCards = creditCards.map(card => {
          if (card.id === transaction.creditCardId) {
            // Atualizar saldo e limite disponível do cartão
            return {
              ...card,
              currentBalance: card.currentBalance + transaction.amount,
              availableLimit: card.limit - (card.currentBalance + transaction.amount)
            };
          }
          return card;
        });
        
        setCreditCards(updatedCards);
      }
    }
    
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(item => item.id === transaction.id ? transaction : item)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(item => item.id !== id));
  };

  // # Funções para gerenciar fontes de renda
  const addIncome = (income: Omit<IncomeSource, 'id'>) => {
    const newIncome = { ...income, id: generateId() };
    setIncomeSources(prev => [...prev, newIncome]);
  };

  const updateIncome = (income: IncomeSource) => {
    setIncomeSources(prev => 
      prev.map(item => item.id === income.id ? income : item)
    );
  };

  const deleteIncome = (id: string) => {
    setIncomeSources(prev => prev.filter(item => item.id !== id));
  };

  // # Funções para gerenciar cartões de crédito
  const addCreditCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard = { ...card, id: generateId() };
    setCreditCards(prev => [...prev, newCard]);
  };

  const updateCreditCard = (card: CreditCard) => {
    setCreditCards(prev => 
      prev.map(item => item.id === card.id ? card : item)
    );
  };

  const deleteCreditCard = (id: string) => {
    setCreditCards(prev => prev.filter(item => item.id !== id));
  };

  // # Funções para gerenciar categorias de orçamento
  const addBudgetCategory = (category: Omit<BudgetCategory, 'id'>) => {
    const newCategory = { ...category, id: generateId() };
    setBudgetCategories(prev => [...prev, newCategory]);
  };

  const updateBudgetCategory = (category: BudgetCategory) => {
    setBudgetCategories(prev => 
      prev.map(item => item.id === category.id ? category : item)
    );
  };

  const deleteBudgetCategory = (id: string) => {
    setBudgetCategories(prev => prev.filter(item => item.id !== id));
  };

  // # Funções para gerenciar metas de economia
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = { ...goal, id: generateId() };
    setSavingsGoals(prev => [...prev, newGoal]);
  };

  const updateSavingsGoal = (goal: SavingsGoal) => {
    setSavingsGoals(prev => 
      prev.map(item => item.id === goal.id ? goal : item)
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(item => item.id !== id));
  };

  // # Funções para gerenciar notificações
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  /**
   * # Função para recalcular o resumo financeiro
   * Atualiza todos os valores do resumo com base nas transações e fontes de renda
   */
  const recalculateSummary = () => {
    // # Calcula receita total somando todas as fontes de renda
    const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
    
    // # Calcula despesas fixas somando transações do tipo despesa fixa
    const fixedExpenses = transactions
      .filter(t => t.type === 'expense' && t.expenseType === 'fixed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // # Calcula despesas variáveis somando transações do tipo despesa variável  
    const variableExpenses = transactions
      .filter(t => t.type === 'expense' && t.expenseType === 'variable')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // # Calcula despesas de cartão de crédito  
    const creditCardExpenses = transactions
      .filter(t => t.type === 'expense' && t.paymentMethod === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // # Calcula contas pendentes  
    const pendingBills = transactions
      .filter(t => t.type === 'expense' && t.paymentStatus === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // # Calcula dinheiro restante (receita - despesas)
    const remainingMoney = totalIncome - fixedExpenses - variableExpenses;
    const totalBalance = remainingMoney;
    
    // # Atualiza o estado do resumo financeiro
    setSummary({
      totalIncome,
      fixedExpenses,
      variableExpenses,
      remainingMoney,
      totalBalance,
      creditCardExpenses,
      pendingBills
    });
  };

  // # Efeito para recalcular o resumo quando os dados relevantes mudarem
  useEffect(() => {
    recalculateSummary();
  }, [transactions, incomeSources]);

  /**
   * # Função para obter transações de um cartão específico
   */
  const getTransactionsByCardId = (cardId: string) => {
    return transactions.filter(t => t.creditCardId === cardId);
  };

  /**
   * # Função para obter o ciclo atual de faturamento de um cartão
   * Calcula as datas de fechamento e vencimento atuais
   */
  const getCurrentBillingCycleForCard = (cardId: string) => {
    const card = creditCards.find(c => c.id === cardId);
    if (!card) return null;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // # Determina a data de fechamento (atual ou próxima)
    let closeDate = new Date(currentYear, currentMonth, card.closingDay);
    if (now > closeDate) {
      // Se a data de fechamento já passou este mês, avança para o próximo
      closeDate = new Date(currentYear, currentMonth + 1, card.closingDay);
    }
    
    // # Determina a data de vencimento com base na data de fechamento
    let dueDate = new Date(currentYear, currentMonth, card.dueDay);
    if (dueDate < closeDate) {
      // Se a data de vencimento é antes da data de fechamento, avança para o próximo mês
      dueDate = new Date(currentYear, currentMonth + 1, card.dueDay);
    }
    
    // # Obtém o ciclo de faturamento anterior para saber quais transações incluir
    const prevCloseDate = new Date(closeDate);
    prevCloseDate.setMonth(prevCloseDate.getMonth() - 1);
    
    // # Filtra transações que estão entre o fechamento anterior e o atual
    const cycleTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return t.creditCardId === cardId && 
             transDate >= prevCloseDate && 
             transDate < closeDate;
    });
    
    // # Calcula o valor total das transações no ciclo
    const totalAmount = cycleTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactions: cycleTransactions,
      totalAmount,
      closeDate,
      dueDate
    };
  };

  // # Exporta todos os estados e funções através do Provider
  return (
    <FinanceContext.Provider value={{
      transactions,
      incomeSources,
      budgetCategories,
      savingsGoals,
      creditCards,
      notifications,
      summary,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addIncome,
      updateIncome,
      deleteIncome,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBudgetCategory,
      updateBudgetCategory,
      deleteBudgetCategory,
      addSavingsGoal,
      updateSavingsGoal,
      deleteSavingsGoal,
      markNotificationAsRead,
      deleteNotification,
      recalculateSummary,
      getTransactionsByCardId,
      getCurrentBillingCycleForCard
    }}>
      {children}
    </FinanceContext.Provider>
  );
}; 