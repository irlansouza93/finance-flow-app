import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PlusCircle, CalendarRange, Edit, Trash2, Download, Filter, AlertTriangle, ChevronDown, Check, X, Home, CreditCard, Tag } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import type { Transaction } from '../types';

// Dados de exemplo das transações com tipo de despesa (fixa ou variável)
const transactions: Transaction[] = [
  {
    id: '1',
    amount: 350.00,
    category: 'Supermercado',
    description: 'Compras da semana',
    date: '2024-03-15',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false
  },
  {
    id: '2',
    amount: 12.90,
    category: 'Café',
    description: 'Café da manhã',
    date: '2024-03-15',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false
  },
  {
    id: '3',
    amount: 1200.00,
    category: 'Aluguel',
    description: 'Aluguel março',
    date: '2024-03-14',
    type: 'expense',
    expenseType: 'fixed',
    paymentStatus: 'paid',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '4',
    amount: 80.00,
    category: 'Transporte',
    description: 'Gasolina',
    date: '2024-03-14',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false
  },
  {
    id: '5',
    amount: 120.00,
    category: 'Lazer',
    description: 'Cinema e jantar',
    date: '2024-03-10',
    type: 'expense',
    expenseType: 'variable',
    recurrent: false
  },
  {
    id: '6',
    amount: 89.90,
    category: 'Internet',
    description: 'Internet março',
    date: '2024-03-05',
    type: 'expense',
    expenseType: 'fixed',
    paymentStatus: 'paid',
    recurrent: true,
    frequency: 'monthly'
  },
  {
    id: '7',
    amount: 45.22,
    category: 'Água',
    description: 'Conta de água',
    date: '2024-03-02',
    type: 'expense',
    expenseType: 'fixed',
    paymentStatus: 'pending',
    recurrent: true,
    frequency: 'monthly'
  }
];

const categoryColors = {
  'Supermercado': '#4299E1',
  'Café': '#ED8936',
  'Aluguel': '#805AD5',
  'Transporte': '#48BB78',
  'Lazer': '#F56565',
  'Internet': '#F6AD55',
  'Água': '#38B2AC'
};

