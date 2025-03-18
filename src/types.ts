/**
 * # Interface de Transação
 * Representa uma movimentação financeira (receita ou despesa) no sistema
 */
export interface Transaction {
  id: string;                  // # ID único da transação
  amount: number;              // # Valor da transação em reais
  category: string;            // # Categoria da transação (ex: Alimentação, Transporte)
  description: string;         // # Descrição detalhada da transação
  date: string;                // # Data da transação no formato ISO
  type: 'income' | 'expense';  // # Tipo da transação: receita ou despesa
  recurrent: boolean;          // # Indica se a transação é recorrente
  frequency?: 'monthly' | 'weekly' | 'yearly' | 'one-time';  // # Frequência da recorrência
  expenseType?: 'fixed' | 'variable';  // # Tipo de despesa: fixa ou variável
  paymentStatus?: 'pending' | 'paid';  // # Status do pagamento: pendente ou pago
  paymentMethod?: 'cash' | 'debit' | 'credit' | 'transfer' | 'pix';  // # Método de pagamento
  creditCardId?: string;       // # ID do cartão de crédito (se aplicável)
  dueDate?: string;            // # Data de vencimento (se aplicável)
}

/**
 * # Interface de Categoria de Orçamento
 * Representa uma categoria com orçamento alocado e gastos realizados
 */
export interface BudgetCategory {
  id: string;          // # ID único da categoria
  name: string;        // # Nome da categoria de orçamento
  allocated: number;   // # Valor alocado/orçado para esta categoria
  spent: number;       // # Valor já gasto nesta categoria
  isFixed?: boolean;   // # Indica se é uma categoria de despesa fixa
}

/**
 * # Interface de Meta de Economia
 * Representa uma meta financeira com objetivo, progresso e prazo
 */
export interface SavingsGoal {
  id: string;        // # ID único da meta
  name: string;      // # Nome/título da meta
  target: number;    // # Valor objetivo a ser alcançado
  current: number;   // # Valor atual economizado
  deadline: string;  // # Prazo final para atingir a meta
}

/**
 * # Interface de Fonte de Renda
 * Representa uma fonte de renda do usuário
 */
export interface IncomeSource {
  id: string;         // # ID único da fonte de renda
  name: string;       // # Nome da fonte de renda (ex: Salário, Freelance)
  amount: number;     // # Valor da renda
  date: string;       // # Data de recebimento
  recurrent: boolean; // # Indica se a renda é recorrente
  frequency?: 'monthly' | 'weekly' | 'yearly' | 'one-time';  // # Frequência da recorrência
}

/**
 * # Interface de Cartão de Crédito
 * Representa um cartão de crédito com suas informações e saldo
 */
export interface CreditCard {
  id: string;            // # ID único do cartão
  name: string;          // # Nome do cartão
  lastDigits: string;    // # Últimos 4 dígitos do cartão
  limit: number;         // # Limite total do cartão
  closingDay: number;    // # Dia do fechamento da fatura (1-31)
  dueDay: number;        // # Dia do vencimento da fatura (1-31)
  currentBalance: number; // # Saldo atual utilizado
  availableLimit: number; // # Limite disponível para uso
  color?: string;         // # Cor representativa do cartão na UI
  transactions?: Transaction[]; // # Transações associadas ao cartão
  brand?: 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'other'; // # Bandeira do cartão
}

/**
 * # Interface de Notificação
 * Representa uma notificação do sistema para o usuário
 */
export interface Notification {
  id: string;                       // # ID único da notificação
  title: string;                    // # Título da notificação
  message: string;                  // # Mensagem detalhada
  date: string;                     // # Data da notificação
  read: boolean;                    // # Indica se a notificação foi lida
  type: 'info' | 'warning' | 'alert'; // # Tipo/severidade da notificação
  link?: string;                    // # Link associado (se aplicável)
}

/**
 * # Interface de Resumo Financeiro
 * Agrega valores financeiros importantes para exibição no dashboard
 */
export interface FinancialSummary {
  totalIncome: number;        // # Total de receitas
  fixedExpenses: number;      // # Total de despesas fixas
  variableExpenses: number;   // # Total de despesas variáveis
  remainingMoney: number;     // # Dinheiro restante após despesas
  totalBalance: number;       // # Saldo total disponível
  creditCardExpenses: number; // # Total de despesas em cartões de crédito
  pendingBills: number;       // # Total de contas pendentes
}