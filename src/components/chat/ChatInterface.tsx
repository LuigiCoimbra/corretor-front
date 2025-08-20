'use client';

import { useState } from 'react';
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';
import Image from 'next/image';

import { Chat, Message } from '@/types';

export default function ChatInterface() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
    }
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
        setSelectedImage(file);
      }
    }
  };

  const simulateAgentResponse = (chat: Chat) => {
    setTimeout(() => {
      const agentResponse: Message = {
        id: Date.now().toString(),
        content: 'Esta é uma resposta simulada do agente.',
        sender: 'agent',
        timestamp: new Date(),
      };

      const chatWithResponse = {
        ...chat,
        messages: [...chat.messages, agentResponse],
      };

      setChats(chats.map(c =>
        c.id === chat.id ? chatWithResponse : c
      ));
      setCurrentChat(chatWithResponse);
    }, 1000);
  };

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `Nova Conversa ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    let imageData;
    if (selectedImage) {
      // Converter a imagem para Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        const newMessage: Message = {
          id: Date.now().toString(),
          content: message,
          sender: 'user',
          timestamp: new Date(),
          image: {
            url: imageUrl,
            alt: selectedImage.name
          }
        };

        const updatedChat = {
          ...currentChat,
          messages: [...currentChat.messages, newMessage],
        };

        setChats(chats.map(chat => 
          chat.id === currentChat.id ? updatedChat : chat
        ));
        setCurrentChat(updatedChat);
        setMessage('');
        setSelectedImage(null);

        // Simular resposta do agente
        simulateAgentResponse(updatedChat);
      };
      reader.readAsDataURL(selectedImage);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
    };

    setChats(chats.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ));
    setCurrentChat(updatedChat);
    setMessage('');

    // Simular resposta do agente
    simulateAgentResponse(updatedChat);
  };

  return (
    <div 
      className="flex h-screen bg-gray-100 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-50 bg-opacity-90 flex items-center justify-center z-50 border-2 border-dashed border-indigo-300">
          <span className="text-xl text-indigo-600 font-medium">Solte a imagem aqui</span>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Nova Conversa
          </button>
        </div>
        <div className="overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${currentChat?.id === chat.id ? 'bg-gray-100' : ''}`}
            >
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-700">{chat.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    {message.content}
                    {message.image && (
                      <div className="mt-2">
                        <Image
                          src={message.image.url}
                          alt={message.image.alt}
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex space-x-4 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <ImageUpload 
                  onImageUpload={(file) => setSelectedImage(file)} 
                  selectedImage={selectedImage}
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Nenhuma conversa selecionada</h3>
              <p className="mt-1 text-sm text-gray-500">Crie uma nova conversa ou selecione uma existente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}