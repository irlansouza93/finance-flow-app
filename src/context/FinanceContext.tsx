import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, IncomeSource, BudgetCategory, SavingsGoal, CreditCard, FinancialSummary, Notification } from '../types';

// Mock data (em produção isso seria carregado de uma API)
import { 
  mockTransactions, 
  mockIncomes, 
  mockBudgets, 
  mockGoals, 
  mockCreditCards,
  mockNotifications
} from '../data/mockData';

interface FinanceContextType {
  // Dados
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  budgetCategories: BudgetCategory[];
  savingsGoals: SavingsGoal[];
  creditCards: CreditCard[];
  notifications: Notification[];
  summary: FinancialSummary;
  
  // Funções para atualizar dados
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  addIncome: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncome: (income: IncomeSource) => void;
  deleteIncome: (id: string) => void;
  
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (card: CreditCard) => void;
  deleteCreditCard: (id: string) => void;
  
  addBudgetCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateBudgetCategory: (category: BudgetCategory) => void;
  deleteBudgetCategory: (id: string) => void;
  
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  deleteSavingsGoal: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  
  // Funções de utilidade
  recalculateSummary: () => void;
  getTransactionsByCardId: (cardId: string) => Transaction[];
  getCurrentBillingCycleForCard: (cardId: string) => { 
    transactions: Transaction[],
    totalAmount: number,
    closeDate: Date,
    dueDate: Date
  } | null;
}

// Valor default para o contexto
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

// Criação do contexto
const FinanceContext = createContext<FinanceContextType>(defaultContext);

// Hook personalizado para usar o contexto
export const useFinance = () => useContext(FinanceContext);

// Provider component
interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  // Estados para os diferentes tipos de dados
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

  // Função para gerar um ID único
  const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

  // Funções para gerenciar transações
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() };
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

  // Funções para gerenciar fontes de renda
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

  // Funções para gerenciar cartões de crédito
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

  // Funções para gerenciar categorias de orçamento
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

  // Funções para gerenciar metas de economia
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

  // Funções para gerenciar notificações
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, read: true } : item)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // Função para recalcular o resumo financeiro
  const recalculateSummary = () => {
    const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
    
    const fixedExpenses = transactions
      .filter(t => t.type === 'expense' && t.expenseType === 'fixed')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const variableExpenses = transactions
      .filter(t => t.type === 'expense' && t.expenseType === 'variable')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const creditCardExpenses = transactions
      .filter(t => t.type === 'expense' && t.paymentMethod === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const pendingBills = transactions
      .filter(t => t.type === 'expense' && t.paymentStatus === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remainingMoney = totalIncome - fixedExpenses - variableExpenses;
    const totalBalance = remainingMoney;
    
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

  // Função para obter transações de um cartão específico
  const getTransactionsByCardId = (cardId: string) => {
    return transactions.filter(t => t.creditCardId === cardId);
  };

  // Função para obter informações do ciclo de faturamento atual de um cartão
  const getCurrentBillingCycleForCard = (cardId: string) => {
    const card = creditCards.find(c => c.id === cardId);
    if (!card) return null;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Data de fechamento deste mês
    const closeDate = new Date(currentYear, currentMonth, card.closingDay);
    
    // Se já passou a data de fechamento, o próximo fechamento é no mês seguinte
    if (today > closeDate) {
      closeDate.setMonth(closeDate.getMonth() + 1);
    }
    
    // Data de vencimento
    const dueDate = new Date(closeDate);
    if (card.dueDay < card.closingDay) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    dueDate.setDate(card.dueDay);
    
    // Data de fechamento do ciclo anterior
    const prevCloseDate = new Date(closeDate);
    prevCloseDate.setMonth(prevCloseDate.getMonth() - 1);
    
    // Transações deste ciclo (entre fechamento anterior e atual)
    const cycleTransactions = transactions.filter(t => {
      if (t.creditCardId !== cardId) return false;
      
      const txDate = new Date(t.date);
      return txDate > prevCloseDate && txDate <= closeDate;
    });
    
    const totalAmount = cycleTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      transactions: cycleTransactions,
      totalAmount,
      closeDate,
      dueDate
    };
  };

  // Efeito para recalcular o resumo sempre que houver mudanças nos dados
  useEffect(() => {
    recalculateSummary();
  }, [transactions, incomeSources]);

  // Valor fornecido pelo contexto
  const value: FinanceContextType = {
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
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}; 