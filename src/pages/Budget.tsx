import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Save, FileText, PlusCircle, HelpCircle, Info, Check, 
  AlertTriangle, Download, X, DollarSign, Percent
} from 'lucide-react';
import type { BudgetCategory } from '../types';
import { useFinance } from '../context/FinanceContext';

export function Budget() {
  const { budgetCategories, updateBudgetCategory, addBudgetCategory } = useFinance();
  const [budgets, setBudgets] = useState<BudgetCategory[]>(budgetCategories);
  const [hoveredBudget, setHoveredBudget] = useState<string | null>(null);
  const [animatedBudgets, setAnimatedBudgets] = useState<BudgetCategory[]>(
    budgetCategories.map(budget => ({ ...budget, spent: 0 }))
  );
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', allocated: 0 });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Atualizar estado quando os orçamentos mudarem no contexto
  useEffect(() => {
    setBudgets(budgetCategories);
  }, [budgetCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBudgets(budgets);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [budgets]);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowNewCategoryModal(false);
        setExportFormat(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAllocationChange = (id: string, value: string) => {
    const newValue = parseFloat(value) || 0;
    setBudgets(prevBudgets => 
      prevBudgets.map(budget => 
        budget.id === id ? {...budget, allocated: newValue} : budget
      )
    );
  };

  const handleAddCategory = () => {
    if (newCategory.name.trim() === '' || newCategory.allocated <= 0) return;
    
    const newId = (Math.max(...budgets.map(b => parseInt(b.id)), 0) + 1).toString();
    
    const newBudgetCategory = { 
      id: newId, 
      name: newCategory.name, 
      allocated: newCategory.allocated, 
      spent: 0 
    };
    
    addBudgetCategory(newBudgetCategory);
    setNewCategory({ name: '', allocated: 0 });
    setShowNewCategoryModal(false);
  };

  const handleSaveChanges = () => {
    // Salvar alterações no contexto
    budgets.forEach(budget => {
      updateBudgetCategory(budget);
    });
    setSaveSuccess(true);
  };

  const handleExport = (format: string) => {
    // Simulação de exportação
    console.log(`Exportando orçamento em formato ${format}`);
    setExportFormat(null);
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular totais
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalAllocated - totalSpent;
  const percentUsed = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Orçamento
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-all shadow-sm hover:shadow"
              onMouseEnter={() => setShowTooltip('export')}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => setExportFormat('menu')}
            >
              <Download className="w-4 h-4" />
              <span>Exportar Relatório</span>
            </button>
            
            {showTooltip === 'export' && (
              <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg z-10 whitespace-nowrap">
                Exportar orçamento em diferentes formatos
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            )}
            
            {exportFormat === 'menu' && (
              <div ref={modalRef} className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 w-40 z-20">
                <ul className="py-1">
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm cursor-pointer flex items-center"
                    onClick={() => handleExport('pdf')}
                  >
                    <FileText className="w-4 h-4 mr-2 text-red-500" /> PDF
                  </li>
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm cursor-pointer flex items-center"
                    onClick={() => handleExport('excel')}
                  >
                    <FileText className="w-4 h-4 mr-2 text-green-500" /> Excel
                  </li>
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm cursor-pointer flex items-center"
                    onClick={() => handleExport('csv')}
                  >
                    <FileText className="w-4 h-4 mr-2 text-blue-500" /> CSV
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onMouseEnter={() => setShowTooltip('new')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={() => setShowNewCategoryModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Novo Orçamento</span>
          </button>
          
          {showTooltip === 'new' && (
            <div className="absolute mt-12 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-lg z-10 whitespace-nowrap">
              Adicionar nova categoria de orçamento
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Resumo do orçamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Orçamento Total</span>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(totalAllocated)}</span>
          <div className="mt-auto pt-3 text-sm text-blue-600 dark:text-blue-400">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Planejamento mensal
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Gasto Total</span>
            <div className="flex items-center">
              {percentUsed > 90 && (
                <AlertTriangle className="w-5 h-5 text-red-500 mr-1" />
              )}
              <Percent className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalSpent)}</span>
          <div className="mt-auto pt-3 text-sm text-red-600 dark:text-red-400">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              {percentUsed.toFixed(1)}% do orçamento total
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Restante</span>
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(remaining)}</span>
          <div className="mt-auto pt-3 text-sm text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              {((remaining / totalAllocated) * 100).toFixed(1)}% disponível
            </span>
          </div>
        </div>
      </div>
      
      {/* Categorias de orçamento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Categorias de Orçamento</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Defina limites de gastos para cada categoria</p>
        </div>
        
        <div className="p-6">
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhuma categoria de orçamento definida</p>
              <button 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={() => setShowNewCategoryModal(true)}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Categoria de Orçamento
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget) => {
                const animatedBudget = animatedBudgets.find(b => b.id === budget.id) || budget;
                const percentage = (animatedBudget.spent / budget.allocated) * 100;
                let progressColor = 'from-green-400 to-green-500';
                let textColor = 'text-green-600 dark:text-green-400';
                let borderColor = 'border-green-200 dark:border-green-800';
                let bgColor = 'hover:bg-green-50 dark:hover:bg-green-900/20';
                
                if (percentage >= 90) {
                  progressColor = 'from-red-400 to-red-600';
                  textColor = 'text-red-600 dark:text-red-400';
                  borderColor = 'border-red-200 dark:border-red-800';
                  bgColor = 'hover:bg-red-50 dark:hover:bg-red-900/20';
                } else if (percentage >= 75) {
                  progressColor = 'from-yellow-400 to-yellow-500';
                  textColor = 'text-yellow-600 dark:text-yellow-400';
                  borderColor = 'border-yellow-200 dark:border-yellow-800';
                  bgColor = 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
                }
                
                return (
                  <div 
                    key={budget.id} 
                    className={`p-4 border ${borderColor} rounded-lg transition-all duration-200 hover:shadow-md ${bgColor}`}
                    onMouseEnter={() => setHoveredBudget(budget.id)}
                    onMouseLeave={() => setHoveredBudget(null)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{budget.name}</h4>
                        <p className={`text-sm ${textColor} flex items-center`}>
                          {percentage >= 90 ? (
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          ) : null}
                          {percentage.toFixed(1)}% utilizado
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">R$</span>
                        <input
                          type="number"
                          value={budget.allocated}
                          onChange={(e) => handleAllocationChange(budget.id, e.target.value)}
                          className="w-24 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        {percentage > 20 && (
                          <span className="absolute left-2 text-xs font-bold text-white drop-shadow-md" style={{ lineHeight: '0.75rem' }}>
                            {percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>R$ 0</span>
                      <span>{formatCurrency(budget.allocated)}</span>
                    </div>
                    
                    {hoveredBudget === budget.id && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <Info className="w-4 h-4 mr-2 text-blue-500" />
                        <div>
                          <p>Gasto atual: <span className="font-medium">{formatCurrency(budget.spent)}</span></p>
                          <p>Restante: <span className={`font-medium ${budget.allocated - budget.spent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(budget.allocated - budget.spent)}
                          </span></p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6 flex justify-between items-center">
            <button 
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              onClick={() => setShowNewCategoryModal(true)}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Adicionar categoria
            </button>
            
            <button 
              className={`flex items-center gap-2 ${
                saveSuccess 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}
              onClick={handleSaveChanges}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de Nova Categoria */}
      {showNewCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Nova Categoria de Orçamento</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowNewCategoryModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: Alimentação, Transporte, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Alocado (R$)
                </label>
                <input
                  type="number"
                  value={newCategory.allocated || ''}
                  onChange={(e) => setNewCategory({...newCategory, allocated: parseFloat(e.target.value) || 0})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowNewCategoryModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddCategory}
                  disabled={!newCategory.name || newCategory.allocated <= 0}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}