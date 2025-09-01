# Sistema de Chat com IA - Frontend

## Visão Geral
Frontend do sistema de chat com IA, desenvolvido com Next.js, TypeScript e Tailwind CSS. O sistema oferece uma interface moderna e responsiva para interação com um assistente virtual.

## Tecnologias Principais
- Next.js 15.4
- React 19.1
- TypeScript
- Tailwind CSS
- NextAuth.js para autenticação
- Zustand para gerenciamento de estado
- Axios para requisições HTTP

## Estrutura do Projeto
```
src/
├── app/                    # Páginas e rotas da aplicação
├── components/             # Componentes React reutilizáveis
│   ├── auth/              # Componentes de autenticação
│   └── chat/              # Componentes do chat
├── services/              # Serviços de API
├── store/                 # Gerenciamento de estado global
├── hooks/                 # Hooks personalizados
├── types/                 # Definições de tipos TypeScript
└── utils/                 # Utilitários e helpers
```

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` com:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionalidades Principais

### Autenticação
- Login com email e senha
- Proteção de rotas
- Gerenciamento de sessão

### Chat
- Lista de conversas
- Criação de novas conversas
- Envio de mensagens de texto
- Upload de imagens
- Suporte a markdown nas mensagens
- Highlight de código

### Interface
- Design responsivo
- Tema claro/escuro
- Feedback visual de status
- Indicadores de carregamento

## Desenvolvimento

### Scripts Disponíveis
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting

### Padrões de Código
- TypeScript para tipagem estática
- ESLint para linting
- Prettier para formatação
- Componentes funcionais com hooks

## Segurança
- Tokens JWT para autenticação
- Validação de inputs
- Sanitização de conteúdo
- Proteção contra XSS
