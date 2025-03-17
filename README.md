# Expense Tracker SaaS - Controle Financeiro Pessoal

Um aplicativo web para controle de finanças pessoais, desenvolvido com React, TypeScript e Tailwind CSS.

## 📋 Visão Geral

Este aplicativo de controle financeiro permite aos usuários:

- Visualizar um painel com resumo das finanças pessoais
- Acompanhar despesas e receitas
- Gerenciar orçamentos por categorias
- Definir e acompanhar metas de economia
- Acessar conteúdo educacional sobre finanças
- Interface de chat para assistência

## 🚀 Tecnologias Utilizadas

- [React](https://reactjs.org/) - Biblioteca JavaScript para construção da interface
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [React Router DOM](https://reactrouter.com/) - Roteamento para aplicações React
- [Recharts](https://recharts.org/) - Biblioteca de gráficos para React
- [Framer Motion](https://www.framer.com/motion/) - Biblioteca para animações
- [Lucide React](https://lucide.dev/) - Ícones para React
- [React Hot Toast](https://react-hot-toast.com/) - Notificações toast para React
- [Vite](https://vitejs.dev/) - Ferramenta de build e servidor de desenvolvimento

## 💻 Pré-requisitos

- Node.js (versão recomendada: 16.x ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd expense-tracker-saas
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o aplicativo em seu navegador:
```
http://localhost:5173/
```

## 📱 Funcionalidades

### Visão Geral
- Dashboard com cards de resumo financeiro
- Visualização de transações recentes
- Progresso do orçamento mensal

### Despesas
- Registro e categorização de despesas
- Histórico de transações
- Análise de gastos por categoria

### Orçamento
- Definição de limites por categoria
- Acompanhamento do progresso do orçamento
- Alertas de limite excedido

### Metas
- Criação de metas de economia
- Acompanhamento do progresso das metas
- Datas de prazo e valores alvo

### Educação
- Conteúdo educacional sobre finanças pessoais
- Dicas para economizar e investir

### Chat
- Assistente virtual para dúvidas financeiras
- Suporte ao usuário

## 🛠️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── layouts/        # Layouts da aplicação
├── pages/          # Páginas principais
├── routes/         # Configuração de rotas
├── styles/         # Estilos globais e customizações
├── App.tsx         # Componente raiz da aplicação
├── main.tsx        # Ponto de entrada da aplicação
└── types.ts        # Definições de tipos
```

## 📦 Construção para Produção

Para criar uma versão otimizada para produção, execute:

```bash
npm run build
# ou
yarn build
```

Os arquivos compilados estarão disponíveis na pasta `dist/`.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir um issue ou enviar um pull request.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE). 