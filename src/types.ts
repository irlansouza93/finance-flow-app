export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  recurrent: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly' | 'one-time';
  expenseType?: 'fixed' | 'variable';
  paymentStatus?: 'pending' | 'paid';
  paymentMethod?: 'cash' | 'debit' | 'credit' | 'transfer' | 'pix';
  creditCardId?: string;
  dueDate?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  isFixed?: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  date: string;
  recurrent: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly' | 'one-time';
}

export interface CreditCard {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  currentBalance: number;
  availableLimit: number;
  color?: string;
  transactions?: Transaction[];
  brand?: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'alert';
  link?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  remainingMoney: number;
  totalBalance: number;
  creditCardExpenses: number;
  pendingBills: number;
}