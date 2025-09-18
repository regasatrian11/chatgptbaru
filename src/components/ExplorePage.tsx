import React, { useState } from 'react';
import { Search, TrendingUp, BookOpen, Code, Heart, Lightbulb, MessageSquare, MessageCircle, Crown, Bell, User } from 'lucide-react';
import { NavigationTab } from '../types/navigation';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface ExploreCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  prompts: string[];
}

interface ExplorePageProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function ExplorePage({ activeTab, onTabChange }: ExplorePageProps) {
  const { isLoggedIn, isInitialized } = useGoogleAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              🔍
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              🔍
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk menjelajahi topik dan prompt
            </p>
            <button
              onClick={() => onTabChange('profile')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
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

  const categories: ExploreCategory[] = [
    {
      id: 'content-creator',
      name: 'Content Creator',
      icon: <TrendingUp size={20} />,
      color: 'bg-red-500',
      prompts: [
        'Bagaimana cara memulai karir sebagai content creator?',
        'Tips membuat konten yang viral di media sosial',
        'Strategi monetisasi untuk content creator pemula',
        'Cara membangun personal branding yang kuat'
      ]
    },
    {
      id: 'umkm',
      name: 'UMKM',
      icon: <BookOpen size={20} />,
      color: 'bg-blue-500',
      prompts: [
        'Cara memulai bisnis UMKM dari nol',
        'Tips pemasaran digital untuk UMKM',
        'Strategi mengelola keuangan bisnis kecil',
        'Cara mendapatkan modal usaha untuk UMKM'
      ]
    },
    {
      id: 'pengusaha',
      name: 'Pengusaha',
      icon: <Code size={20} />,
      color: 'bg-green-500',
      prompts: [
        'Mindset yang harus dimiliki seorang pengusaha',
        'Cara mengembangkan bisnis ke skala yang lebih besar',
        'Tips membangun tim yang solid untuk bisnis',
        'Strategi menghadapi kompetitor dalam bisnis'
      ]
    }
  ];

  const handlePromptClick = (prompt: string) => {
    // Navigate to chat and send the prompt automatically
    onTabChange('chat');
    
    // Use setTimeout to ensure we're on the chat page before sending
    setTimeout(() => {
      // Trigger the chat with Mikasa (chatId: '1') and send the prompt
      const event = new CustomEvent('sendPromptToChat', { 
        detail: { prompt, chatId: '1' } 
      });
      window.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-3">Jelajahi</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari topik atau pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`${category.color} text-white p-2 rounded-lg`}>
                  {category.icon}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {category.prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 hover:border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <MessageCircle size={20} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'chat' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Obrolan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <Search size={20} className={activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'explore' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Jelajahi
          </span>
        </button>
        <button 
          onClick={() => onTabChange('subscription')}
          className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
        >
          <Crown size={20} className={activeTab === 'subscription' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'subscription' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Langganan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200 min-w-0"
        >
          <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'} whitespace-nowrap`}>
            Pemberitahuan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
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