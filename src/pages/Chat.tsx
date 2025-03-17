import React, { useState, useRef, useEffect } from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { 
  Send, Sparkles, Bot, User, Clock, ArrowRight, Lightbulb, PieChart, 
  Wallet, RefreshCw, ShieldCheck, BarChart, HelpCircle, Download, X
} from 'lucide-react';
import { ThemeDemo } from '../components/ThemeDemo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

// Exemplos de respostas da IA baseadas em palavras-chave
const aiResponses: Record<string, { text: string, suggestions?: string[] }> = {
  'dicas de economia': {
    text: 'Aqui estão algumas dicas para economizar dinheiro no dia a dia:\n\n1. Faça um orçamento mensal e acompanhe seus gastos\n2. Estabeleça metas de economia claras\n3. Corte gastos desnecessários como assinaturas não utilizadas\n4. Use aplicativos de cashback em suas compras\n5. Compare preços antes de fazer compras maiores\n6. Automatize suas economias com transferências programadas\n7. Negocie descontos em pagamentos à vista\n8. Avalie seu pacote de serviços bancários',
    suggestions: ['Como criar um orçamento?', 'Melhores aplicativos de cashback?', 'Como investir minhas economias?']
  },
  'investimento': {
    text: 'Para começar a investir, é importante seguir alguns passos:\n\n1. Defina seus objetivos financeiros e horizonte de tempo\n2. Entenda seu perfil de risco (conservador, moderado ou arrojado)\n3. Crie uma reserva de emergência antes de investir\n4. Diversifique seus investimentos (renda fixa, variável, fundos, etc.)\n5. Comece com pequenas quantias e aumente gradualmente\n6. Estude continuamente sobre o mercado financeiro\n7. Considere investimentos de longo prazo para maiores retornos\n\nQuer saber mais sobre algum tipo específico de investimento?',
    suggestions: ['Renda fixa ou variável?', 'O que são fundos imobiliários?', 'Como funciona a bolsa de valores?']
  },
  'orçamento': {
    text: 'Um bom orçamento mensal deve incluir:\n\n1. Renda total (salários, freelance, rendimentos)\n2. Despesas fixas (aluguel, financiamentos, contas)\n3. Despesas variáveis (alimentação, transporte, lazer)\n4. Meta de economia (recomendo pelo menos 10% da renda)\n5. Fundo para emergências\n\nDica: divida seus gastos entre necessidades (50%), desejos (30%) e economias/investimentos (20%) - regra 50-30-20.',
    suggestions: ['Como usar a regra 50-30-20?', 'Ferramentas para controle financeiro', 'Como reduzir despesas fixas?']
  },
  'dívida': {
    text: 'Para quitar suas dívidas de forma eficiente:\n\n1. Liste todas as suas dívidas com valores, juros e prazos\n2. Priorize dívidas com juros mais altos para pagamento\n3. Negocie taxas e prazos com seus credores\n4. Considere consolidar dívidas para reduzir juros\n5. Estabeleça um plano de pagamento realista\n6. Corte gastos extras para direcionar mais dinheiro para as dívidas\n7. Busque renda extra se possível\n\nLembre-se: evite novas dívidas enquanto estiver no processo de quitação.',
    suggestions: ['Como negociar com credores?', 'Vale a pena fazer empréstimo consignado?', 'Dívidas a priorizar?']
  }
};

// Função para encontrar a melhor resposta da AI baseada no texto do usuário
function findBestResponse(text: string): { text: string, suggestions?: string[] } {
  const query = text.toLowerCase();
  
  // Verificar palavras-chave específicas
  for (const [keyword, response] of Object.entries(aiResponses)) {
    if (query.includes(keyword.toLowerCase())) {
      return response;
    }
  }
  
  // Se não encontrar palavras-chave específicas, verificar categorias mais amplas
  if (query.includes('econom') || query.includes('gast') || query.includes('poupar')) {
    return aiResponses['dicas de economia'];
  } else if (query.includes('invest') || query.includes('aplic') || query.includes('rend')) {
    return aiResponses['investimento'];
  } else if (query.includes('orça') || query.includes('planej') || query.includes('control')) {
    return aiResponses['orçamento'];
  } else if (query.includes('dívid') || query.includes('pagar') || query.includes('devendo')) {
    return aiResponses['dívida'];
  }
  
  // Resposta padrão se nada for encontrado
  return {
    text: 'Entendi sua pergunta. Posso ajudar com dicas de economia, investimentos, orçamento e planejamento financeiro. Você poderia fornecer mais detalhes sobre o que gostaria de saber?',
    suggestions: ['Dicas de economia', 'Como investir meu dinheiro', 'Planejamento financeiro']
  };
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Sou seu assistente financeiro virtual. Como posso ajudar você hoje?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutos atrás
    suggestions: ['Dicas de economia', 'Ajuda com investimentos', 'Planejamento financeiro']
  },
  {
    id: '2',
    text: 'Como posso economizar mais dinheiro no mês?',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 4) // 4 minutos atrás
  },
  {
    id: '3',
    text: 'Ótima pergunta! Aqui estão algumas dicas para economizar dinheiro:\n\n1. Crie um orçamento detalhado para acompanhar suas despesas\n2. Estabeleça metas de economia específicas\n3. Corte gastos desnecessários como assinaturas não utilizadas\n4. Compare preços antes de fazer compras\n5. Automatize suas economias com transferências automáticas\n\nGostaria de saber mais sobre alguma dessas estratégias?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutos atrás
    suggestions: ['Como criar um orçamento?', 'Metas de economia', 'Automatizar economias']
  }
];

