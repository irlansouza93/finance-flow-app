import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PlusCircle, CalendarRange, Edit, Trash2, Download, Filter, AlertTriangle, ChevronDown, Check, X, DollarSign, Repeat, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import type { IncomeSource } from '../types';

// Dados de exemplo das fontes de renda
const incomeSources: IncomeSource[] = [
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

// Cores para categorias de renda
const incomeColors = {
  'Salário': '#10B981',
  'Freelance': '#6366F1',
  'Dividendos': '#F59E0B',
  'Aluguel': '#8B5CF6',
  'Bônus': '#EC4899',
  'Outros': '#6B7280'
};

// Agrupamento por categoria para o gráfico
const getIncomeChartData = () => {
  return Object.entries(
    incomeSources.reduce((acc: Record<string, number>, curr) => {
      if (!acc[curr.name]) acc[curr.name] = 0;
      acc[curr.name] += curr.amount;
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

export function Income() {
  const [dateFilter, setDateFilter] = useState('30');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showNewIncomeModal, setShowNewIncomeModal] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  
  // Dados para o gráfico
  const incomeChartData = getIncomeChartData();
  
  // Cálculo do total de renda
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);
  const recurrentIncome = incomeSources.filter(source => source.recurrent).reduce((sum, source) => sum + source.amount, 0);
  const nonRecurrentIncome = totalIncome - recurrentIncome;
  
  // Animação do total
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTotal(prev => {
        const diff = totalIncome - prev;
        const increment = diff / 10;
        return Math.abs(diff) < 1 ? totalIncome : prev + increment;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [totalIncome]);

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Fontes de Renda
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
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => setShowNewIncomeModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nova Renda</span>
          </button>
        </div>
      </div>
      
      {/* Resumo de renda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Renda Total</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">R$ {animatedTotal.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {incomeSources.length} fonte(s) de renda
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Renda Fixa</h3>
            <Repeat className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">R$ {recurrentIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((recurrentIncome / totalIncome) * 100)}% da renda total
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">Renda Variável</h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">R$ {nonRecurrentIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round((nonRecurrentIncome / totalIncome) * 100)}% da renda total
          </p>
        </div>
      </div>
      
      {/* Gráfico e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Distribuição de Renda</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {incomeChartData.map((entry: { name: string, value: number }, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={incomeColors[entry.name as keyof typeof incomeColors] || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Fontes de Renda</h3>
            <div className="flex gap-3">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fonte</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recorrência</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {incomeSources.map(source => (
                  <tr 
                    key={source.id} 
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: incomeColors[source.name as keyof typeof incomeColors] || '#CBD5E0' }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{source.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(source.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {source.recurrent ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          Mensal
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          Única
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                      R$ {source.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex justify-end space-x-3">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total:
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                    R$ {totalIncome.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal para adicionar nova fonte de renda */}
      {showNewIncomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Nova Fonte de Renda</h3>
              <button 
                onClick={() => setShowNewIncomeModal(false)}
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
              
              <div className="space-y-2">
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
                
                <div className="pl-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequência
                  </label>
                  <select className="input">
                    <option value="monthly">Mensal</option>
                    <option value="weekly">Semanal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNewIncomeModal(false)}
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