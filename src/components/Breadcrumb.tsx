import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  overview: 'Visão Geral',
  expenses: 'Despesas',
  budget: 'Orçamento',
  goals: 'Metas',
  chat: 'Chat IA',
};

export function Breadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-primary-600 flex items-center">
        <Home className="w-4 h-4" />
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={`/${pathSegments.slice(0, index + 1).join('/')}`}
            className={`hover:text-primary-600 ${
              index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {routeNames[segment] || segment}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}