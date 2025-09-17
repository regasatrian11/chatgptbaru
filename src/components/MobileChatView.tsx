import React, { useEffect } from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useSubscription } from '../hooks/useSubscription';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import ErrorMessage from './ErrorMessage';

interface MobileChatViewProps {
  chatId: string;
  onBack: () => void;
}

export default function MobileChatView({ chatId, onBack }: MobileChatViewProps) {
  const { isLoggedIn, isInitialized } = useSupabaseAuth();
  const { canSendMessage, messagesRemaining, messagesUsed, messagesLimit } = useSubscription();
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    clearError, 
    messagesEndRef,
    getUsageStats
  } = useChat();

  const chatName = chatId === '1' ? 'Mikasa' : 'Minnie Teman Baik Kamu';
  const chatAvatar = chatId === '1' ? '👩‍💻' : '👩‍🦰';
  const isOnline = chatId === '1';

  // Listen for auto-send message events
  useEffect(() => {
    const handleAutoSendMessage = (event: CustomEvent) => {
      const { message } = event.detail;
      if (message && isLoggedIn && canSendMessage) {
        handleSendMessage(message);
      }
    };

    window.addEventListener('autoSendMessage', handleAutoSendMessage as EventListener);
    
    return () => {
      window.removeEventListener('autoSendMessage', handleAutoSendMessage as EventListener);
    };
  }, [isLoggedIn, canSendMessage]);

  const handlePhoneCall = () => {
    alert('Fitur panggilan telepon belum tersedia');
  };

  const handleVideoCall = () => {
    alert('Fitur panggilan video belum tersedia');
  };

  const handleMenuClick = () => {
    alert('Menu chat akan segera tersedia');
  };

  const handleSendMessage = async (content: string) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk mengirim pesan');
      return;
    }
    
    if (!canSendMessage) {
      const usageStats = getUsageStats();
      alert(`Batas pesan harian tercapai (${usageStats.messagesUsed}/${usageStats.messagesLimit}). ${usageStats.messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium!' : 'Upgrade ke Premium untuk melanjutkan!'}`);
      return;
    }
    
    await sendMessage(content);
  };

  const handleSendImage = async (file: File) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk mengirim gambar');
      return;
    }
    
    if (!canSendMessage) {
      const usageStats = getUsageStats();
      alert(`Batas pesan harian tercapai (${usageStats.messagesUsed}/${usageStats.messagesLimit}). ${usageStats.messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium!' : 'Upgrade ke Premium untuk melanjutkan!'}`);
      return;
    }
    
    // Create a message with image
    const imageUrl = URL.createObjectURL(file);
    const imageMessage = `[Gambar: ${file.name}]`;
    
    await sendMessage(imageMessage);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    notification.textContent = 'Gambar berhasil dikirim!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      URL.revokeObjectURL(imageUrl);
    }, 3000);
  };
  // Show loading while checking auth status
  const handleTakePhoto = async (file: File) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk menggunakan kamera');
      return;
    }
    
    if (!canSendMessage) {
      const usageStats = getUsageStats();
      alert(`Batas pesan harian tercapai (${usageStats.messagesUsed}/${usageStats.messagesLimit}). ${usageStats.messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium!' : 'Upgrade ke Premium untuk melanjutkan!'}`);
      return;
    }
    
    // Create a message with front camera photo
    const imageUrl = URL.createObjectURL(file);
    const imageMessage = `[Kamera Langsung: ${file.name}]`;
    
    await sendMessage(imageMessage);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    notification.textContent = 'Foto dari kamera berhasil dikirim!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
      URL.revokeObjectURL(imageUrl);
    }, 3000);
  };
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              👩‍💻
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
              {chatAvatar}
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">{chatName}</h2>
            {isOnline && <p className="text-xs text-green-500">Online</p>}
            {!canSendMessage && (
              <p className="text-xs text-red-500">Batas pesan tercapai</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePhoneCall}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Phone size={18} className="text-gray-600" />
          </button>
          <button 
            onClick={handleVideoCall}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Video size={18} className="text-gray-600" />
          </button>
          <button 
            onClick={handleMenuClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {error && (
          <ErrorMessage message={error} onDismiss={clearError} />
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                {chatAvatar}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{chatName}</h3>
              <p className="text-gray-500 text-sm">
                Mulai percakapan dengan {chatName}
              </p>
              {isLoggedIn && (
                <div className="mt-4 text-xs text-gray-500">
                  Pesan tersisa: {messagesRemaining === -1 ? '∞' : messagesRemaining}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-4 py-2">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {isLoggedIn ? (
        <div className="bg-white border-t border-gray-100">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onSendImage={handleSendImage}
            onTakePhoto={handleTakePhoto}
            disabled={isLoading || !canSendMessage} 
          />
          {!canSendMessage && (
            <div className="px-4 pb-2">
              <p className="text-xs text-red-600 text-center">
                Batas pesan harian tercapai ({messagesUsed}/{messagesLimit}). 
                {messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium!' : 'Upgrade ke Premium untuk melanjutkan!'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border-t border-gray-100 p-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Silakan login terlebih dahulu untuk dapat mengirim pesan
            </p>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}