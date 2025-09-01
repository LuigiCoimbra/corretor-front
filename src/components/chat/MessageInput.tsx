'use client';

import { useState, useRef, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { ImageUpload } from './ImageUpload';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => Promise<void>;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export function MessageInput({ onSendMessage, selectedFile, onFileSelect }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (content.trim() || selectedFile) {
      await onSendMessage(content.trim(), selectedFile || undefined);
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative rounded-lg border border-gray-300">

      <div className="p-2">

        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 max-h-48 p-2 focus:outline-none resize-none rounded-lg"
            rows={1}
          />

          <div className="flex items-center gap-2 pb-2">
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ImageUpload
                onImageSelect={onFileSelect}
                selectedImage={selectedFile}
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={false}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}