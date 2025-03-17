import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[1] || 'overview';

  const handleSectionChange = (section: string) => {
    navigate(`/${section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeSection={currentPath} onSectionChange={handleSectionChange} />
      <Header />
      
      <main className="ml-0 md:ml-64 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}