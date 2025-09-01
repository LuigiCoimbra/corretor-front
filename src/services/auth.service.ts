import { api, retryRequest } from './api';
import { signIn, signOut } from 'next-auth/react';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
  };
}

class AuthService {
  async login(email: string, senha: string): Promise<boolean> {
    try {
      const result = await signIn('credentials', {
        email,
        senha,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return !result?.error;
    } catch (error) {
      throw new Error('Falha na autenticação');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const response = await retryRequest(() =>
        api.post('/auth/verify-token')
      );
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await fetch('/api/auth/session').then((res) => res.json());
      return !!session?.user;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();