import { api, retryRequest } from './api';

export interface ImagemUploadResponse {
  filename: string;
  url: string;
}

class ImagensService {
  async uploadImagem(arquivo: File, usuario_id: string, mensagem_id: string, conversa_id: string): Promise<ImagemUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('imagem', arquivo);
      formData.append('usuario_id', usuario_id);
      formData.append('mensagem_id', mensagem_id);
      formData.append('conversa_id', conversa_id);

      const response = await retryRequest(() =>
        api.post<ImagemUploadResponse>('/imagens/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Não foi possível fazer o upload da imagem');
    }
  }

  async getImagemUrl(filename: string): Promise<string> {
    if (!filename) return '';
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
      return `${baseUrl}/uploads/${filename}`;
    } catch (error) {
      console.error('Erro ao obter URL da imagem:', error);
      return '';
    }
  }

  async carregarImagem(url: string): Promise<Blob> {
    try {
      const response = await api.get(url, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      throw new Error('Não foi possível carregar a imagem');
    }
  }

  // Função auxiliar para validar tamanho e tipo de arquivo
  validarArquivo(arquivo: File): boolean {
    const maxSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (arquivo.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo permitido: 5MB');
    }

    if (!tiposPermitidos.includes(arquivo.type)) {
      throw new Error('Tipo de arquivo não suportado. Use: JPG, PNG, GIF ou WebP');
    }

    return true;
  }
}

export const imagensService = new ImagensService();