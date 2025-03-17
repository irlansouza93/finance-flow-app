import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  PlusCircle, Calendar, CheckCircle, Clock, TrendingUp, ChevronRight, 
  Edit, AlertTriangle, DollarSign, X, Plus, History, Award, PiggyBank
} from 'lucide-react';
import type { SavingsGoal } from '../types';
import { useFinance } from '../context/FinanceContext';

export function Goals() {
  const { savingsGoals, updateSavingsGoal, addSavingsGoal } = useFinance();
  const [goals, setGoals] = useState<SavingsGoal[]>(savingsGoals);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<SavingsGoal | null>(null);
  const [valueToAdd, setValueToAdd] = useState<number>(0);
  const [animatedValues, setAnimatedValues] = useState<{[key: string]: number}>({});
  const [newGoal, setNewGoal] = useState<{
    name: string;
    target: number;
    deadline: string;
  }>({
    name: '',
    target: 0,
    deadline: new Date().toISOString().split('T')[0]
  });
  
  const modalRef = useRef<HTMLDivElement>(null);

  // Atualizar metas quando mudarem no contexto
  useEffect(() => {
    setGoals(savingsGoals);
  }, [savingsGoals]);

  useEffect(() => {
    // Inicializar valores animados com zero
    const initialAnimatedValues: {[key: string]: number} = {};
    goals.forEach(goal => {
      initialAnimatedValues[goal.id] = 0;
    });
    setAnimatedValues(initialAnimatedValues);

    // Animar valores para os reais ao longo do tempo
    const timeout = setTimeout(() => {
      const finalAnimatedValues: {[key: string]: number} = {};
      goals.forEach(goal => {
        finalAnimatedValues[goal.id] = goal.current;
      });
      setAnimatedValues(finalAnimatedValues);
    }, 500);

    return () => clearTimeout(timeout);
  }, [goals]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowHistoryModal(false);
        setShowAddValueModal(false);
        setShowNewGoalModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isGoalCompleted = (goal: SavingsGoal) => goal.current >= goal.target;
  const isGoalLate = (goal: SavingsGoal) => new Date(goal.deadline) < new Date() && !isGoalCompleted(goal);
  
  const daysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleShowAddValue = (goal: SavingsGoal) => {
    setActiveGoal(goal);
    setValueToAdd(0);
    setShowAddValueModal(true);
  };

  const handleAddValue = () => {
    if (!activeGoal || valueToAdd <= 0) return;

    const updatedGoal = {
      ...activeGoal,
      current: activeGoal.current + valueToAdd
    };
    
    updateSavingsGoal(updatedGoal);
    setShowAddValueModal(false);
  };
  
  const handleAddNewGoal = () => {
    if (!newGoal.name || newGoal.target <= 0 || !newGoal.deadline) return;
    
    addSavingsGoal({
      name: newGoal.name,
      target: newGoal.target,
      current: 0,
      deadline: newGoal.deadline
    });
    
    setNewGoal({
      name: '',
      target: 0,
      deadline: new Date().toISOString().split('T')[0]
    });
    
    setShowNewGoalModal(false);
  };

  // Calcular os dados de progresso para o gráfico
  const calculateProgressData = () => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    
    // Crie um total acumulado para os últimos 7 meses
    return Array.from({ length: 7 }, (_, i) => {
      const monthIndex = (currentMonth - 6 + i + 12) % 12;
      const value = goals.reduce((sum, goal) => {
        // Simular um progresso gradual para cada meta
        const percentage = Math.min(1, (i + 1) / 7);
        return sum + (goal.current * percentage);
      }, 0);
      
      return {
        name: months[monthIndex],
        valor: Math.round(value)
      };
    });
  };

  const progressData = calculateProgressData();
  const completedGoals = goals.filter(isGoalCompleted);
  const inProgressGoals = goals.filter(goal => !isGoalCompleted(goal));
  
  // Calcular total economizado e meta total
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const savingsPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Metas Financeiras
        </h2>
        <button 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg self-start sm:self-auto"
          onClick={() => setShowNewGoalModal(true)}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Adicionar Nova Meta</span>
        </button>
      </div>
      
      {/* Progresso total */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Progresso de Economias</h3>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-1.5 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Total Economizado: {formatCurrency(totalSaved)} ({savingsPercentage.toFixed(1)}%)
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis dataKey="name" stroke="#9ca3af" className="dark:text-gray-400" />
              <YAxis 
                stroke="#9ca3af"
                tickFormatter={(value) => `R$${value.toLocaleString()}`}
                className="dark:text-gray-400"
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(Number(value)), 'Valor Economizado']}
                labelFormatter={(label) => `${label}/2024`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                animationDuration={1500}
                animationBegin={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
          {inProgressGoals.length > 0 
            ? `Você está ${totalSaved > totalTarget / 2 ? 'bem encaminhado' : 'progredindo'} com suas metas de economia.`
            : completedGoals.length > 0 
              ? 'Parabéns! Você concluiu todas as suas metas de economia!'
              : 'Adicione metas de economia para acompanhar seu progresso.'}
        </p>
      </div>
      
      {/* Lista de metas */}
      {goals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10 border border-gray-100 dark:border-gray-700 text-center">
          <div className="mb-4 flex justify-center">
            <PiggyBank className="w-16 h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma meta definida</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Defina metas para ajudar a organizar suas economias e atingir seus objetivos financeiros.</p>
          <button 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => setShowNewGoalModal(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Criar Primeira Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inProgressGoals.map((goal) => {
            const animatedCurrent = animatedValues[goal.id] || 0;
            const percentage = Math.min(100, (animatedCurrent / goal.target) * 100);
            const completed = isGoalCompleted(goal);
            const late = isGoalLate(goal);
            const days = daysLeft(goal.deadline);
            
            return (
              <div 
                key={goal.id} 
                className={`
                  bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4
                  ${completed ? 'border-green-500' : late ? 'border-red-500' : 'border-blue-500'}
                  transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700 border-l-4
                `}
              >
                {late && !completed && (
                  <div className="mb-3 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center text-sm text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-600 dark:text-red-500" />
                    <span>Alerta! Meta com prazo vencido.</span>
                  </div>
                )}
                
                {days > 0 && days <= 7 && !completed && (
                  <div className="mb-3 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center text-sm text-yellow-700 dark:text-yellow-400">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-500" />
                    <span>Atenção! Menos de uma semana para o prazo.</span>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div className="relative mr-6">
                    <svg className="w-24 h-24" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></circle>
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="16" 
                        fill="none" 
                        className={`
                          ${completed ? 'stroke-green-500' : late ? 'stroke-red-500' : 'stroke-blue-500'}
                          transition-all duration-1000 ease-out
                        `}
                        strokeWidth="3" 
                        strokeDasharray="100" 
                        strokeDashoffset={100 - percentage} 
                        strokeLinecap="round"
                        transform="rotate(-90 18 18)"
                      ></circle>
                      <text 
                        x="18" 
                        y="18" 
                        dy=".35em" 
                        textAnchor="middle" 
                        className={`
                          text-xs font-bold fill-current
                          ${completed ? 'text-green-500' : late ? 'text-red-500' : 'text-blue-500'}
                        `}
                      >
                        {percentage.toFixed(0)}%
                      </text>
                    </svg>
                    
                    {completed && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-lg">{goal.name}</h4>
                    <div className="mt-1 flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                      <span className={late && !completed ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                        Meta para: {formatDate(goal.deadline)}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Progresso:</span>
                        <span className="font-medium">
                          <span className={`
                            ${completed 
                              ? 'text-green-600 dark:text-green-400' 
                              : late 
                                ? 'text-red-600 dark:text-red-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }
                          `}>
                            {formatCurrency(animatedCurrent)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {' '}/{' '}{formatCurrency(goal.target)}
                          </span>
                        </span>
                      </div>
                      
                      <div className={`
                        text-sm flex items-center 
                        ${completed 
                          ? 'text-green-600 dark:text-green-400' 
                          : days < 30 && !completed 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-gray-600 dark:text-gray-300'
                        }
                      `}>
                        <Clock className="w-4 h-4 mr-1" />
                        {completed ? (
                          'Meta concluída!'
                        ) : days === 0 ? (
                          'Prazo vencido'
                        ) : (
                          `${days} dias restantes`
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                  <button 
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 flex items-center px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    onClick={() => handleShowAddValue(goal)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar valor
                  </button>
                  <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 flex items-center px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Detalhes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {completedGoals.length > 0 && (
        <div className="flex justify-center">
          <button 
            className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 shadow-sm"
            onClick={() => setShowHistoryModal(true)}
          >
            <History className="w-5 h-5 text-blue-500" />
            Ver Histórico de Metas Concluídas ({completedGoals.length})
          </button>
        </div>
      )}

      {/* Modal de histórico de metas */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div 
            ref={modalRef} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                Histórico de Metas Concluídas
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowHistoryModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <div 
                  key={goal.id} 
                  className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white p-1.5 rounded-full mr-3">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{goal.name}</h4>
                      <div className="flex items-center mt-1 space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Meta: {formatCurrency(goal.target)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Concluída em: {formatDate(goal.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="py-1 px-3 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                      Meta Alcançada
                    </span>
                  </div>
                </div>
              ))}

              {completedGoals.length === 0 && (
                <div className="text-center py-10">
                  <div className="mb-3 flex justify-center">
                    <Award className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Você ainda não concluiu nenhuma meta.</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Continue se esforçando para alcançar suas metas financeiras!</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowHistoryModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para adicionar valor à meta */}
      {showAddValueModal && activeGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div 
            ref={modalRef} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                Adicionar Valor à Meta
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowAddValueModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Meta: <span className="font-medium">{activeGoal.name}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Progresso Atual: {formatCurrency(activeGoal.current)} de {formatCurrency(activeGoal.target)} ({((activeGoal.current / activeGoal.target) * 100).toFixed(1)}%)
                </p>
                
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor a Adicionar (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">R$</span>
                  <input
                    type="number"
                    value={valueToAdd || ''}
                    onChange={(e) => setValueToAdd(parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                {valueToAdd > 0 && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Novo progresso: {formatCurrency(activeGoal.current + valueToAdd)} ({(((activeGoal.current + valueToAdd) / activeGoal.target) * 100).toFixed(1)}%)
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowAddValueModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddValue}
                disabled={valueToAdd <= 0}
              >
                Adicionar Valor
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para nova meta */}
      {showNewGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div 
            ref={modalRef} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <PiggyBank className="w-5 h-5 mr-2 text-blue-500" />
                Nova Meta de Economia
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowNewGoalModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Meta
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: Férias, Novo carro, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor da Meta (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">R$</span>
                  <input
                    type="number"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({...newGoal, target: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data Limite
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowNewGoalModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddNewGoal}
                disabled={!newGoal.name || newGoal.target <= 0 || !newGoal.deadline}
              >
                Criar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}