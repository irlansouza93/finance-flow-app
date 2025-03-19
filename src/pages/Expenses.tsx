import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PlusCircle, CalendarRange, Edit, Trash2, Download, Filter, AlertTriangle, ChevronDown, Check, X, Home, CreditCard, Tag, DollarSign, Repeat, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import type { Transaction, CreditCard as CreditCardType } from '../types';

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
    recurrent: false,
    paymentMethod: 'pix'
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
    paymentStatus: 'paid',
    recurrent: true,
    frequency: 'monthly',
    paymentMethod: 'transfer'
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
    creditCardId: '1'
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
    creditCardId: '2'
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
    frequency: 'monthly',
    paymentMethod: 'debit'
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
    frequency: 'monthly',
    paymentMethod: 'pix'
  }
];

// Dados de exemplo de cartões de crédito
const creditCards: CreditCardType[] = [
  {
    id: '1',
    name: 'Nubank',
    lastDigits: '1234',
    limit: 5000,
    closingDay: 15,
    dueDay: 22,
    currentBalance: 1500,
    availableLimit: 3500,
    color: '#9C44DC'
  },
  {
    id: '2',
    name: 'Itaú',
    lastDigits: '5678',
    limit: 8000,
    closingDay: 10,
    dueDay: 17,
    currentBalance: 2500,
    availableLimit: 5500,
    color: '#EC7000'
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

// Função para obter o cartão de crédito pelo ID
const getCreditCardById = (cardId: string) => {
  return creditCards.find(card => card.id === cardId);
};

// Função para obter ícone do método de pagamento
const getPaymentMethodIcon = (method?: string) => {
  switch (method) {
    case 'credit':
      return <CreditCard className="w-4 h-4 text-red-500" />;
    case 'debit':
      return <CreditCard className="w-4 h-4 text-green-500" />;
    case 'pix':
      return <Tag className="w-4 h-4 text-blue-500 rotate-45" />;
    case 'transfer':
      return <Tag className="w-4 h-4 text-purple-500" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-500" />;
  }
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
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  
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
    const typeMatches = typeFilter === 'all' || (typeFilter === 'fixed' && transaction.expenseType === 'fixed') || (typeFilter === 'variable' && transaction.expenseType === 'variable');
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
          Despesas
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-4 pr-10 text-gray-700 dark:text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="30">Este mês</option>
              <option value="90">Últimos 3 meses</option>
              <option value="180">Últimos 6 meses</option>
              <option value="365">Este ano</option>
            </select>
            <CalendarRange className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => setShowNewExpenseModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>
      
      {/* Resumo de despesas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Despesas Totais</h3>
            <DollarSign className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">R$ {animatedTotal.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isOverBudget 
              ? <span className="text-red-500 font-medium">Orçamento excedido em {(budgetPercentage - 100).toFixed(0)}%</span>
              : `${budgetPercentage.toFixed(0)}% do orçamento utilizado`
            }
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Despesas Fixas</h3>
            <Repeat className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">R$ {totalFixedExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((totalFixedExpenses / totalExpenses) * 100)}% das despesas totais
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Despesas Variáveis</h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ {totalVariableExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((totalVariableExpenses / totalExpenses) * 100)}% das despesas totais
          </p>
        </div>
      </div>

      {/* Gráfico e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Distribuição de Despesas</h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={
                    typeFilter === 'fixed' 
                      ? fixedCategoryData 
                      : typeFilter === 'variable' 
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
                  {(typeFilter === 'fixed' 
                      ? fixedCategoryData 
                      : typeFilter === 'variable' 
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
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Filtrar por tipo:</h4>
            <div className="flex space-x-2">
              <button
                className={`text-sm px-3 py-1 rounded-full ${typeFilter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => setTypeFilter('all')}
              >
                Todas
              </button>
              <button
                className={`text-sm px-3 py-1 rounded-full ${typeFilter === 'fixed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => setTypeFilter('fixed')}
              >
                Fixas
              </button>
              <button
                className={`text-sm px-3 py-1 rounded-full ${typeFilter === 'variable' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => setTypeFilter('variable')}
              >
                Variáveis
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Despesas Recentes</h3>
            <div className="flex space-x-2">
              <button
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Filtros */}
          {showFilters && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-2 md:flex md:space-x-4">
                <div className="mb-3 md:mb-0">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Categoria
                  </label>
                  <select
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="Todas">Todas</option>
                    {Object.keys(categoryColors).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Tabela de despesas */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.expenseType === 'fixed' ? 'Fixa' : 'Variável'}
                            {transaction.recurrent && ' • Recorrente'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            style={{ backgroundColor: `${categoryColors[transaction.category as keyof typeof categoryColors]}20`, 
                                    color: categoryColors[transaction.category as keyof typeof categoryColors] }}>
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.paymentMethod === 'credit' && transaction.creditCardId
                            ? getCreditCardById(transaction.creditCardId)?.name
                            : transaction.paymentMethod === 'pix'
                            ? 'Pix'
                            : transaction.paymentMethod === 'debit'
                            ? 'Débito'
                            : transaction.paymentMethod === 'transfer'
                            ? 'Transferência'
                            : 'Dinheiro'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                      - R$ {transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal de nova despesa */}
      {showNewExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Nova Despesa</h3>
              <button 
                onClick={() => setShowNewExpenseModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="cash">Dinheiro</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="pix">Pix</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>
              
              {formData.paymentMethod === 'credit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cartão de Crédito
                  </label>
                  <select
                    name="creditCardId"
                    value={formData.creditCardId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Selecione um cartão</option>
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.name} (*{card.lastDigits})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
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
              
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowNewExpenseModal(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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