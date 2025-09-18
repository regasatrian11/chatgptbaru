import React from 'react';
import { useState } from 'react';
import { MessageCircle, Search, Edit3, Crown, Bell, User } from 'lucide-react';
import { NavigationTab } from '../types/navigation';
import { useSubscription } from '../hooks/useSubscription';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  website?: string;
  isOnline?: boolean;
  isAIAgent?: boolean;
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function ChatList({ onSelectChat, onNewChat, activeTab, onTabChange }: ChatListProps) {
  const { 
    subscription, 
    isPremium, 
    isPro, 
    messagesUsed, 
    messagesLimit, 
    messagesRemaining,
    canSendMessage 
  } = useSubscription();
  const { isLoggedIn, isInitialized } = useSupabaseAuth();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Mikasa',
      avatar: '/dww.png',
      lastMessage: '[Gambar]',
      isOnline: true,
      isAIAgent: true
    },
    {
      id: '2',
      name: 'Minnie Teman Baik Kamu',
      avatar: '🌸',
      lastMessage: 'Hai! Apa kabar? 😊 Ada yang ingin ka...',
      isOnline: false,
      isAIAgent: true
    }
  ]);

  const handleMenuClick = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedChats([]); // Reset selected chats when toggling mode
    console.log('Select mode toggled:', !isSelectMode);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    console.log('Search toggled:', !showSearch);
  };

  const handleNewChatClick = () => {
    console.log('New chat clicked');
    // Create a new chat with Mikasa
    onSelectChat('1');
  };

  const handleChatSelect = (chatId: string) => {
    // Prevent selecting AI agents
    const chat = chats.find(c => c.id === chatId);
    if (chat?.isAIAgent) {
      return;
    }
    
    setSelectedChats(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };

  const handleDeleteChats = () => {
    if (selectedChats.length === 0) {
      alert('Pilih obrolan yang ingin dihapus');
      return;
    }

    // Filter out AI agents from deletion
    const deletableChats = selectedChats.filter(chatId => {
      const chat = chats.find(c => c.id === chatId);
      return !chat?.isAIAgent;
    });

    if (deletableChats.length === 0) {
      alert('Agent AI tidak dapat dihapus');
      return;
    }

    const confirmMessage = `Apakah Anda yakin ingin menghapus ${deletableChats.length} obrolan?`;
    if (confirm(confirmMessage)) {
      setChats(prev => prev.filter(chat => !deletableChats.includes(chat.id)));
      setSelectedChats([]);
      setIsSelectMode(false);
      
      // Show success notification
      alert(`${deletableChats.length} obrolan berhasil dihapus`);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse shadow-xl">
              👩‍💻
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/80 backdrop-blur-sm">
          <h1 className="text-lg font-medium text-gray-900">Mikasa AI</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl animate-pulse">
              👩‍💻
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Selamat Datang di Mikasa AI!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk mengakses fitur chat dan lainnya
            </p>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur opacity-75 animate-pulse"></div>
              <button
                onClick={() => onTabChange('profile')}
                className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Only Profile accessible */}
        <div className="flex items-center justify-around p-4 border-t border-white/20 bg-white/90 backdrop-blur-sm">
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <MessageCircle size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Obrolan</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <Search size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Jelajahi</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <Crown size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Langganan</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <Bell size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Pemberitahuan</span>
          </button>
          <button 
            onClick={() => onTabChange('profile')}
            className="flex flex-col items-center gap-1 relative"
          >
            {activeTab === 'profile' && (
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-50"></div>
            )}
            <User size={20} className={activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'} />
            <span className={`text-xs ${activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              Profil
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
        <div></div> {/* Empty space where title was */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <Search size={20} className="text-indigo-600" />
          </button>
          <button
            onClick={handleNewChatClick}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          >
            <Edit3 size={20} className="text-purple-600" />
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md mx-4 mt-4 rounded-2xl border border-white/30 p-4 shadow-xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
        <div className="relative">
        <h3 className="font-medium text-gray-900 mb-3">Pesan Hari Ini</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            {subscription?.end_date && (
              <span className="text-xs text-gray-500">Berakhir: {new Date(subscription.end_date).toLocaleDateString('id-ID')}</span>
            )}
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
              isPremium ? 'bg-purple-100 text-purple-800' :
              isPro ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {isPremium ? 'Premium' : isPro ? 'Pro' : isLoggedIn ? 'Gratis' : 'Demo'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            {messagesUsed}/{messagesLimit === -1 ? '∞' : messagesLimit} pesan
          </span>
          <span className="text-sm text-gray-600">
            {messagesLimit === -1 ? '∞' : messagesRemaining} tersisa
          </span>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              messagesUsed >= messagesLimit * 0.8 ? 'bg-red-500' : 
              messagesUsed >= messagesLimit * 0.6 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ 
              width: messagesLimit === -1 ? '100%' : `${Math.min((messagesUsed / messagesLimit) * 100, 100)}%` 
            }}
          ></div>
        </div>
        {!canSendMessage && messagesLimit !== -1 && (
          <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
            <p className="text-xs text-red-700 font-medium text-center">
            ⚠️ Batas harian tercapai ({messagesUsed}/{messagesLimit}). 
            {messagesLimit === 10 ? ' Daftar akun reguler atau upgrade ke Premium!' : ' Upgrade ke Premium untuk melanjutkan!'}
          </p>
        )}
        {canSendMessage && messagesUsed >= messagesLimit * 0.8 && (
          <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg">
            ⚠️ Hampir mencapai batas harian ({messagesUsed}/{messagesLimit}).
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        {showSearch && (
          <div className="mx-4 mt-2 mb-4">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-30"></div>
            <input
              type="text"
              placeholder="Cari obrolan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 backdrop-blur-sm shadow-lg"
              autoFocus
            />
            </div>
          </div>
        )}
        
        <div className="space-y-2 px-4">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="relative group flex items-center gap-3 p-4 hover:bg-white/70 cursor-pointer rounded-2xl transition-all duration-300 active:scale-95 hover:shadow-xl backdrop-blur-sm border border-white/20"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-400/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 rounded-2xl blur transition-all duration-300"></div>
              <div className="relative flex items-center gap-3 w-full">
              <div className="relative">
                {chat.id === '1' ? (
                  <img 
                    src={chat.avatar} 
                    alt={chat.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-gradient-to-r from-blue-400 to-purple-500 shadow-2xl"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl shadow-2xl">
                    {chat.avatar}
                  </div>
                )}
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg">{chat.name}</h3>
                  {chat.isAIAgent && (
                    <span className="text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full font-bold shadow-lg">
                      AI
                    </span>
                  )}
                  {chat.website && (
                    <span className="text-xs text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-1 rounded-full font-bold shadow-lg">
                      {chat.website}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate font-medium">{chat.lastMessage}</p>
              </div>
              </div>
            </div>
          ))}
          
          {filteredChats.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Search className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-500">Tidak ada obrolan yang ditemukan</p>
            </div>
          )}
          </div>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 flex items-center justify-around p-4 border-t border-white/20 bg-white/90 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
        >
          {activeTab === 'chat' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-50"></div>
          )}
          <div className="relative">
          <MessageCircle size={20} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'chat' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Obrolan
          </span>
          </div>
        </button>
        <button 
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
        >
          {activeTab === 'explore' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-xl blur opacity-50"></div>
          )}
          <div className="relative">
          <Search size={20} className={activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'explore' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Jelajahi
          </span>
          </div>
        </button>
        <button 
          onClick={() => onTabChange('subscription')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
        >
          {activeTab === 'subscription' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-50"></div>
          )}
          <div className="relative">
          <Crown size={20} className={activeTab === 'subscription' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'subscription' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Langganan
          </span>
          </div>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
        >
          {activeTab === 'notifications' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl blur opacity-50"></div>
          )}
          <div className="relative">
          <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Pemberitahuan
          </span>
          </div>
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
        >
          {activeTab === 'profile' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl blur opacity-50"></div>
          )}
          <div className="relative">
          <User size={20} className={activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Profil
          </span>
          </div>
        </button>
      </div>
    </div>
  );
}