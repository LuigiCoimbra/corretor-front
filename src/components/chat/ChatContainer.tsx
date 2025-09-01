'use client';

import { useEffect, useRef, useState } from 'react';
import { useConversas } from '@/hooks/useConversas';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useStore } from '@/store';

export function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { conversaAtiva, mensagens, enviarMensagem } = useConversas();
  const loading = useStore((state) => state.loading);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  if (!conversaAtiva) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Selecione uma conversa
          </h2>
          <p className="mt-2 text-gray-500">
            Escolha uma conversa existente ou inicie uma nova
          </p>
        </div>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-white relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-50 border-2 border-dashed border-blue-300">
          <span className="text-xl text-blue-600 font-medium">Solte a imagem aqui</span>
        </div>
      )}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{conversaAtiva.titulo}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          mensagens.map((mensagem) => (
            <MessageBubble
              key={mensagem.id}
              mensagem={mensagem}
              onCopy={(conteudo) => {
                navigator.clipboard.writeText(conteudo);
              }}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <MessageInput
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
          onSendMessage={async (conteudo, arquivo) => {
            if (conversaAtiva && (conteudo.trim() || arquivo)) {
              await enviarMensagem(conteudo, arquivo);
              setSelectedFile(null);
            }
          }}
        />
      </div>
    </div>
  );
}