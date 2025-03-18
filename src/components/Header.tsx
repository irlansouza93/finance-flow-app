import React from 'react';
import { Bell, MessageCircle, User, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white shadow-sm z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar transações..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-label="Pesquisar transações"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600"
            aria-label="Notificações"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600"
            aria-label="Mensagens"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">João Silva</p>
              <p className="text-xs text-gray-500">Nível 3</p>
            </div>
            <button 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
              aria-label="Perfil do usuário"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}