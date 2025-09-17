import React from 'react';
import { Bot } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function TypingIndicator() {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      <span className="text-xs text-gray-400 mb-1 ml-1">{t('typing')}</span>
    </div>
  );
}