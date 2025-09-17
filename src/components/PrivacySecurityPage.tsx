import React, { useState } from 'react';
import { ArrowLeft, Shield, MessageSquare, Crown, Trash2, Download, Eye, EyeOff, Lock, Key, Smartphone, Globe, AlertTriangle } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useChat } from '../hooks/useChat';
import { NavigationTab } from '../types/navigation';

interface PrivacySecurityPageProps {
  onBack: () => void;
  onNavigateToSubscription?: () => void;
}

export default function PrivacySecurityPage({ onBack, onNavigateToSubscription }: PrivacySecurityPageProps) {
  const { user } = useGoogleAuth();
  const { clearChat, getUsageStats } = useChat();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [dataVisibility, setDataVisibility] = useState({
    profile: true,
    chatHistory: false,
    usage: true
  });

  const usageStats = getUsageStats();

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

  const handleClearChatHistory = () => {
    if (showClearConfirm) {
      setIsClearing(true);
      clearChat();
      setShowClearConfirm(false);
      
      setTimeout(() => {
        setIsClearing(false);
        showSuccessNotification('Riwayat chat berhasil dihapus');
      }, 1000);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleExportData = () => {
    setIsExporting(true);
    
    const userData = {
      profile: {
        name: user?.name,
        email: user?.email,
        accountType: user?.isDemo ? 'Demo' : 'Regular',
        username: user?.username,
        whatsapp: user?.whatsapp
      },
      usage: {
        messagesUsed: usageStats.messagesUsed,
        messagesLimit: usageStats.messagesLimit,
        exportDate: new Date().toISOString()
      },
      settings: {
        theme: localStorage.getItem('mikasa_theme') || 'light',
        language: localStorage.getItem('mikasa_language') || 'id',
        fontSize: localStorage.getItem('mikasa_fontSize') || 'medium'
      }
    };

    setTimeout(() => {
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mikasa-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
      showSuccessNotification('Data berhasil diexport');
    }, 1500);
  };

  const handleUpgradeToPremium = () => {
    if (user?.isDemo) {
      alert('Akun demo tidak dapat upgrade ke Premium. Silakan daftar akun reguler terlebih dahulu.');
      return;
    }
    
    if (onNavigateToSubscription) {
      onNavigateToSubscription();
    } else {
      // Fallback navigation
      window.dispatchEvent(new CustomEvent('navigateToSubscription'));
    }
  };

  const privacySettings = [
    {
      id: 'profile',
      title: 'Visibilitas Profil',
      description: 'Kontrol siapa yang dapat melihat informasi profil Anda',
      icon: <Eye size={20} />,
      enabled: dataVisibility.profile
    },
    {
      id: 'chatHistory',
      title: 'Riwayat Chat Pribadi',
      description: 'Sembunyikan riwayat chat dari analitik',
      icon: <MessageSquare size={20} />,
      enabled: dataVisibility.chatHistory
    },
    {
      id: 'usage',
      title: 'Statistik Penggunaan',
      description: 'Tampilkan statistik penggunaan aplikasi',
      icon: <Crown size={20} />,
      enabled: dataVisibility.usage
    }
  ];

  const securityFeatures = [
    {
      title: 'Enkripsi End-to-End',
      description: 'Pesan Anda dienkripsi dengan standar industri',
      icon: <Lock size={20} />,
      status: 'Aktif',
      color: 'text-green-600'
    },
    {
      title: 'Autentikasi Dua Faktor',
      description: 'Keamanan tambahan untuk akun Anda',
      icon: <Key size={20} />,
      status: user?.isDemo ? 'Tidak Tersedia' : 'Tidak Aktif',
      color: user?.isDemo ? 'text-gray-500' : 'text-yellow-600'
    },
    {
      title: 'Verifikasi Perangkat',
      description: 'Pantau perangkat yang mengakses akun',
      icon: <Smartphone size={20} />,
      status: 'Aktif',
      color: 'text-green-600'
    },
    {
      title: 'Perlindungan IP',
      description: 'Deteksi akses dari lokasi mencurigakan',
      icon: <Globe size={20} />,
      status: 'Aktif',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <Shield className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">Privasi & Keamanan</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Account Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="text-yellow-500" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Status Langganan</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  {user?.isDemo ? 'Akun Demo' : 'Paket Gratis'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user?.isDemo ? 'Akses terbatas 24 jam' : 'Akses dasar dengan batasan'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user?.isDemo 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.isDemo ? 'Demo' : 'Gratis'}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Pesan Hari Ini</p>
                <p className="text-lg font-semibold text-gray-900">
                  {usageStats.messagesUsed}/{usageStats.messagesLimit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${
                  usageStats.canSend ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usageStats.canSend ? 'Aktif' : 'Terbatas'}
                </p>
              </div>
            </div>
            
            {!user?.isDemo && (
              <button 
                onClick={handleUpgradeToPremium}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Upgrade ke Premium
              </button>
            )}
            
            {user?.isDemo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700 text-center">
                  ⚠️ Akun demo tidak dapat upgrade. Daftar akun reguler untuk akses penuh.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat History Management */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Chat</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Total Percakapan</h3>
                <p className="text-sm text-gray-600">Semua riwayat chat tersimpan</p>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {usageStats.messagesUsed}
              </span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                {isExporting ? 'Mengexport...' : 'Export Data'}
              </button>
              
              <button
                onClick={handleClearChatHistory}
                disabled={isClearing}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  showClearConfirm 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Trash2 size={16} />
                {isClearing ? 'Menghapus...' : showClearConfirm ? 'Konfirmasi Hapus' : 'Hapus Riwayat'}
              </button>
            </div>
            
            {showClearConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-800">Peringatan</span>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Tindakan ini akan menghapus semua riwayat chat secara permanen dan tidak dapat dibatalkan.
                </p>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-purple-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Pengaturan Privasi</h2>
          </div>
          
          <div className="space-y-3">
            {privacySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    {setting.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{setting.title}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDataVisibility(prev => ({
                    ...prev,
                    [setting.id]: !prev[setting.id as keyof typeof prev]
                  }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  disabled={user?.isDemo && setting.id === 'chatHistory'}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
            
            {user?.isDemo && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  💡 Beberapa pengaturan privasi terbatas pada akun demo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Fitur Keamanan</h2>
          </div>
          
          <div className="space-y-3">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${feature.color}`}>
                  {feature.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Account Limitations */}
        {user?.isDemo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-yellow-600" size={20} />
              <h2 className="text-lg font-semibold text-yellow-800">Pembatasan Akun Demo</h2>
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• Tidak dapat mengaktifkan autentikasi dua faktor</p>
              <p>• Riwayat chat terbatas selama masa demo</p>
              <p>• Beberapa fitur keamanan tidak tersedia</p>
              <p>• Data akan dihapus setelah masa demo berakhir</p>
              <p>• Tidak dapat upgrade ke paket premium</p>
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-300">
              <p className="text-sm font-medium text-yellow-800">
                💡 Daftar akun reguler untuk mengakses semua fitur keamanan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}