import { api, retryRequest } from './api';

export interface Mensagem {
  id: string;
  conversa_id: string;
  conteudo: string;
  tipo: 'usuario' | 'ia';
  imagem?: {
    url: string;
    alt: string;
  };
  imagem_anexada: {
    id: string;
    mensagem_id: string;
    usuario_id: number;
    nome_original: string;
    nome_arquivo: string;
    caminho_arquivo: string;
    url_publica: string;
    tipo_mime: string;
    tamanho_bytes: string;
    largura: number;
    altura: number;
    is_ativo: boolean;
    created_at: string;
    createdAt: string;
    updated_at: string;
  } ;
  status: 'enviando' | 'enviada' | 'erro';
  created_at: string;
  createdAt: string;
}

class MensagensService {
  async listarMensagens(conversa_id: string): Promise<Mensagem[]> {
    try {
      const response = await retryRequest(() =>
        api.get<Mensagem[]>(`/mensagens/conversa/${conversa_id}`)
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao listar mensagens:', error);
      throw new Error('Não foi possível carregar as mensagens');
    }
  }

  async enviarMensagem(conversa_id: string, content: string, imagem?: { url: string; alt: string }): Promise<Mensagem> {
    try {
      const response = await retryRequest(() =>
        api.post<Mensagem>('/mensagens', {
          conversa_id,
          content,
          imagem,
        })
      );
      console.log('Mensagem enviada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw new Error('Não foi possível enviar a mensagem');
    }
  }

  async processarComIA(conversa_id: string, mensagem: string): Promise<Mensagem> {
    try {
      const response = await retryRequest(() =>
        api.post<Mensagem>('/mensagens/ia', {
          conversa_id,
          mensagem,
        })
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao processar mensagem com IA:', error);
      throw new Error('Não foi possível processar a mensagem com a IA');
    }
  }
}

export const mensagensService = new MensagensService();