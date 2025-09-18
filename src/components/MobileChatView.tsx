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
  const chatAvatar = chatId === '1' ? '/dww.png' : '/444444.jpg';
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-red-500/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-400/10 to-teal-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 bg-white/90 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-white/70 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <ArrowLeft size={20} className="text-indigo-600" />
          </button>
          {chatId === '1' ? (
            <div className="relative">
              <img 
                src="/dddddddddddd.jpg"
                alt={chatName}
                className="w-12 h-12 rounded-full object-cover border-3 border-gradient-to-r from-blue-400 to-purple-500 shadow-2xl"
              />
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              )}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg shadow-2xl border-2 border-white/30">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                  <img 
                    src={chatAvatar} 
                    alt={chatName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-2xl"
                  />
                </div>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                )}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{chatName}</h2>
            {isOnline && <p className="text-xs text-green-600 font-medium">● Online</p>}
            {!canSendMessage && (
              <p className="text-xs text-red-600 font-medium">⚠️ Batas pesan tercapai</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePhoneCall}
            className="p-2 hover:bg-white/70 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <Phone size={18} className="text-green-600" />
          </button>
          <button 
            onClick={handleVideoCall}
            className="p-2 hover:bg-white/70 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <Video size={18} className="text-blue-600" />
          </button>
          <button 
            onClick={handleMenuClick}
            className="p-2 hover:bg-white/70 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <MoreVertical size={18} className="text-purple-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-sm">
        {error && (
          <ErrorMessage message={error} onDismiss={clearError} />
        )}
        
        {messages.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl mx-4 shadow-2xl border border-white/30">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-20"></div>
              <div className="relative">
                {chatId === '1' ? (
                  <img 
                    src="/dddddddddddd.jpg"
                    alt={chatName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-blue-400 to-purple-500 shadow-2xl mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-2xl border-4 border-white/30">
                    {chatAvatar}
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{chatName}</h3>
                <p className="text-gray-600 text-sm font-medium">
                  Mulai percakapan dengan {chatName}
                </p>
                {isLoggedIn && (
                  <div className="mt-4 text-xs text-indigo-600 font-medium">
                    Pesan tersisa: {messagesRemaining === -1 ? '∞' : messagesRemaining}
                  </div>
                )}
              </div>
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
        <div className="relative z-10 bg-white/90 backdrop-blur-md border-t border-white/20 shadow-2xl">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            onSendImage={handleSendImage}
            onTakePhoto={handleTakePhoto}
            disabled={isLoading || !canSendMessage} 
          />
          {!canSendMessage && (
            <div className="px-4 pb-2">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs text-red-700 text-center font-medium">
                  Batas pesan harian tercapai ({messagesUsed}/{messagesLimit}). 
                  {messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium!' : 'Upgrade ke Premium untuk melanjutkan!'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 bg-white/90 backdrop-blur-md border-t border-white/20 p-4 shadow-2xl">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Silakan login terlebih dahulu untuk dapat mengirim pesan
            </p>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-50"></div>
              <button
                onClick={onBack}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}