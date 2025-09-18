import React, { useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Image, Camera } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import CameraCapture from './CameraCapture';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (file: File) => void;
  onTakePhoto: (file: File) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, onSendImage, onTakePhoto, disabled }: ChatInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onSendImage(file);
      setShowAttachMenu(false);
    }
    // Reset input
    event.target.value = '';
  };

  const handleCameraCapture = (file: File) => {
    onTakePhoto(file);
    setShowAttachMenu(false);
    setShowCamera(false);
  };

  return (
    <>
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
      
      <div className="p-4">
      {/* Attachment Menu */}
      {showAttachMenu && (
        <div className="mb-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl p-3 transition-colors duration-300">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
          <div className="relative">
          <label className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-300">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Image size={16} className="text-white" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Kirim Foto</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
              disabled={disabled}
            />
          </label>
          <button
            onClick={() => {
              setShowCamera(true);
              setShowAttachMenu(false);
            }}
            disabled={disabled}
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">Kamera Langsung</span>
          </button>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 items-end relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur"></div>
        <div className="relative flex gap-3 items-end w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-3 border border-white/30 dark:border-gray-700/50 shadow-xl transition-colors duration-300">
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          disabled={disabled}
          className="w-11 h-11 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 rounded-full hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('typeMessage')}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="flex-1 resize-none rounded-2xl border border-white/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] max-h-32 bg-white/70 backdrop-blur-sm shadow-inner font-medium"
          className="flex-1 resize-none rounded-2xl border border-white/30 dark:border-gray-700/50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] max-h-32 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-inner font-medium text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110"
        >
          <Send size={18} />
        </button>
        </div>
      </div>
      </div>
    </>
  );
}