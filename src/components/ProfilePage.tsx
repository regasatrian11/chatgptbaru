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
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse shadow-2xl">
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
      <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 p-4 shadow-lg">
          <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-2xl animate-pulse">
              👤
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk mengakses profil Anda
            </p>
            
            {/* Login/Register Menu */}
            <div className="w-full max-w-sm space-y-4">
              {/* Username/Password Login */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur opacity-30"></div>
              <button
                onClick={() => setShowLoginForm(true)}
                className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl py-4 px-6 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-xl font-bold transform hover:scale-105"
              >
                <User size={20} />
                <div className="text-center">
                  <div className="font-semibold">Login dengan Username</div>
                  <div className="text-xs opacity-90">Masuk dengan username dan password</div>
                </div>
              </button>
              </div>
              
              {/* Email Login */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl blur opacity-30"></div>
              <button
                onClick={() => setShowLoginForm(true)}
                className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl py-4 px-6 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-xl font-bold transform hover:scale-105"
              >
                <Mail size={20} />
                <div className="text-center">
                  <div className="font-semibold">Login dengan Email</div>
                  <div className="text-xs opacity-90">Login dengan Email dan Password</div>
                </div>
              </button>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-30"></div>
              <button
                onClick={() => setShowLoginForm(true)}
                className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-4 px-6 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-xl font-bold transform hover:scale-105"
              >
                <User size={20} />
                <span>Daftar Pengguna Baru</span>
              </button>
              </div>
              
              {/* Demo Login */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-30"></div>
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
                className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl py-4 px-6 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl font-bold transform hover:scale-105"
              >
                <User size={20} />
                <span>Coba Demo Gratis</span>
              </button>
              </div>
            </div>
            
            {/* Features Preview */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4 font-medium">Fitur Unggulan:</p>
              <div className="flex justify-center gap-6 text-xs text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    💬
                  </div>
                  <span className="font-medium">Chat AI</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    🚀
                  </div>
                  <span className="font-medium">Cepat</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    🔒
                  </div>
                  <span className="font-medium">Aman</span>
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
        <div className="relative z-10 flex items-center justify-around p-4 border-t border-white/20 bg-white/90 backdrop-blur-md shadow-2xl">
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
            className="flex flex-col items-center gap-1 relative group"
          >
            {activeTab === 'profile' && (
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl blur opacity-50"></div>
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 p-4 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-900">Profil</h1>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md mx-4 mt-4 rounded-2xl border border-white/30 p-6 shadow-2xl">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
        <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl relative shadow-2xl">
            {user?.avatar || '👤'}
            {user?.isDemo && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs text-white font-bold">D</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Demo User'}</h2>
            <p className="text-gray-600 text-sm font-medium">{user?.email || 'demo@mikasa.ai'}</p>
            {user?.isDemo && (
              <div className="flex items-center gap-1 mt-1">
                <Smartphone size={12} className="text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">Akun Demo</span>
              </div>
            )}
          </div>
          {!user?.isDemo && (
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/70 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110">
              <Settings size={16} />
            </button>
          )}
        </div>
        </div>
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
        <div className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-inner">
          <h3 className="font-medium text-gray-900 mb-3">Statistik Penggunaan</h3>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Status Langganan</span>
              <div className="flex items-center gap-2">
                {subscription?.end_date && (
                  <span className="text-xs text-gray-500">Berakhir: {new Date(subscription.end_date).toLocaleDateString('id-ID')}</span>
                )}
              <span className={`text-sm font-bold px-3 py-1 rounded-full shadow-lg ${
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
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{messagesUsed}</p>
              {user?.avatar_url || user?.avatar || '👤'}
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
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
          <div className="mt-3 bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ 
                width: messagesLimit === -1 ? '100%' : `${Math.min((messagesUsed / messagesLimit) * 100, 100)}%` 
              }}
            ></div>
          </div>
          {!canSendMessage && messagesLimit !== -1 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-700 font-medium text-center">
              ⚠️ Batas harian tercapai! Upgrade untuk melanjutkan chat.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={handleSettingsClick}
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-4 flex items-center gap-3 hover:bg-white/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/20 group-hover:to-purple-500/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Settings size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">
              Pengaturan
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              Kelola preferensi aplikasi
            </p>
          </div>
          <ChevronRight size={16} className="text-purple-500" />
          </div>
        </button>

        <button
          onClick={handlePrivacyClick}
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-4 flex items-center gap-3 hover:bg-white/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/0 to-teal-500/0 group-hover:from-green-400/20 group-hover:to-teal-500/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">
              Privasi & Keamanan
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              Kontrol data dan keamanan
            </p>
          </div>
          <ChevronRight size={16} className="text-teal-500" />
          </div>
        </button>

        <button
          onClick={handleNotificationClick}
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-4 flex items-center gap-3 hover:bg-white/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/0 to-orange-500/0 group-hover:from-yellow-400/20 group-hover:to-orange-500/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <Bell size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">
              Notifikasi
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              Atur pemberitahuan
            </p>
          </div>
          <ChevronRight size={16} className="text-orange-500" />
          </div>
        </button>

        {/* Analytics Dashboard - Only for admin/demo users */}


        <button
          onClick={handleHelpClick}
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-4 flex items-center gap-3 hover:bg-white/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400/0 to-red-500/0 group-hover:from-pink-400/20 group-hover:to-red-500/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <HelpCircle size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">
              Bantuan & Dukungan
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              FAQ dan kontak support
            </p>
          </div>
          <ChevronRight size={16} className="text-red-500" />
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white/90 backdrop-blur-sm rounded-2xl border border-red-200/50 p-4 flex items-center gap-3 hover:bg-red-50/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400/0 to-pink-500/0 group-hover:from-red-400/20 group-hover:to-pink-500/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <LogOut size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-red-600">Keluar</h3>
            <p className="text-sm text-red-500 font-medium">Keluar dari akun Anda</p>
          </div>
          </div>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="relative z-10 flex items-center justify-around p-4 border-t border-white/20 bg-white/90 backdrop-blur-md shadow-2xl">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
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
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
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
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
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
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
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
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-110 relative group"
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