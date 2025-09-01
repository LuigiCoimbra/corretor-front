import { useCallback, useEffect } from 'react';
import { useStore } from '@/store';
import { conversasService } from '@/services/conversas.service';
import { mensagensService } from '@/services/mensagens.service';
import { imagensService } from '@/services/imagens.service';

export function useConversas() {
  const {
    conversas,
    conversaAtiva,
    mensagens,
    setConversas,
    addConversa,
    setConversaAtiva,
    setMensagens,
    addMensagem,
    updateMensagem,
    setLoading,
    setError,
  } = useStore();

  const carregarConversas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await conversasService.listarConversas();
      setConversas(data);
    } catch (error) {
      setError('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  }, [setConversas, setLoading, setError]);

  const criarNovaConversa = useCallback(async (titulo: string) => {
    try {
      setLoading(true);
      const session = await fetch('/api/auth/session').then((res) => res.json());
      if (!session?.token) {
        throw new Error('Usuário não autenticado');
      }

      const novaConversa = await conversasService.criarConversa(titulo);
      if (!novaConversa?.id) {
        throw new Error('Erro ao criar conversa: resposta inválida do servidor');
      }

      addConversa(novaConversa);
      setConversaAtiva(novaConversa);
      return novaConversa;
    } catch (error: any) {
      if (error.message === 'Usuário não autenticado' || error.response?.status === 401) {
        window.location.reload();
      }
      setError('Erro ao criar nova conversa');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [addConversa, setConversaAtiva, setLoading, setError]);

  const selecionarConversa = useCallback(async (conversaId: string) => {
    try {
      setLoading(true);
      const conversa = await conversasService.buscarConversa(conversaId);
      setConversaAtiva(conversa);
      const mensagens = await mensagensService.listarMensagens(conversaId);
      setMensagens(mensagens);
    } catch (error) {
      setError('Erro ao carregar conversa');
    } finally {
      setLoading(false);
    }
  }, [setConversaAtiva, setMensagens, setLoading, setError]);

  const enviarMensagem = useCallback(async (
    content: string,
    arquivo?: File
  ) => {
    if (!conversaAtiva) return;

    try {
      const mensagemTemp = {
        id: Date.now().toString(),
        conversa_id: conversaAtiva.id,
        conteudo: content,
        tipo: 'usuario' as const,
        status: 'enviando' as const,
        createdAt: new Date().toISOString(),
      };

      let imagem;
      if (arquivo) {
        imagensService.validarArquivo(arquivo);
        
        const session = await fetch('/api/auth/session').then((res) => res.json());
        if (!session?.token) {
          throw new Error('Usuário não autenticado');
        }

        const uploadResponse = await imagensService.uploadImagem(
          arquivo,
          session.user.id,
          mensagemTemp.id,
          conversaAtiva.id
        );

        imagem = {
          url: await imagensService.getImagemUrl(uploadResponse.filename),
          alt: arquivo.name,
        };

        Object.assign(mensagemTemp, { imagem });
      }

      addMensagem(mensagemTemp);

      const mensagemEnviada = await mensagensService.enviarMensagem(
        mensagemTemp.conversa_id,
        content,
        imagem
      );

      updateMensagem(mensagemTemp.id, {
        ...mensagemEnviada,
        status: 'enviada',
      });

      // Processa a resposta da IA
      const respostaIA = await mensagensService.processarComIA(
        mensagemTemp.conversa_id,
        content
      );
      addMensagem(respostaIA);

    } catch (error) {
      setError('Erro ao enviar mensagem');
      updateMensagem(Date.now().toString(), { status: 'erro' });
    }
  }, [conversaAtiva, addMensagem, updateMensagem, setError]);

  useEffect(() => {
    carregarConversas();
  }, [carregarConversas]);

  return {
    conversas,
    conversaAtiva,
    mensagens,
    carregarConversas,
    criarNovaConversa,
    selecionarConversa,
    enviarMensagem,
  };
}