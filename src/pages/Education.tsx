import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Search, PlayCircle, FileText, BookOpen, Star, Award, TagIcon, 
  ChevronRight, Clock, Bookmark, BookmarkPlus, Flame, TrendingUp, Filter, X
} from 'lucide-react';

// Categorias com cores personalizadas
const categoryColors = {
  'Iniciante': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: <Flame className="w-3.5 h-3.5 mr-1 text-green-500" /> },
  'Intermediário': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: <TrendingUp className="w-3.5 h-3.5 mr-1 text-blue-500" /> },
  'Avançado': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: <Star className="w-3.5 h-3.5 mr-1 text-purple-500" /> },
  'Investimentos': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: <TrendingUp className="w-3.5 h-3.5 mr-1 text-yellow-500" /> },
  'Dicas de Economia': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: <Bookmark className="w-3.5 h-3.5 mr-1 text-orange-500" /> }
};

const articles = [
  {
    id: '1',
    title: 'Como Planejar seu Orçamento',
    description: 'Aprenda a criar um orçamento eficiente em 5 passos simples.',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVkZ2V0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    category: 'Iniciante',
    duration: '5 min',
    popular: true
  },
  {
    id: '2',
    title: 'Investimentos para Iniciantes',
    description: 'Entenda os conceitos básicos para começar a investir com segurança.',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW52ZXN0bWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    category: 'Iniciante',
    duration: '15 min'
  },
  {
    id: '3',
    title: 'Como Economizar em Compras do Dia a Dia',
    description: 'Estratégias práticas para reduzir gastos em supermercados e lojas.',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHNhdmluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    category: 'Dicas de Economia',
    duration: '7 min'
  },
  {
    id: '4',
    title: 'Introdução ao Mercado de Ações',
    description: 'Aprenda os conceitos fundamentais para investir na bolsa de valores.',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    category: 'Investimentos',
    duration: '25 min',
    popular: true
  },
  {
    id: '5',
    title: 'Planejamento para Aposentadoria',
    description: 'Como preparar suas finanças para garantir um futuro tranquilo.',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmV0aXJlbWVudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    category: 'Avançado',
    duration: '10 min'
  },
  {
    id: '6',
    title: 'Como Negociar Dívidas',
    description: 'Estratégias eficientes para negociar e eliminar suas dívidas.',
    type: 'video',
    image: 'https://images.unsplash.com/photo-1579621970590-9d624316904b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGRlYnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    category: 'Dicas de Economia',
    duration: '12 min'
  }
];

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'iniciante', name: 'Iniciante' },
  { id: 'intermediario', name: 'Intermediário' },
  { id: 'avancado', name: 'Avançado' },
  { id: 'investimentos', name: 'Investimentos' },
  { id: 'dicas', name: 'Dicas de Economia' }
];

