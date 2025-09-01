import { DefaultSession } from 'next-auth';

// Extensão dos tipos do NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}

// Tipos para o Chat
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  image?: {
    url: string;
    alt: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

// Tipos para Autenticação
export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}