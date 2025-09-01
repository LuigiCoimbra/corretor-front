import { api, retryRequest } from './api';

export interface Conversa {
  id: string;
  titulo: string;
  ultimaMensagem?: {
    conteudo: string;
    data: string;
  };
  naoLidas: number;
  createdAt: string;
  updatedAt: string;
}

class ConversasService {
  async listarConversas(): Promise<Conversa[]> {
    try {
      const response = await retryRequest(() =>
        api.get<Conversa[]>('/conversas')
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao listar conversas:', error);
      throw new Error('Não foi possível carregar as conversas');
    }
  }

  async criarConversa(titulo: string): Promise<Conversa> {
    try {
      const response = await api.post<Conversa>('/conversas', { titulo });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw new Error('Não foi possível criar a conversa');
    }
  }

  async buscarConversa(id: string): Promise<Conversa> {
    try {
      const response = await retryRequest(() =>
        api.get<Conversa>(`/conversas/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar conversa:', error);
      throw new Error('Não foi possível carregar a conversa');
    }
  }

  async atualizarConversa(id: string, dados: Partial<Conversa>): Promise<Conversa> {
    try {
      const response = await retryRequest(() =>
        api.put<Conversa>(`/conversas/${id}`, dados)
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conversa:', error);
      throw new Error('Não foi possível atualizar a conversa');
    }
  }

  async deletarConversa(id: string): Promise<void> {
    try {
      await retryRequest(() => api.delete(`/conversas/${id}`));
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      throw new Error('Não foi possível deletar a conversa');
    }
  }
}

export const conversasService = new ConversasService();