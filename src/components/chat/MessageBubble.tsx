'use client';

import { useMemo, useEffect, useState } from 'react';
import { imagensService } from '@/services/imagens.service';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClipboardIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { Mensagem } from '@/services/mensagens.service';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
  mensagem: Mensagem;
  onCopy?: (conteudo: string) => void;
}

export function MessageBubble({ mensagem, onCopy }: MessageBubbleProps) {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (mensagem.imagem_anexada) {
      setIsLoadingImage(true);
      imagensService.carregarImagem(mensagem.imagem_anexada.url_publica.replace('/api', ''))
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .finally(() => {
          setIsLoadingImage(false);
        });
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [mensagem.imagem_anexada]);
  const isUsuario = mensagem.tipo === 'usuario';
  console.log('Mensagem:', mensagem);

  const statusIcon = useMemo(() => {
    switch (mensagem.status) {
      case 'enviando':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
        );
      case 'enviada':
        return <CheckIcon className="h-4 w-4 text-green-500" />;
      case 'erro':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  }, [mensagem.status]);

  const handleCopy = () => {
    if (onCopy) {
      onCopy(mensagem.conteudo);
    } else {
      navigator.clipboard.writeText(mensagem.conteudo);
    }
  };

  return (
    <div
      className={`flex ${isUsuario ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUsuario
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {mensagem.imagem_anexada && (
          isLoadingImage ? (
            <div className="mb-2 flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : imageUrl && (
            <div className="mb-2 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl || ''}
                loader={({ src }) => src}
                alt={mensagem.imagem_anexada.nome_original}
                width={400}
                height={300}
                className="object-contain w-full h-auto max-h-[300px]"
                priority
                unoptimized
              />
            </div>
        ))
        }

        <div className="prose max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {mensagem.conteudo}
          </ReactMarkdown>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <span className={isUsuario ? 'text-blue-200' : 'text-gray-500'}>
            {format(new Date(mensagem.created_at ?? mensagem.createdAt), 'PP p', {
              locale: ptBR,
            })}
          </span>

          <div className="flex items-center gap-2">
            {statusIcon}
            <button
              onClick={handleCopy}
              className={`p-1 rounded hover:bg-opacity-10 ${
                isUsuario
                  ? 'hover:bg-white text-white'
                  : 'hover:bg-gray-200 text-gray-500'
              }`}
              title="Copiar mensagem"
            >
              <ClipboardIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}