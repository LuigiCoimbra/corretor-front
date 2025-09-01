'use client';

import { useState, useCallback, useMemo } from 'react';
import { useConversas } from '@/hooks/useConversas';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ConversationList() {
  const [busca, setBusca] = useState('');
  const { conversas, conversaAtiva, criarNovaConversa, selecionarConversa } = useConversas();

  const handleNovaChatClick = useCallback(async () => {
    try {
      const session = await fetch('/api/auth/session').then((res) => res.json());
      if (!session?.token) {
        throw new Error('Usuário não autenticado');
      }
      await criarNovaConversa('Nova Conversa');
    } catch (error) {
      console.error('Erro ao criar nova conversa:', error);
      // Recarrega a página se o erro for de autenticação
      if (error.message === 'Usuário não autenticado') {
        window.location.reload();
      }
    }
  }, [criarNovaConversa]);

  const conversasFiltradas = useMemo(() => {
    if (!busca.trim()) return conversas;
    const termoBusca = busca.toLowerCase();
    return conversas.filter(
      (conversa) =>
        conversa.titulo.toLowerCase().includes(termoBusca) ||
        conversa.ultimaMensagem?.conteudo.toLowerCase().includes(termoBusca)
    );
  }, [conversas, busca]);

  return (
    <div className="w-80 h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleNovaChatClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nova Conversa
        </button>

        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversasFiltradas.map((conversa) => (
          <button
            key={conversa.id}
            onClick={() => selecionarConversa(conversa.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              conversaAtiva?.id === conversa.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{conversa.titulo}</h3>
              {conversa.naoLidas > 0 && (
                <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                  {conversa.naoLidas}
                </span>
              )}
            </div>

            {conversa.ultimaMensagem && (
              <div className="mt-1">
                <p className="text-sm text-gray-600 truncate">
                  {conversa.ultimaMensagem.conteudo}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(conversa.ultimaMensagem.data), 'PP', {
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}