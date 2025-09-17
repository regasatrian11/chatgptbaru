import React from 'react';
import { Message } from '../types/chat';
import { User, Bot, Image } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isImageMessage = message.content.startsWith('[Gambar') || message.content.startsWith('[Kamera Langsung');

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
      }`}>
        {isImageMessage ? (
          <div className="flex items-center gap-2">
            <Image size={16} className={isUser ? 'text-blue-200' : 'text-gray-500'} />
            <span className="text-sm leading-relaxed">
              {message.content}
            </span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      <span className={`text-xs text-gray-400 mb-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}