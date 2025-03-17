import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target, 
  Search, 
  Edit,
  DollarSign,
  ShoppingCart,
  PieChart,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Eye,
  Plus,
  Home,
  CreditCard,
  X
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';

interface MiniChartProps {
  data: number[];
  increasing: boolean;
}

function MiniChart({ data, increasing }: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  return (
    <div className="flex items-end h-10 space-x-0.5">
      {data.map((value, i) => {
        const height = range === 0 ? 50 : ((value - min) / range) * 100;
        return (
          <div 
            key={i} 
            className={`w-1 rounded-sm ${increasing ? 'bg-green-500' : 'bg-red-500'}`} 
            style={{ height: `${Math.max(15, height)}%` }}
          />
        );
      })}
    </div>
  );
}

function BalanceChart({ totalIncome, fixedExpenses, variableExpenses }: { 
  totalIncome: number, 
  fixedExpenses: number, 
  variableExpenses: number 
}) {
  const balanceData = [
    { name: 'Renda', value: totalIncome, color: '#10B981' },  // Verde
    { name: 'Despesas Fixas', value: fixedExpenses, color: '#F87171' }, // Vermelho
    { name: 'Despesas Variáveis', value: variableExpenses, color: '#FBBF24' } // Amarelo
  ];
  
  const total = totalIncome + fixedExpenses + variableExpenses;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Balanço Financeiro</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={balanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {balanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend verticalAlign="bottom" />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Renda</p>
          <p className="text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-gray-400">{total > 0 ? `${Math.round((totalIncome / total) * 100)}%` : '0%'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Despesas Fixas</p>
          <p className="text-sm font-semibold text-red-500 dark:text-red-400">{formatCurrency(fixedExpenses)}</p>
          <p className="text-xs text-gray-400">{total > 0 ? `${Math.round((fixedExpenses / total) * 100)}%` : '0%'}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Despesas Variáveis</p>
          <p className="text-sm font-semibold text-yellow-500 dark:text-yellow-400">{formatCurrency(variableExpenses)}</p>
          <p className="text-xs text-gray-400">{total > 0 ? `${Math.round((variableExpenses / total) * 100)}%` : '0%'}</p>
        </div>
      </div>
    </div>
  );
}

export function OverviewCards() {
  const { summary, transactions, incomeSources } = useFinance();
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  
  // Dados para as mini-charts (poderiam ser calculados com base no histórico)
  const incomeData = [30, 35, 40, 38, 42, 45, 48];
  const expenseData = [25, 28, 24, 26, 22, 23, 22];
  const budgetData = [35, 32, 38, 40, 42, 41, 44];
  const savingsData = [10, 15, 20, 28, 35, 45, 65];
  
  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Cálculo de percentual de variação (mockado por enquanto)
  const percentVariation = 8;
  
  // Obter despesas fixas e variáveis
  const fixedExpenses = transactions
    .filter(t => t.type === 'expense' && t.expenseType === 'fixed')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
    
  const variableExpenses = transactions
    .filter(t => t.type === 'expense' && t.expenseType === 'variable')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);
    
  const totalFixedExpenses = summary.fixedExpenses;
  const totalVariableExpenses = summary.variableExpenses;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
          title="Renda Total"
          value={formatCurrency(summary.totalIncome)}
          icon={<DollarSign className="w-7 h-7 text-white" />}
          iconBg="bg-green-500"
          trend={`${percentVariation > 0 ? '+' : ''}${percentVariation}% vs. último mês`}
          trendIcon={<ArrowUpRight className="w-4 h-4" />}
        trendColor="text-green-500"
          miniChart={<MiniChart data={incomeData} increasing={true} />}
          actionLabel="Adicionar Renda"
          actionIcon={<Plus className="w-3.5 h-3.5" />}
          onActionClick={() => setShowIncomeModal(true)}
      />
      <Card
        title="Despesas"
          value={formatCurrency(summary.fixedExpenses + summary.variableExpenses)}
          icon={<ShoppingCart className="w-7 h-7 text-white" />}
          iconBg="bg-red-500"
        trend="-3% vs. último mês"
          trendIcon={<ArrowDownRight className="w-4 h-4" />}
        trendColor="text-red-500"
          miniChart={<MiniChart data={expenseData} increasing={false} />}
          secondaryInfo={
            <div className="mt-2 flex justify-between text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                <span className="text-gray-500 dark:text-gray-400">Fixas: {formatCurrency(summary.fixedExpenses)}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                <span className="text-gray-500 dark:text-gray-400">Variáveis: {formatCurrency(summary.variableExpenses)}</span>
              </div>
            </div>
          }
      />
      <Card
          title="Dinheiro Restante"
          value={formatCurrency(summary.remainingMoney)}
          icon={<Wallet className="w-7 h-7 text-white" />}
          iconBg="bg-blue-500"
          trend={`${Math.round((summary.remainingMoney / summary.totalIncome) * 100)}% da renda`}
          trendIcon={<ArrowUpRight className="w-4 h-4" />}
        trendColor="text-blue-500"
          miniChart={<MiniChart data={budgetData} increasing={true} />}
      />
      <Card
          title="Saldo Total"
          value={formatCurrency(summary.totalBalance)}
          icon={<PiggyBank className="w-7 h-7 text-white" />}
          iconBg="bg-purple-500"
          trend="+15% este mês"
        trendColor="text-purple-500"
          showProgressCircle={true}
          miniChart={<MiniChart data={savingsData} increasing={true} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Despesas Fixas</h3>
              <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {fixedExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{expense.description}</span>
                  <span className="text-sm font-semibold">{formatCurrency(expense.amount)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Total</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalFixedExpenses)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                <Eye className="w-3.5 h-3.5 mr-1" />
                Ver todos
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Despesas Variáveis</h3>
              <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {variableExpenses.map(expense => (
                <div key={expense.id} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{expense.description}</span>
                  <span className="text-sm font-semibold">{formatCurrency(expense.amount)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Total</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalVariableExpenses)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                <Eye className="w-3.5 h-3.5 mr-1" />
                Ver todos
              </button>
            </div>
          </div>
        </div>
        
        <BalanceChart 
          totalIncome={summary.totalIncome} 
          fixedExpenses={summary.fixedExpenses} 
          variableExpenses={summary.variableExpenses} 
        />
      </div>
      
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Adicionar Fonte de Renda</h3>
              <button 
                onClick={() => setShowIncomeModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input 
                  type="text" 
                  className="input"
                  placeholder="Ex: Salário, Freelance"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor (R$)
                </label>
                <input 
                  type="number" 
                  className="input"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de recebimento
                </label>
                <input 
                  type="date" 
                  className="input"
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="recurrent" 
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="recurrent" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Renda recorrente
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowIncomeModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend: string;
  trendColor: string;
  trendIcon?: React.ReactNode;
  showProgressCircle?: boolean;
  miniChart?: React.ReactNode;
  secondaryInfo?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onActionClick?: () => void;
}

function Card({ 
  title, 
  value, 
  icon, 
  iconBg, 
  trend, 
  trendColor, 
  trendIcon, 
  showProgressCircle = false,
  miniChart,
  secondaryInfo,
  actionLabel,
  actionIcon,
  onActionClick
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{title}</h3>
        <div className={`p-2 ${iconBg} rounded-lg shadow-sm`}>
        {icon}
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {miniChart && <div className="w-24 h-10">{miniChart}</div>}
      </div>
      
      <div className="flex justify-between items-center">
        <p className={`text-sm font-medium ${trendColor} flex items-center`}>
          {trendIcon && <span className="mr-1">{trendIcon}</span>}
          {trend}
        </p>
        {showProgressCircle && (
          <div className="w-10 h-10 relative">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e6e6e6" strokeWidth="2" className="dark:opacity-20"></circle>
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="#a855f7" 
                strokeWidth="3" 
                strokeDasharray="100" 
                strokeDashoffset="20" 
                strokeLinecap="round"
                className="transform -rotate-90 origin-center"
              ></circle>
            </svg>
          </div>
        )}
      </div>
      
      {secondaryInfo && (
        <div className="mt-1">
          {secondaryInfo}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        {actionLabel && actionIcon ? (
          <button 
            onClick={onActionClick}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            {actionIcon}
            <span className="ml-1">{actionLabel}</span>
          </button>
        ) : (
          <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
            <Eye className="w-3.5 h-3.5 mr-1" />
            Ver detalhes
          </button>
        )}
        <button className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Efeito de brilho quando hover */}
      <div className={`absolute -right-12 top-0 w-24 h-full bg-white dark:bg-gray-700 opacity-20 transform rotate-12 transition-all duration-1000 ${isHovered ? 'translate-x-24' : 'translate-x-0'}`}></div>
    </div>
  );
}