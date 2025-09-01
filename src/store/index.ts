import { create } from 'zustand';
import { Conversa } from '@/services/conversas.service';
import { Mensagem } from '@/services/mensagens.service';

interface User {
  id: string;
  email: string;
}

interface AppState {
  user: User | null;
  conversas: Conversa[];
  conversaAtiva: Conversa | null;
  mensagens: Mensagem[];
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setConversas: (conversas: Conversa[]) => void;
  addConversa: (conversa: Conversa) => void;
  setConversaAtiva: (conversa: Conversa | null) => void;
  setMensagens: (mensagens: Mensagem[]) => void;
  addMensagem: (mensagem: Mensagem) => void;
  updateMensagem: (mensagemId: string, updates: Partial<Mensagem>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  conversas: [],
  conversaAtiva: null,
  mensagens: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  setConversas: (conversas) => set({ conversas }),

  addConversa: (conversa) =>
    set((state) => ({
      conversas: [conversa, ...state.conversas],
    })),

  setConversaAtiva: (conversa) => set({ conversaAtiva: conversa }),

  setMensagens: (mensagens) => set({ mensagens }),

  addMensagem: (mensagem) =>
    set((state) => ({
      mensagens: [...state.mensagens, mensagem],
    })),

  updateMensagem: (mensagemId, updates) =>
    set((state) => ({
      mensagens: state.mensagens.map((msg) =>
        msg.id === mensagemId ? { ...msg, ...updates } : msg
      ),
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));