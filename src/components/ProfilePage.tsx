import React, { useState } from 'react';
import { User, Settings, LogOut, Shield, Bell, HelpCircle, MessageCircle, Search, Crown, ChevronRight, Clock, Smartphone, BarChart3, UserCog, Mail } from 'lucide-react';
import { NavigationTab } from '../types/navigation';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useSubscription } from '../hooks/useSubscription';
import { DemoAuthService } from '../services/demoAuth';
import { adminAuth } from '../services/adminAuth';
import WelcomeLoginPage from './WelcomeLoginPage';
import PrivacySecurityPage from './PrivacySecurityPage';
import SettingsPage from './SettingsPage';
import HelpSupportPage from './HelpSupportPage';
import UserAnalyticsDashboard from './UserAnalyticsDashboard';
import AdminLoginPage from './AdminLoginPage';
import AdminDashboard from './AdminDashboard';

interface ProfilePageProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onLogout?: () => void;
}

export default function ProfilePage({ activeTab, onTabChange, onLogout }: ProfilePageProps) {
  const { user, isLoggedIn, isInitialized, signOut } = useSupabaseAuth();
  const { 
    subscription, 
    isPremium, 
    isPro, 
    isFree, 
    messagesUsed, 
    messagesLimit, 
    messagesRemaining,
    canSendMessage 
  } = useSubscription();
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const demoAuth = DemoAuthService.getInstance();
  const demoInfo = demoAuth.getDemoInfo();
  const remainingTime = demoAuth.getFormattedRemainingTime();
  const adminSession = adminAuth.getAdminSession();

  const handleNavigateToSubscription = () => {
    setShowPrivacyPage(false);
    onTabChange('subscription');
  };

  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              👤
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    if (showLoginForm) {
      return (
        <WelcomeLoginPage
          onLoginSuccess={() => {
            setShowLoginForm(false);
          }}
        />
      );
    }


    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-4">
          <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👤
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk mengakses profil Anda
            </p>
            
            {/* Login/Register Menu */}
            <div className="w-full max-w-sm space-y-3">
              {/* Username/Password Login */}
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white rounded-xl py-4 px-6 hover:bg-blue-600 transition-all duration-200 shadow-sm font-medium"
              >
                <User size={20} />
                <div className="text-center">
                  <div className="font-semibold">Login dengan Username</div>
                  <div className="text-xs opacity-90">Masuk dengan username dan password</div>
                </div>
              </button>
              
              {/* Email Login */}
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-indigo-500 text-white rounded-xl py-4 px-6 hover:bg-indigo-600 transition-all duration-200 shadow-sm font-medium"
              >
                <Mail size={20} />
                <div className="text-center">
                  <div className="font-semibold">Login dengan Email</div>
                  <div className="text-xs opacity-90">Login dengan Email dan Password</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full flex items-center justify-center gap-3 bg-green-500 text-white rounded-xl py-4 px-6 hover:bg-green-600 transition-all duration-200 shadow-sm font-medium"
              >
                <User size={20} />
                <span>Daftar Pengguna Baru</span>
              </button>
              
              {/* Demo Login */}
              <button
                onClick={async () => {
                  try {
                    // Create demo user directly
                    const demoUser = {
                      id: 'demo_user_' + Date.now(),
                      name: 'Demo User',
                      email: 'demo@mikasa.ai',
                      avatar: '👤',
                      isDemo: true
                    };
                    
                    // Save demo user to localStorage
                    localStorage.setItem('mikasa_user', JSON.stringify(demoUser));
                    
                    // Track demo login
                    const { userAnalytics } = await import('../services/userAnalytics');
                    userAnalytics.trackUserLogin(demoUser.id, demoUser.email, 'demo');
                    
                    // Trigger re-render by calling parent
                    window.location.reload();
                  } catch (error) {
                    console.error('Demo login failed:', error);
                    alert('Login demo gagal. Silakan coba lagi.');
                  }
                }}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm font-medium"
              >
                <User size={20} className="text-gray-600" />
                <span className="text-gray-700">Coba Demo Gratis</span>
              </button>
            </div>
            
            {/* Features Preview */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4 font-medium">Fitur Unggulan:</p>
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                    💬
                  </div>
                  <span>Chat AI</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-1">
                    🚀
                  </div>
                  <span>Cepat</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                    🔒
                  </div>
                  <span>Aman</span>
                </div>
              </div>
            </div>
            
            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan kami
              </p>
            </div>
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

  // Show settings/privacy page if logged in
  if (showSettingsPage) {
    return (
      <SettingsPage 
        onBack={() => setShowSettingsPage(false)}
      />
    );
  }

  if (showHelpPage) {
    return (
      <HelpSupportPage 
        onBack={() => setShowHelpPage(false)}
      />
    );
  }

  if (showAnalytics) {
    return (
      <UserAnalyticsDashboard 
        onBack={() => setShowAnalytics(false)}
      />
    );
  }

  if (showAdminLogin) {
    return (
      <AdminLoginPage 
        onBack={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          setShowAdminLogin(false);
          setShowAdminDashboard(true);
        }}
      />
    );
  }

  if (showAdminDashboard) {
    return (
      <AdminDashboard 
        onBack={() => setShowAdminDashboard(false)}
      />
    );
  }

  if (showPrivacyPage) {
    return (
      <PrivacySecurityPage 
        onBack={() => setShowPrivacyPage(false)}
        onNavigateToSubscription={handleNavigateToSubscription}
      />
    );
  }

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      signOut();
      // Reset demo auth when logging out
      demoAuth.resetDemoAuth();
      // Call parent logout handler to reset app state
      if (onLogout) {
        onLogout();
      }
    }
  };

  const handleSettingsClick = () => {
    setShowSettingsPage(true);
  };

  const handlePrivacyClick = () => {
    setShowPrivacyPage(true);
  };

  const handleNotificationClick = () => {
    onTabChange('notifications');
  };

  const handleHelpClick = () => {
    setShowHelpPage(true);
  };

  const handleAnalyticsClick = () => {
    setShowAnalytics(true);
  };

  const handleAdminClick = () => {
    const session = adminAuth.getAdminSession();
    if (session) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white mx-4 mt-4 rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl relative">
            {user?.avatar || '👤'}
            {user?.isDemo && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">D</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{user?.name || 'Demo User'}</h2>
            <p className="text-gray-600 text-sm">{user?.email || 'demo@mikasa.ai'}</p>
            {user?.isDemo && (
              <div className="flex items-center gap-1 mt-1">
                <Smartphone size={12} className="text-blue-500" />
                <span className="text-xs text-blue-600">Akun Demo</span>
              </div>
            )}
          </div>
          {!user?.isDemo && (
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Settings size={16} />
            </button>
          )}
        </div>

        {/* Demo Restrictions Info */}
        {user?.isDemo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Status Demo</span>
            </div>
            <p className="text-xs text-blue-700 mb-2">
              Sisa waktu: {remainingTime}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs text-yellow-700 font-medium mb-1">Pembatasan Akun Demo:</p>
              <ul className="text-xs text-yellow-600 space-y-1">
                <li>• Tidak dapat mengedit profil</li>
                <li>• Tidak dapat mengubah foto profil</li>
                <li>• Batas 10 pesan per hari</li>
                <li>• Akses terbatas selama 24 jam</li>
                <li>• Tidak dapat berlangganan paket premium</li>
                <li>• Tidak dapat melakukan pembayaran</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-yellow-300">
                <p className="text-xs text-yellow-800 font-medium">
                  💡 Daftar akun reguler untuk akses penuh
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Statistik Penggunaan</h3>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Status Langganan</span>
              <div className="flex items-center gap-2">
                {subscription?.end_date && (
                  <span className="text-xs text-gray-500">Berakhir: {new Date(subscription.end_date).toLocaleDateString('id-ID')}</span>
                )}
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                isPremium ? 'bg-purple-100 text-purple-800' :
                isPro ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {isPremium ? 'Premium' : isPro ? 'Pro' : user?.isDemo ? 'Demo' : 'Gratis'}
              </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{messagesUsed}</p>
              {user?.avatar_url || user?.avatar || '👤'}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {messagesLimit === -1 ? '∞' : messagesLimit}
              </p>
              <p className="text-xs text-gray-600">
              <h3 className="font-medium text-gray-900">{user?.full_name || user?.name || 'Demo User'}</h3>
              </p>
              {(user?.username || user?.whatsapp) && (
                <div className="mt-1 space-y-1">
                  {user?.username && (
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  )}
                  {user?.whatsapp && (
                    <p className="text-xs text-gray-500">📱 {user.whatsapp}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: messagesLimit === -1 ? '100%' : `${Math.min((messagesUsed / messagesLimit) * 100, 100)}%` 
              }}
            ></div>
          </div>
          {!canSendMessage && messagesLimit !== -1 && (
            <p className="text-xs text-red-600 mt-2">
              ⚠️ Batas harian tercapai! Upgrade untuk melanjutkan chat.
            </p>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={handleSettingsClick}
          className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="text-gray-600">
            <Settings size={20} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900">
              Pengaturan
            </h3>
            <p className="text-sm text-gray-600">
              Kelola preferensi aplikasi
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button
          onClick={handlePrivacyClick}
          className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="text-gray-600">
            <Shield size={20} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900">
              Privasi & Keamanan
            </h3>
            <p className="text-sm text-gray-600">
              Kontrol data dan keamanan
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button
          onClick={handleNotificationClick}
          className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="text-gray-600">
            <Bell size={20} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900">
              Notifikasi
            </h3>
            <p className="text-sm text-gray-600">
              Atur pemberitahuan
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        {/* Analytics Dashboard - Only for admin/demo users */}


        <button
          onClick={handleHelpClick}
          className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <div className="text-gray-600">
            <HelpCircle size={20} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-medium text-gray-900">
              Bantuan & Dukungan
            </h3>
            <p className="text-sm text-gray-600">
              FAQ dan kontak support
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl border border-red-200 p-4 flex items-center gap-3 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} className="text-red-500" />
          <div className="flex-1 text-left">
            <h3 className="font-medium text-red-600">Keluar</h3>
            <p className="text-sm text-red-500">Keluar dari akun Anda</p>
          </div>
        </button>
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
          <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
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