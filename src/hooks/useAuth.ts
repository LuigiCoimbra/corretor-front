import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const router = useRouter();
  const { user, setUser, setError } = useStore();

  const login = useCallback(async (email: string, senha: string) => {
    try {
      const result = await authService.login(email, senha);
      if (result) {
        router.replace('/chat');
      }
      return result;
    } catch (error) {
      setError('Credenciais inválidas');
      throw error;
    }
  }, [router, setError]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setError('Erro ao fazer logout');
      throw error;
    }
  }, [setUser, setError]);

  const verificarAutenticacao = useCallback(async () => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      if (!isAuthenticated) {
        router.replace('/');
      }
      return isAuthenticated;
    } catch (error) {
      setError('Erro ao verificar autenticação');
      return false;
    }
  }, [router, setError]);

  return {
    user,
    login,
    logout,
    verificarAutenticacao,
    isAuthenticated: !!user,
  };
}