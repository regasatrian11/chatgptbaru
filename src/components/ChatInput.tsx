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
        <div className="mb-3 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
          <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
            <Image size={20} className="text-blue-500" />
            <span className="text-sm text-gray-700">Kirim Foto</span>
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
            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={20} className="text-green-500" />
            <span className="text-sm text-gray-700">Kamera Langsung</span>
          </button>
        </div>
      )}
      
      <div className="flex gap-3 items-end">
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          disabled={disabled}
          className="w-11 h-11 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
          className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] max-h-32 bg-gray-50"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="w-11 h-11 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </div>
      </div>
    </>
  );
}