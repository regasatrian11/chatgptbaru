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
    <div className={`flex items-end gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 relative ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md shadow-xl' 
          : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-white rounded-bl-md shadow-xl border border-white/30 dark:border-gray-700/50 transition-colors duration-300'
      }`}>
        {isUser && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30"></div>
        )}
        {!isUser && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-20"></div>
        )}
        <div className="relative">
        {isImageMessage ? (
          <div className="flex items-center gap-2">
            <Image size={16} className={isUser ? 'text-blue-200' : 'text-purple-500 dark:text-purple-400'} />
            <span className="text-sm leading-relaxed">
              {message.content}
            </span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
        )}
        </div>
      </div>
      <span className={`text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium ${isUser ? 'mr-1' : 'ml-1'} transition-colors duration-300`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}