import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  Calculator,
  PiggyBank,
  GraduationCap,
  MessageSquareText,
  Trophy,
  TrendingUp,
  CreditCard,
  ArrowRightLeft,
  Bell,
  Settings,
  Moon,
  Sun,
  LogOut,
  X,
  DollarSign,
  Receipt
} from 'lucide-react';
import clsx from 'clsx';
import { ThemeToggle } from './ThemeToggle';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
        active
          ? "bg-blue-600 text-white shadow-md dark:bg-blue-800"
          : "text-gray-100 hover:bg-blue-500/10 hover:text-white"
      )}
    >
      <div className={clsx(
        "p-1.5 rounded-md",
        active ? "bg-blue-500 dark:bg-blue-700" : "bg-transparent"
      )}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge && (
        <div className="absolute right-3 top-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </div>
      )}
      {active && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
      )}
    </button>
  );
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    { id: 1, title: 'Orçamento atingido', message: 'Categoria "Lazer" ultrapassou 90% do limite', time: '2 min atrás' },
    { id: 2, title: 'Meta atingida!', message: 'Você atingiu sua meta "Novo notebook"', time: '1 hora atrás' },
    { id: 3, title: 'Novo artigo disponível', message: 'Como economizar nas compras do mês', time: '3 horas atrás' }
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 dark:bg-gray-900 text-white py-6 px-4 flex flex-col border-r border-gray-700 shadow-lg z-10">
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">FinanceFlow</span>
          </div>
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Abrir notificações"
          >
            <Bell className="w-5 h-5 text-gray-200" />
            <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Principal
          </div>
          <NavItem
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Visão Geral"
            active={activeSection === 'overview'}
            onClick={() => onSectionChange('overview')}
          />
          <NavItem
            icon={<DollarSign className="w-5 h-5" />}
            label="Renda"
            active={activeSection === 'income'}
            onClick={() => onSectionChange('income')}
          />
          <NavItem
            icon={<Receipt className="w-5 h-5" />}
            label="Despesas"
            active={activeSection === 'expenses'}
            onClick={() => onSectionChange('expenses')}
          />
          <NavItem
            icon={<CreditCard className="w-5 h-5" />}
            label="Cartões de Crédito"
            active={activeSection === 'credit-cards'}
            onClick={() => onSectionChange('credit-cards')}
          />
          <NavItem
            icon={<Wallet className="w-5 h-5" />}
            label="Orçamento"
            active={activeSection === 'budget'}
            onClick={() => onSectionChange('budget')}
            badge={1}
          />
          <NavItem
            icon={<PiggyBank className="w-5 h-5" />}
            label="Metas"
            active={activeSection === 'goals'}
            onClick={() => onSectionChange('goals')}
          />

          <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Suporte
          </div>
          <NavItem
            icon={<MessageSquareText className="w-5 h-5" />}
            label="Chat IA"
            active={activeSection === 'chat'}
            onClick={() => onSectionChange('chat')}
          />
        </nav>
        
        <div className="mt-auto border-t border-gray-700 pt-4 space-y-4">
          <div className="bg-gray-700 dark:bg-gray-800 rounded-xl shadow-inner p-4">
            <div className="flex items-center mb-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="ml-2 font-medium">Nível 3</span>
              <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 p-1 bg-gray-800 dark:bg-gray-900">
                <span className="text-xs font-semibold">JS</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-2">Economista Iniciante</p>
            <div className="w-full bg-gray-800 dark:bg-gray-900 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500" style={{ width: '60%' }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">350 pontos para o próximo nível</p>
          </div>
          
          <div className="flex px-2 space-x-2">
            <ThemeToggle className="flex-1" />
            <button 
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Configurações"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Ajustes</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Painel de notificações */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-800 w-80 h-full shadow-lg animate-slide-left">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Notificações</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Fechar notificações"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-20">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                </div>
              ))}
              
              <div className="p-4 text-center">
                <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}