export function Education() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [progress, setProgress] = useState(50); // Progresso do usuário (simulação)
  const [visibleArticles, setVisibleArticles] = useState(articles);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Filtrar artigos baseado na pesquisa e categoria
    let filteredArticles = articles;
    
    // Filtrar por categoria
    if (activeCategory !== 'all') {
      const categoryName = categories.find(c => c.id === activeCategory)?.name;
      if (categoryName) {
        filteredArticles = filteredArticles.filter(article => 
          article.category.toLowerCase() === categoryName.toLowerCase()
        );
      }
    }
    
    // Filtrar por tipo
    if (typeFilter) {
      filteredArticles = filteredArticles.filter(article => article.type === typeFilter);
    }
    
    // Filtrar por duração
    if (durationFilter) {
      filteredArticles = filteredArticles.filter(article => {
        const minutes = parseInt(article.duration);
        if (durationFilter === 'short') return minutes <= 5;
        if (durationFilter === 'medium') return minutes > 5 && minutes <= 15;
        if (durationFilter === 'long') return minutes > 15;
        return true;
      });
    }
    
    // Filtrar por termo de pesquisa
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      );
    }
    
    setVisibleArticles(filteredArticles);
  }, [searchQuery, activeCategory, typeFilter, durationFilter]);

  useEffect(() => {
    // Animação de progresso
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [progress]);

  const toggleSaveArticle = (id: string) => {
    setSavedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(articleId => articleId !== id) 
        : [...prev, id]
    );
  };
  
  const clearFilters = () => {
    setTypeFilter(null);
    setDurationFilter(null);
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Breadcrumb />
      
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Educação Financeira
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Aprenda conceitos e estratégias para administrar melhor seu dinheiro</p>
      </div>
      
      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tópicos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden flex items-center gap-1 p-2 rounded-lg border ${
              showFilters || typeFilter || durationFilter 
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/30 dark:border-blue-800'
                : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            {(typeFilter || durationFilter) && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
          </button>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all transform duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Filtros adicionais (visível em dispositivos móveis quando expandido) */}
      {showFilters && (
        <div className="md:hidden bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Filtros</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400"
            >
              Limpar
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tipo</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTypeFilter(typeFilter === 'video' ? null : 'video')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeFilter === 'video' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <PlayCircle className="w-3 h-3 mr-1" />
                    <span>Vídeos</span>
                  </div>
                </button>
                <button 
                  onClick={() => setTypeFilter(typeFilter === 'article' ? null : 'article')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    typeFilter === 'article' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    <span>Artigos</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Duração</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setDurationFilter(durationFilter === 'short' ? null : 'short')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    durationFilter === 'short' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Curto (&lt; 5min)
                </button>
                <button 
                  onClick={() => setDurationFilter(durationFilter === 'medium' ? null : 'medium')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    durationFilter === 'medium' 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Médio (5-15min)
                </button>
                <button 
                  onClick={() => setDurationFilter(durationFilter === 'long' ? null : 'long')}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    durationFilter === 'long' 
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Longo ({'>'}15min)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Progresso do curso */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-12 -mr-12 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Curso Básico de Finanças</h3>
              <p className="text-blue-100">Continue de onde parou</p>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm backdrop-blur-sm">
              {progress}% concluído
            </div>
          </div>
          
          <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 to-white rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${animatedProgress}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-all transform hover:scale-105 duration-200 shadow-md">
              Continuar Aprendendo
            </button>
            <button className="flex items-center text-blue-100 hover:text-white transition-colors">
              <Award className="w-4 h-4 mr-1" />
              Ver Certificado
            </button>
          </div>
        </div>
      </div>
      
      {/* Resultados da pesquisa */}
      {searchQuery.trim() !== '' && (
        <div className="pb-2">
          <p className="text-gray-600 dark:text-gray-400">
            {visibleArticles.length} resultados para "{searchQuery}"
            {activeCategory !== 'all' && ` em ${categories.find(c => c.id === activeCategory)?.name}`}
            {typeFilter && ` | Tipo: ${typeFilter === 'video' ? 'Vídeos' : 'Artigos'}`}
            {durationFilter && ` | Duração: ${
              durationFilter === 'short' ? 'Curta' : 
              durationFilter === 'medium' ? 'Média' : 'Longa'
            }`}
          </p>
        </div>
      )}
      
      {/* Lista de artigos e vídeos */}
      {visibleArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleArticles.map((article, index) => (
            <div 
              key={article.id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700 ease-in-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-3 right-3 flex space-x-2">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium flex items-center shadow-sm">
                    {article.type === 'video' ? (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 mr-1 text-red-500" />
                        <span className="dark:text-gray-200">Vídeo</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 mr-1 text-blue-500" />
                        <span className="dark:text-gray-200">Artigo</span>
                      </>
                    )}
                  </div>
                  
                  {article.popular && (
                    <div className="bg-orange-500/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-white flex items-center shadow-sm">
                      <Flame className="w-3.5 h-3.5 mr-1" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>
                
                <button 
                  className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white dark:hover:bg-gray-700"
                  onClick={() => toggleSaveArticle(article.id)}
                >
                  {savedArticles.includes(article.id) ? (
                    <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className={`${categoryColors[article.category as keyof typeof categoryColors]?.bg || 'bg-gray-100'} rounded-full px-2.5 py-1 text-xs font-medium flex items-center mr-3`}>
                    {categoryColors[article.category as keyof typeof categoryColors]?.icon || <TagIcon className="w-3.5 h-3.5 mr-1" />}
                    <span className={categoryColors[article.category as keyof typeof categoryColors]?.text || 'text-gray-700'}>
                      {article.category}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {article.duration}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.description}</p>
                
                <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  {article.type === 'video' ? 'Assistir' : 'Ler'} agora
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Nenhum resultado encontrado</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Tente usar termos diferentes ou remover alguns filtros para ver mais resultados.
          </p>
          {(activeCategory !== 'all' || typeFilter || durationFilter || searchQuery) && (
            <button 
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}
      
      {/* Rodapé */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 shadow-sm">
          <BookOpen className="w-4 h-4" />
          <span>Ver Biblioteca Completa</span>
        </button>
      </div>
    </div>
  );
}