// Função para agrupar por categoria
const getCategoryData = (data: Transaction[], type?: 'fixed' | 'variable') => {
  const filtered = type 
    ? data.filter(t => t.expenseType === type) 
    : data;
  
  return Object.entries(
    filtered.reduce((acc: Record<string, number>, curr) => {
      if (!acc[curr.category]) acc[curr.category] = 0;
      acc[curr.category] += curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
};

// Componente de setor ativo do gráfico de pizza
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#333" className="font-medium dark:fill-gray-200">
        {payload.name}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#999" className="text-sm dark:fill-gray-400">
        R$ {value.toFixed(2)} ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        className="filter blur-[1px] opacity-60"
      />
    </g>
  );
};

export function Expenses() {
  const {
    transactions,
    creditCards,
    addTransaction,
    deleteTransaction,
    budgetCategories,
    summary
  } = useFinance();
  
  const [dateFilter, setDateFilter] = useState('30');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<'all' | 'fixed' | 'variable'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartType, setChartType] = useState<'all' | 'fixed' | 'variable'>('all');
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    expenseType: 'variable',
    recurrent: false,
    frequency: 'monthly',
    paymentMethod: 'cash',
    creditCardId: '',
    dueDate: '',
    paymentStatus: 'paid'
  });
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0) || 5000;

  // Filtragem de transações
  const availableCategories = ['Todas', ...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))];
  
  const filteredTransactions = transactions.filter(transaction => {
    if (transaction.type !== 'expense') return false;
    const categoryMatches = categoryFilter === 'Todas' || transaction.category === categoryFilter;
    const typeMatches = expenseTypeFilter === 'all' || transaction.expenseType === expenseTypeFilter;
    return categoryMatches && typeMatches;
  });
  
  // Dados para os gráficos
  const allCategoryData = getCategoryData(filteredTransactions);
  const fixedCategoryData = getCategoryData(filteredTransactions.filter(t => t.expenseType === 'fixed'));
  const variableCategoryData = getCategoryData(filteredTransactions.filter(t => t.expenseType === 'variable'));
  
  // Cálculo do total de despesas (usando summary do contexto)
  const totalExpenses = summary.fixedExpenses + summary.variableExpenses;
  const totalFixedExpenses = summary.fixedExpenses;
  const totalVariableExpenses = summary.variableExpenses;
  
  const totalFilteredExpenses = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const budgetPercentage = (totalExpenses / totalBudget) * 100;
  const isOverBudget = budgetPercentage > 100;
  const isNearBudget = budgetPercentage > 80 && budgetPercentage <= 100;
  
  // Animação do total
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTotal(prev => {
        const diff = totalExpenses - prev;
        const increment = diff / 10;
        return Math.abs(diff) < 1 ? totalExpenses : prev + increment;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [totalExpenses]);
  
  // Resetar formulário 
  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      expenseType: 'variable',
      recurrent: false,
      frequency: 'monthly',
      paymentMethod: 'cash',
      creditCardId: '',
      dueDate: '',
      paymentStatus: 'paid'
    });
  };
  
  // Gerenciar o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Omit<Transaction, 'id'> = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      type: 'expense',
      expenseType: formData.expenseType as 'fixed' | 'variable',
      recurrent: formData.recurrent,
      frequency: formData.recurrent ? formData.frequency as 'monthly' | 'weekly' | 'yearly' | 'one-time' : undefined,
      paymentMethod: formData.paymentMethod as Transaction['paymentMethod'],
      paymentStatus: formData.paymentStatus as 'pending' | 'paid',
      creditCardId: formData.paymentMethod === 'credit' ? formData.creditCardId : undefined,
      dueDate: formData.dueDate || undefined
    };
    
    addTransaction(transaction);
    resetForm();
    setShowNewExpenseModal(false);
  };
  
  // Gerenciar mudanças no formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'radio' && name === 'expenseType') {
      setFormData({
        ...formData,
        [name]: value
      });
    } else if (type === 'radio' && name === 'recurrent') {
      setFormData({
        ...formData,
        recurrent: value === 'yes'
      });
    } else if (type === 'radio' && name === 'paymentStatus') {
      setFormData({
        ...formData,
        paymentStatus: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Atualizar exibição de campos com base no método de pagamento
  useEffect(() => {
    const creditCardField = document.getElementById('creditCardSelect')?.parentElement;
    const dueDateField = document.getElementById('dueDateInput')?.parentElement;
    
    if (formData.paymentMethod === 'credit') {
      if (creditCardField) creditCardField.style.display = 'block';
    } else {
      if (creditCardField) creditCardField.style.display = 'none';
    }
    
    if (formData.paymentMethod === 'credit' || ['pix', 'transfer', 'debit'].includes(formData.paymentMethod)) {
      if (dueDateField) dueDateField.style.display = 'none';
    } else {
      if (dueDateField) dueDateField.style.display = 'block';
    }
  }, [formData.paymentMethod]);

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Controle de Despesas
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-4 pr-10 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 3 meses</option>
              <option value="365">Último ano</option>
            </select>
            <CalendarRange className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => setShowNewExpenseModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>
      
      {/* Barra de progresso do orçamento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Progresso do Orçamento Mensal</h3>
            {isOverBudget && (
              <div className="ml-2 bg-red-100 dark:bg-red-900 px-2 py-0.5 rounded-full flex items-center">
                <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400 mr-1" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">Orçamento excedido</span>
              </div>
            )}
            {isNearBudget && (
              <div className="ml-2 bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded-full flex items-center">
                <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400 mr-1" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Próximo ao limite</span>
              </div>
            )}
          </div>
          <span className="text-sm font-medium">
            <span className={`
              ${isOverBudget ? 'text-red-600 dark:text-red-400' : 
                isNearBudget ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-green-600 dark:text-green-400'}
            `}>
              R$ {animatedTotal.toFixed(2)}
            </span>
            <span className="text-gray-500 dark:text-gray-400"> / R$ {totalBudget.toFixed(2)}</span>
          </span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              isOverBudget 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : isNearBudget
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                  : 'bg-gradient-to-r from-green-400 to-green-500'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          >
            {budgetPercentage > 20 && (
              <span className="absolute ml-4 text-xs font-bold text-white drop-shadow-md" style={{ lineHeight: '1rem' }}>
                {budgetPercentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabela de transações */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Transações Recentes</h3>
          <div className="flex gap-3">
            <div className="relative">
              <select 
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-1.5 pl-3 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`
                    ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'} 
                    hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: categoryColors[transaction.category as keyof typeof categoryColors] || '#CBD5E0' 
                        }}
                      />
                      <span className="text-sm text-gray-900 dark:text-gray-200">{transaction.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                    -R$ {transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-right">
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Ver todas as transações →
          </button>
        </div>
      </div>
      
      {/* Gráfico de distribuição de despesas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Distribuição de Despesas por Categoria</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={
                  chartType === 'fixed' 
                    ? fixedCategoryData 
                    : chartType === 'variable' 
                      ? variableCategoryData 
                      : allCategoryData
                }
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {(chartType === 'fixed' 
                    ? fixedCategoryData 
                    : chartType === 'variable' 
                      ? variableCategoryData 
                      : allCategoryData
                ).map((entry: { name: string, value: number }, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={categoryColors[entry.name as keyof typeof categoryColors] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `R$ ${Number(value).toFixed(2)}`} 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ padding: '4px 0' }}
              />
              <Legend 
                layout="horizontal" 
                align="center"
                verticalAlign="bottom"
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Modal para adicionar nova despesa */}
      {showNewExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg animate-fade-in-up">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Adicionar Nova Despesa
              </h3>
              <button 
                onClick={() => setShowNewExpenseModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Compras do supermercado"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      required
                      min="0.01"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0,00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Selecione uma categoria</option>
                    {availableCategories.filter(cat => cat !== 'Todas').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="other">Outra (especificar)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Despesa
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="expenseType"
                          value="fixed"
                          checked={formData.expenseType === 'fixed'}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Fixa</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="expenseType"
                          value="variable"
                          checked={formData.expenseType === 'variable'}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Variável</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recorrência
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="recurrent"
                          value="yes"
                          checked={formData.recurrent}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recorrente</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="recurrent"
                          value="no"
                          checked={!formData.recurrent}
                          onChange={handleFormChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Única</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {formData.recurrent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequência
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="monthly">Mensal</option>
                      <option value="weekly">Semanal</option>
                      <option value="yearly">Anual</option>
                      <option value="one-time">Única vez</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="cash">Dinheiro</option>
                    <option value="debit">Cartão de Débito</option>
                    <option value="credit">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                    <option value="transfer">Transferência Bancária</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                
                <div id="creditCardSelect" style={{ display: formData.paymentMethod === 'credit' ? 'block' : 'none' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartão de Crédito
                  </label>
                  <select
                    name="creditCardId"
                    value={formData.creditCardId}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Selecione um cartão</option>
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>{card.name}</option>
                    ))}
                    <option value="new">Adicionar Novo Cartão...</option>
                  </select>
                </div>
                
                <div id="dueDateInput" style={{ display: formData.paymentMethod !== 'credit' && !['pix', 'transfer', 'debit'].includes(formData.paymentMethod) ? 'block' : 'none' }}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status de Pagamento
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentStatus"
                        value="paid"
                        checked={formData.paymentStatus === 'paid'}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pago</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentStatus"
                        value="pending"
                        checked={formData.paymentStatus === 'pending'}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pendente</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowNewExpenseModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Adicionar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}