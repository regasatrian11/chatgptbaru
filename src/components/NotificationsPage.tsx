import React, { useState } from 'react';
import { Bell, Check, X, Info, CheckCircle, AlertTriangle, MessageCircle, Search, Crown, User } from 'lucide-react';
import { Notification, NavigationTab } from '../types/navigation';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useChat } from '../hooks/useChat';

interface NotificationsPageProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function NotificationsPage({ activeTab, onTabChange }: NotificationsPageProps) {
  const { isLoggedIn, isInitialized } = useGoogleAuth();
  const { getUsageStats } = useChat();
  const usageStats = getUsageStats();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Selamat datang di Mikasa AI!',
      message: 'Terima kasih telah bergabung. Mulai chat pertama Anda sekarang.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Batas pesan harian',
      message: `Anda telah menggunakan ${usageStats.messagesUsed} dari ${usageStats.messagesLimit} pesan gratis hari ini.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: usageStats.messagesUsed < usageStats.messagesLimit * 0.8, // Mark as unread if usage > 80%
      type: 'warning'
    },
    {
      id: '3',
      title: 'Fitur baru tersedia',
      message: 'Coba fitur analisis gambar yang baru diluncurkan.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      type: 'info'
    },
    {
      id: '4',
      title: 'Upgrade ke Premium',
      message: 'Dapatkan akses unlimited dengan berlangganan Premium.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true,
      type: 'info'
    }
  ]);
  
  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              🔔
            </div>
            <p className="text-gray-600">Memuat...</p>
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

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              🔔
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk melihat pemberitahuan
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


  // Show success notification helper
  const showSuccessNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    showSuccessNotification('Pemberitahuan ditandai sudah dibaca');
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    showSuccessNotification('Semua pemberitahuan ditandai sudah dibaca');
  };

  const deleteNotification = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pemberitahuan ini?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      showSuccessNotification('Pemberitahuan berhasil dihapus');
    }
  };

  const clearAllNotifications = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua pemberitahuan?')) {
      setNotifications([]);
      showSuccessNotification('Semua pemberitahuan berhasil dihapus');
    }
  };
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} hari lalu`;
    if (hours > 0) return `${hours} jam lalu`;
    if (minutes > 0) return `${minutes} menit lalu`;
    return 'Baru saja';
            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200 min-w-0"
            <Bell className="text-gray-700" size={24} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Pemberitahuan</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-blue-600">{unreadCount} belum dibaca</p>
              )}
            </div>
            <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'} whitespace-nowrap`}>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Tandai semua
              </button>
            )}
            {notifications.length > 0 && (
              <button
            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
                className="text-red-500 text-sm font-medium hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Hapus semua
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <Bell className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pemberitahuan</h3>
              <p className="text-gray-500 text-sm">
                Pemberitahuan akan muncul di sini
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Tandai sudah dibaca"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={20} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'chat' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Obrolan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center gap-1"
        >
          <Search size={20} className={activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'explore' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Jelajahi
          </span>
        </button>
        <button 
          onClick={() => onTabChange('subscription')}
          className="flex flex-col items-center gap-1"
        >
          <Crown size={20} className={activeTab === 'subscription' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'subscription' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Langganan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1"
        >
          <div className="relative">
            <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
              </div>
            )}
          </div>
          <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Pemberitahuan
          </span>
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