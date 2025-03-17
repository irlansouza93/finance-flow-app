import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useFinance } from '../context/FinanceContext';
import { CreditCard as CreditCardType, Transaction } from '../types';
import {
  PlusCircle,
  Edit,
  Trash2,
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  Clock,
  ChevronRight,
  AlertTriangle,
  Check,
  X,
  Eye,
  EyeOff,
  CreditCardIcon,
  ReceiptIcon,
  BellIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CreditCards() {
  const {
    creditCards,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    transactions,
    getCurrentBillingCycleForCard
  } = useFinance();

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCardType | null>(null);
  const [showCardDetails, setShowCardDetails] = useState<string | null>(null);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    color: '#8A05BE',
    brand: 'mastercard'
  });

  // Limpar formulário quando modal é aberto/fechado
  useEffect(() => {
    if (!showAddCardModal) {
      setFormData({
        name: '',
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        limit: '',
        closingDay: '',
        dueDay: '',
        color: '#8A05BE',
        brand: 'mastercard'
      });
      setSelectedCard(null);
    }
  }, [showAddCardModal]);

  // Preencher formulário quando um cartão é selecionado para edição
  useEffect(() => {
    if (selectedCard) {
      setFormData({
        name: selectedCard.name,
        number: `**** **** **** ${selectedCard.lastDigits}`,
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        limit: selectedCard.limit.toString(),
        closingDay: selectedCard.closingDay.toString(),
        dueDay: selectedCard.dueDay.toString(),
        color: selectedCard.color || '#8A05BE',
        brand: selectedCard.brand || 'mastercard'
      });
      setShowAddCardModal(true);
    }
  }, [selectedCard]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extrair últimos 4 dígitos
    const lastDigits = formData.number.replace(/\s/g, '').slice(-4);
    
    const cardData = {
      name: formData.name,
      lastDigits,
      limit: parseFloat(formData.limit),
      closingDay: parseInt(formData.closingDay),
      dueDay: parseInt(formData.dueDay),
      currentBalance: selectedCard?.currentBalance || 0,
      availableLimit: parseFloat(formData.limit) - (selectedCard?.currentBalance || 0),
      color: formData.color,
      brand: formData.brand as CreditCardType['brand']
    };
    
    if (selectedCard) {
      updateCreditCard({ ...cardData, id: selectedCard.id });
    } else {
      addCreditCard(cardData);
    }
    
    setShowAddCardModal(false);
  };

  const handleDelete = (cardId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      deleteCreditCard(cardId);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Obter as transações do cartão selecionado
  const getCardTransactions = (cardId: string) => {
    return transactions.filter(t => t.creditCardId === cardId);
  };

  // Formatar número do cartão com espaços
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      number: formatted
    });
  };

  const getBrandIcon = (brand?: string) => {
    switch(brand) {
      case 'visa':
        return <div className="text-blue-600 font-bold italic text-lg">VISA</div>;
      case 'mastercard':
        return <div className="flex"><div className="w-4 h-4 bg-red-500 rounded-full opacity-80" /><div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2 opacity-80" /></div>;
      case 'amex':
        return <div className="text-blue-800 font-bold text-lg">AMEX</div>;
      case 'elo':
        return <div className="text-yellow-500 font-bold text-lg">ELO</div>;
      default:
        return <CreditCard className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho com ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cartões de Crédito
        </h2>
        <button 
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          onClick={() => setShowAddCardModal(true)}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Novo Cartão</span>
        </button>
      </div>
      
      {/* Lista de cartões */}
      {creditCards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md border border-gray-100 dark:border-gray-700">
          <CreditCard className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Nenhum cartão cadastrado</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Adicione seu primeiro cartão de crédito para acompanhar suas despesas.</p>
          <button 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
            onClick={() => setShowAddCardModal(true)}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Adicionar Cartão</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {creditCards.map(card => {
            const billingCycle = getCurrentBillingCycleForCard(card.id);
            const daysUntilDue = billingCycle ? Math.ceil((billingCycle.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
            const isAlmostDue = daysUntilDue > 0 && daysUntilDue <= 5;
            
            return (
              <div key={card.id} className="relative">
                {/* Cartão físico */}
                <div 
                  className="credit-card-wrapper transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setShowCardDetails(showCardDetails === card.id ? null : card.id)}
                >
                  <div 
                    className="credit-card relative p-6 rounded-xl shadow-lg h-48 flex flex-col justify-between"
                    style={{ backgroundColor: card.color || '#8A05BE' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-white text-lg font-medium">{card.name}</div>
                      {getBrandIcon(card.brand)}
                    </div>
                    
                    <div className="flex flex-col space-y-6">
                      <div className="text-white flex justify-between items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCardNumber(!showCardNumber);
                          }}
                          className="p-1 hover:bg-white/10 rounded-full"
                        >
                          {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <div className="text-lg tracking-widest">
                          {showCardNumber ? `**** **** **** ${card.lastDigits}` : '•••• •••• •••• ' + card.lastDigits}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="text-white/90 text-sm flex flex-col">
                          <span>Limite Disponível</span>
                          <span className="font-bold text-base">{formatCurrency(card.availableLimit)}</span>
                        </div>
                        <div className="text-white/90 text-sm flex flex-col items-end">
                          <span>Limite Total</span>
                          <span className="font-bold text-base">{formatCurrency(card.limit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status da fatura */}
                <div className={`mt-4 p-4 rounded-lg shadow-md border
                  ${isAlmostDue ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Fatura atual</h3>
                    {isAlmostDue && (
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-xs">Vence em {daysUntilDue} {daysUntilDue === 1 ? 'dia' : 'dias'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {billingCycle 
                          ? `Vence em ${format(billingCycle.dueDate, "dd 'de' MMMM", { locale: ptBR })}`
                          : 'Sem fatura aberta'
                        }
                      </span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(billingCycle?.totalAmount || 0)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 py-1.5 px-3 text-sm rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCardDetails(card.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      <span>Detalhes</span>
                    </button>
                    <button 
                      className="flex-1 py-1.5 px-3 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(card);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
                
                {/* Detalhes expandidos */}
                {showCardDetails === card.id && (
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-4 animate-fade-in">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Detalhes do Cartão</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Fechamento</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Dia {card.closingDay}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Vencimento</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Dia {card.dueDay}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Limite Usado</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(card.currentBalance)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Limite Total</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(card.limit)}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Uso do Limite</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div 
                          className="h-2.5 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min(100, (card.currentBalance / card.limit) * 100)}%`,
                            backgroundColor: 
                              (card.currentBalance / card.limit) > 0.8 ? '#EF4444' : 
                              (card.currentBalance / card.limit) > 0.6 ? '#F59E0B' : 
                              '#10B981'
                          }} 
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round((card.currentBalance / card.limit) * 100)}% utilizado
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4">Lançamentos Recentes</h4>
                    {getCardTransactions(card.id).length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum lançamento encontrado</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                        {getCardTransactions(card.id).slice(0, 5).map(transaction => (
                          <div key={transaction.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{transaction.description}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}</div>
                            </div>
                            <div className="text-red-600 dark:text-red-400 font-medium">-{formatCurrency(transaction.amount)}</div>
                          </div>
                        ))}
                        
                        {getCardTransactions(card.id).length > 5 && (
                          <button className="w-full text-center py-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
                            Ver todos os lançamentos
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir</span>
                      </button>
                      
                      <button 
                        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setShowCardDetails(null)}
                      >
                        <X className="w-4 h-4" />
                        <span>Fechar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Modal para adicionar/editar cartão */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg animate-fade-in-up">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedCard ? 'Editar Cartão' : 'Adicionar Novo Cartão'}
              </h3>
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Cartão
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ex: Nubank, Itaú Platinum..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="1234 5678 9012 3456"
                    value={formData.number}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    disabled={!!selectedCard}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia Fechamento
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="31"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Ex: 20"
                      value={formData.closingDay}
                      onChange={(e) => setFormData({...formData, closingDay: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia Vencimento
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="31"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Ex: 5"
                      value={formData.dueDay}
                      onChange={(e) => setFormData({...formData, dueDay: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Limite (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Ex: 5000"
                      value={formData.limit}
                      onChange={(e) => setFormData({...formData, limit: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cor do Cartão
                  </label>
                  <div className="flex space-x-2">
                    {['#8A05BE', '#EC7000', '#00A1EC', '#111111', '#00AA5B', '#FF3131'].map(color => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500 transform scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setFormData({...formData, color})}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bandeira
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'visa', label: 'Visa' },
                      { value: 'mastercard', label: 'Mastercard' },
                      { value: 'amex', label: 'American Express' },
                      { value: 'elo', label: 'Elo' }
                    ].map(brand => (
                      <button
                        key={brand.value}
                        type="button"
                        className={`p-2 border rounded-lg flex flex-col items-center justify-center transition-all ${formData.brand === brand.value ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-700' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        onClick={() => setFormData({...formData, brand: brand.value})}
                      >
                        <div className="h-6 flex items-center">
                          {getBrandIcon(brand.value)}
                        </div>
                        <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{brand.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setShowAddCardModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  {selectedCard ? 'Atualizar Cartão' : 'Adicionar Cartão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 