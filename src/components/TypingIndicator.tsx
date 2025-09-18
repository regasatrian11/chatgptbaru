import React from 'react';
import { Bot } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function TypingIndicator() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-xl border border-white/30 dark:border-gray-700/50 relative transition-colors duration-300">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl blur opacity-20"></div>
        <div className="relative">
        <div className="flex space-x-1">
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1 font-medium transition-colors duration-300">{t('typing')}</span>
    </div>
  );
}