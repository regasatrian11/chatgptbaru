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

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-lg font-medium text-gray-900">Mikasa AI</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👩‍💻
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Selamat Datang di Mikasa AI!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk mengakses fitur chat dan lainnya
            </p>
            <button
              onClick={() => onTabChange('profile')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>

        {/* Bottom Navigation - Only Profile accessible */}
        <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
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
            className="flex flex-col items-center gap-1"
          >
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div></div> {/* Empty space where title was */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Search size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleNewChatClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit3 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 p-4">
        <h3 className="font-medium text-gray-900 mb-3">Pesan Hari Ini</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            {subscription?.end_date && (
              <span className="text-xs text-gray-500">Berakhir: {new Date(subscription.end_date).toLocaleDateString('id-ID')}</span>
            )}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
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
        <div className="bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              messagesUsed >= messagesLimit * 0.8 ? 'bg-red-500' : 
              messagesUsed >= messagesLimit * 0.6 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ 
              width: messagesLimit === -1 ? '100%' : `${Math.min((messagesUsed / messagesLimit) * 100, 100)}%` 
            }}
          ></div>
        </div>
        {!canSendMessage && messagesLimit !== -1 && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            ⚠️ Batas harian tercapai ({messagesUsed}/{messagesLimit}). 
            {messagesLimit === 10 ? ' Daftar akun reguler atau upgrade ke Premium!' : ' Upgrade ke Premium untuk melanjutkan!'}
          </p>
        )}
        {canSendMessage && messagesUsed >= messagesLimit * 0.8 && (
          <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg">
            ⚠️ Hampir mencapai batas harian ({messagesUsed}/{messagesLimit}).
          </p>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        {showSearch && (
          <div className="mx-4 mt-2 mb-4">
            <input
              type="text"
              placeholder="Cari obrolan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}
        
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors active:bg-gray-100"
            >
              <div className="relative">
                {chat.id === '1' ? (
                  <img 
                    src={chat.avatar} 
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-400 shadow-lg"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-lg shadow-lg">
                    {chat.avatar}
                  </div>
                )}
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  {chat.isAIAgent && (
                    <span className="text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                  {chat.website && (
                    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                      {chat.website}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
          
          {filteredChats.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Tidak ada obrolan yang ditemukan</p>
            </div>
          )}
          </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={20} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'chat' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Obrolan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Search size={20} className={activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'explore' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Jelajahi
          </span>
        </button>
        <button 
          onClick={() => onTabChange('subscription')}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Crown size={20} className={activeTab === 'subscription' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'subscription' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Langganan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Pemberitahuan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <User size={20} className={activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Profil
          </span>
        </button>
      </div>
    </div>
  );
}