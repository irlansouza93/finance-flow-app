import { Transaction, IncomeSource, BudgetCategory, SavingsGoal, CreditCard, Notification } from '../types';

// Mock para transações
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 350.00,
    category: 'Supermercado',
    description: 'Compras da semana',
    date: '2024-03-15',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false,
    paymentMethod: 'debit'
  },
  {
    id: '2',
    amount: 12.90,
    category: 'Café',
    description: 'Café da manhã',
    date: '2024-03-15',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false,
    paymentMethod: 'cash'
  },
  {
    id: '3',
    amount: 1200.00,
    category: 'Aluguel',
    description: 'Aluguel março',
    date: '2024-03-14',
    type: 'expense',
    expenseType: 'fixed',
    recurrent: true,
    frequency: 'monthly',
    paymentStatus: 'paid',
    paymentMethod: 'transfer',
    dueDate: '2024-03-10'
  },
  {
    id: '4',
    amount: 80.00,
    category: 'Transporte',
    description: 'Gasolina',
    date: '2024-03-14',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false,
    paymentMethod: 'credit',
    creditCardId: 'card1'
  },
  {
    id: '5',
    amount: 120.00,
    category: 'Lazer',
    description: 'Cinema e jantar',
    date: '2024-03-10',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false,
    paymentMethod: 'credit',
    creditCardId: 'card1'
  },
  {
    id: '6',
    amount: 89.90,
    category: 'Internet',
    description: 'Internet março',
    date: '2024-03-05',
    type: 'expense',
    expenseType: 'fixed',
    recurrent: true,
    frequency: 'monthly',
    paymentStatus: 'paid',
    paymentMethod: 'debit',
    dueDate: '2024-03-05'
  },
  {
    id: '7',
    amount: 45.22,
    category: 'Água',
    description: 'Conta de água',
    date: '2024-03-02',
    type: 'expense',
    expenseType: 'fixed',
    recurrent: true,
    frequency: 'monthly',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    dueDate: '2024-03-15'
  }
];

// Mock para fontes de renda
export const mockIncomes: IncomeSource[] = [
  {
    id: '1',
    name: 'Salário',
    amount: 3500.00,
    date: '2024-03-05',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '2',
    name: 'Freelance',
    amount: 450.00,
    date: '2024-03-10',
    recurrent: false,
    frequency: 'one-time'
  },
  {
    id: '3',
    name: 'Dividendos',
    amount: 235.15,
    date: '2024-03-15',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '4',
    name: 'Aluguel',
    amount: 247.00,
    date: '2024-03-10',
    recurrent: true,
    frequency: 'monthly'
  }
];

// Mock para categorias de orçamento
export const mockBudgets: BudgetCategory[] = [
  {
    id: '1',
    name: 'Alimentação',
    allocated: 800,
    spent: 620,
    isFixed: false
  },
  {
    id: '2',
    name: 'Transporte',
    allocated: 400,
    spent: 350,
    isFixed: false
  },
  {
    id: '3',
    name: 'Moradia',
    allocated: 1200,
    spent: 1200,
    isFixed: true
  },
  {
    id: '4',
    name: 'Lazer',
    allocated: 500,
    spent: 320,
    isFixed: false
  },
  {
    id: '5',
    name: 'Utilidades',
    allocated: 300,
    spent: 250,
    isFixed: true
  }
];

// Mock para metas de economia
export const mockGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Férias',
    target: 5000,
    current: 2500,
    deadline: '2024-12-31'
  },
  {
    id: '2',
    name: 'Fundo de emergência',
    target: 10000,
    current: 4000,
    deadline: '2025-06-30'
  },
  {
    id: '3',
    name: 'Curso de especialização',
    target: 3000,
    current: 1200,
    deadline: '2024-08-15'
  }
];

// Mock para cartões de crédito
export const mockCreditCards: CreditCard[] = [
  {
    id: 'card1',
    name: 'Nubank',
    lastDigits: '1234',
    limit: 5000,
    closingDay: 20,
    dueDay: 5,
    currentBalance: 1200,
    availableLimit: 3800,
    color: '#8A05BE',
    brand: 'mastercard'
  },
  {
    id: 'card2',
    name: 'Itaú',
    lastDigits: '5678',
    limit: 8000,
    closingDay: 15,
    dueDay: 2,
    currentBalance: 2500,
    availableLimit: 5500,
    color: '#EC7000',
    brand: 'visa'
  }
];

// Mock para notificações
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Fatura próxima do vencimento',
    message: 'A fatura do seu cartão Nubank vence em 3 dias.',
    date: '2024-03-16T10:30:00',
    read: false,
    type: 'warning'
  },
  {
    id: '2',
    title: 'Meta de economia atingida',
    message: 'Você atingiu 50% da sua meta para Férias!',
    date: '2024-03-15T14:22:00',
    read: true,
    type: 'info',
    link: '/goals'
  },
  {
    id: '3',
    title: 'Orçamento excedido',
    message: 'Você já utilizou 90% do orçamento de Alimentação este mês.',
    date: '2024-03-14T09:15:00',
    read: false,
    type: 'alert',
    link: '/budget'
  }
]; 