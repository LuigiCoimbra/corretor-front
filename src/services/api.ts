import axios, { AxiosError, AxiosInstance } from 'axios';
import { signOut } from 'next-auth/react';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      try {
        const session = await fetch('/api/auth/session').then((res) => res.json());
        if (!session?.token) {
          throw new Error('Token não encontrado');
        }
        config.headers.Authorization = `Bearer ${session.token}`;
      } catch (error) {
        console.error('Erro ao obter token:', error);
        await signOut({ redirect: true, callbackUrl: '/login' });
        throw error;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Erro de autenticação:', error);
      await signOut({ redirect: true, callbackUrl: '/login' });
      window.location.reload(); // Força recarga da página para limpar o estado
    }
    return Promise.reject(error);
  }
);

// Função para retry automático
const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error: any) {
    console.error('Erro na requisição:', error);
    
    // Não tenta novamente em caso de erro de autenticação
    if (error.response?.status === 401) {
      throw error;
    }

    // Tenta novamente apenas para erros de rede ou 5xx
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      console.log(`Tentando novamente em ${delay}ms... Tentativas restantes: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }

    throw error;
  }
};

export { api, retryRequest };