const quickActions = [
  { id: '1', text: 'Dicas de economia', icon: <Lightbulb className="w-4 h-4" /> },
  { id: '2', text: 'Análise de gastos', icon: <PieChart className="w-4 h-4" /> },
  { id: '3', text: 'Orçamento mensal', icon: <Wallet className="w-4 h-4" /> },
  { id: '4', text: 'Investimentos', icon: <BarChart className="w-4 h-4" /> },
  { id: '5', text: 'Quitar dívidas', icon: <ShieldCheck className="w-4 h-4" /> }
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Efeito para fazer o scroll para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gerar resposta progressiva
  const generateResponse = (query: string) => {
    setIsThinking(true);
    
    // Encontrar a melhor resposta
    const response = findBestResponse(query);
    const responseChunks = response.text.split('\n');
    
    // Iniciar digitando após 500ms
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      
      // Mensagem de resposta vazia que será preenchida gradualmente
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Simulação de digitação progressiva da mensagem
      let currentText = '';
      let chunkIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (chunkIndex < responseChunks.length) {
          currentText += (chunkIndex > 0 ? '\n' : '') + responseChunks[chunkIndex];
          chunkIndex++;
          
          // Atualizar a última mensagem com o texto atual
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].text = currentText;
            return updated;
          });
          
          setLoadingProgress(Math.min(100, (chunkIndex / responseChunks.length) * 100));
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setLoadingProgress(0);
        }
      }, 300); // Intervalo entre os chunks de texto
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Gerar resposta da IA
    const query = newMessage;
    setNewMessage('');
    generateResponse(query);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleQuickAction = (text: string) => {
    setNewMessage(text);
  };

  const handleSuggestion = (text: string) => {
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    generateResponse(text);
  };

  const exportChat = (format: string) => {
    // Simulação de exportação
    const chatContent = messages.map(m => 
      `[${formatTime(m.timestamp)}] ${m.sender === 'user' ? 'Você' : 'FinanceFlow AI'}: ${m.text}`
    ).join('\n\n');
    
    // Na vida real, isso geraria um arquivo ou enviaria para uma API
    console.log(`Exportando chat como ${format}: `, chatContent);
    setShowExportMenu(false);
    
    // Mostrar mensagem de confirmação
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: `Seu histórico de conversa foi exportado como ${format.toUpperCase()}.`,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const clearChat = () => {
    // Manter apenas a primeira mensagem de boas-vindas
    setMessages([initialMessages[0]]);
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-12rem)]">
      <Breadcrumb />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Chat IA
        </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
            <div className="relative">
              <button 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="w-5 h-5" />
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exportar Conversa</span>
                    <button 
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      onClick={() => setShowExportMenu(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-2">
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => exportChat('pdf')}
                    >
                      Exportar como PDF
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      onClick={() => exportChat('txt')}
                    >
                      Exportar como TXT
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md"
                      onClick={clearChat}
                    >
                      Limpar Conversa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Área de chat */}
        <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
          {/* Histórico de mensagens */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`
                  max-w-[80%] rounded-2xl p-4 
                  ${message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none dark:bg-blue-700 shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'}
                `}>
                  <div className="flex items-center mb-1">
                    {message.sender === 'ai' ? (
                      <Bot className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{message.text}</p>
                  
                  {/* Sugestões */}
                  {message.sender === 'ai' && message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="text-xs py-1 px-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isThinking && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <div className="flex items-center mb-1">
                    <Bot className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="text-xs opacity-75">
                      {formatTime(new Date())}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <p className="text-sm">Pensando...</p>
                  </div>
                </div>
              </div>
            )}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <div className="flex items-center mb-1">
                    <Bot className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="text-xs opacity-75">
                      {formatTime(new Date())}
                    </span>
                  </div>
                  {loadingProgress > 0 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mb-2">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${loadingProgress}%` }}
                      ></div>
                    </div>
                  )}
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
          
          {/* Ações rápidas */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.text)}
                  className="flex items-center space-x-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  {action.icon}
                  <span>{action.text}</span>
                </button>
              ))}
              <button
                onClick={() => handleQuickAction('Preciso de ajuda com finanças')}
                className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ajuda</span>
              </button>
            </div>
          </div>
          
          {/* Campo de entrada */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  onClick={handleSendMessage}
                  disabled={isTyping || isThinking}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <button 
                className={`p-3 ${
                  isTyping || isThinking 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                } text-white rounded-full transition-all transform hover:scale-105 shadow-md`}
                onClick={() => {
                  if (!isTyping && !isThinking) {
                    handleSuggestion('Gere uma dica financeira aleatória');
                  }
                }}
                disabled={isTyping || isThinking}
              >
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Adicionar o componente ThemeDemo no final da página */}
        <div className="mb-6 mt-8">
          <ThemeDemo />
        </div>
      </div>
    </div>
  );
}