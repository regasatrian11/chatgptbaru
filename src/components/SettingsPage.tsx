import React, { useState } from 'react';
import { ArrowLeft, Settings, Moon, Sun, Globe, Volume2, VolumeX, Smartphone, Monitor, Bell, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useTranslation } from '../hooks/useTranslation';
import { useEffect } from 'react';

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const { user } = useGoogleAuth();
  const { t, currentLanguage, setLanguage } = useTranslation();
  const [settings, setSettings] = useState({
    theme: 'light',
    language: currentLanguage,
    notifications: true,
    sound: true,
    autoSave: true,
    readReceipts: true,
    onlineStatus: true,
    fontSize: 'medium'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Apply theme changes immediately
    if (key === 'theme') {
      applyTheme(value);
    }
    
    // Apply font size changes immediately
    if (key === 'fontSize') {
      applyFontSize(value);
    }
    
    // Apply language changes immediately
    if (key === 'language') {
      setLanguage(value);
      showNotification(t('languageChanged') + ' ' + getLanguageName(value));
    }
    
    // Show success notification
    if (key !== 'language') {
      showNotification(t('settingsSaved'));
    }
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  const getLanguageName = (langCode: string) => {
    const names = {
      id: 'Bahasa Indonesia',
      en: 'English',
      ms: 'Bahasa Melayu'
    };
    return names[langCode as keyof typeof names] || langCode;
  };

  const applyTheme = (theme: string) => {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      localStorage.setItem('mikasa_theme', 'dark');
    } else if (theme === 'light') {
      html.classList.remove('dark');
      localStorage.setItem('mikasa_theme', 'light');
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('mikasa_theme', 'auto');
    }
    
    // Force a re-render by triggering a small DOM change
    setTimeout(() => {
      const body = document.body;
      body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 10);
  };

  const applyFontSize = (fontSize: string) => {
    const html = document.documentElement;
    
    // Remove existing font size classes
    html.classList.remove('font-small', 'font-medium', 'font-large');
    
    // Apply new font size class
    html.classList.add(`font-${fontSize}`);
    
    // Save to localStorage
    localStorage.setItem('mikasa_fontSize', fontSize);
  };

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mikasa_theme') || 'light';
    const savedFontSize = localStorage.getItem('mikasa_fontSize') || 'medium';
    
    setSettings(prev => ({ 
      ...prev, 
      theme: savedTheme,
      fontSize: savedFontSize
    }));
    
    applyTheme(savedTheme);
    applyFontSize(savedFontSize);
  }, []);

  const settingsGroups = [
    {
      title: t('appearance'),
      icon: <Monitor size={20} />,
      settings: [
        {
          id: 'theme',
          title: t('theme'),
          description: currentLanguage === 'id' ? 'Pilih tema aplikasi' : currentLanguage === 'en' ? 'Choose app theme' : 'Pilih tema aplikasi',
          type: 'select',
          options: [
            { value: 'light', label: t('light'), icon: <Sun size={16} /> },
            { value: 'dark', label: t('dark'), icon: <Moon size={16} /> },
            { value: 'auto', label: t('auto'), icon: <Smartphone size={16} /> }
          ],
          value: settings.theme
        },
        {
          id: 'fontSize',
          title: t('fontSize'),
          description: currentLanguage === 'id' ? 'Atur ukuran teks dalam aplikasi' : currentLanguage === 'en' ? 'Set text size in app' : 'Atur ukuran teks dalam aplikasi',
          type: 'select',
          options: [
            { value: 'small', label: t('small') },
            { value: 'medium', label: t('medium') },
            { value: 'large', label: t('large') }
          ],
          value: settings.fontSize
        }
      ]
    },
    {
      title: t('languageRegion'),
      icon: <Globe size={20} />,
      settings: [
        {
          id: 'language',
          title: t('language'),
          description: currentLanguage === 'id' ? 'Pilih bahasa aplikasi' : currentLanguage === 'en' ? 'Choose app language' : 'Pilih bahasa aplikasi',
          type: 'select',
          options: [
            { value: 'id', label: t('indonesian') },
            { value: 'en', label: 'English' },
            { value: 'ms', label: t('malay') }
          ],
          value: settings.language
        }
      ]
    },
    {
      title: t('notifications_settings'),
      icon: <Bell size={20} />,
      settings: [
        {
          id: 'notifications',
          title: currentLanguage === 'id' ? 'Notifikasi Push' : currentLanguage === 'en' ? 'Push Notifications' : 'Notifikasi Push',
          description: currentLanguage === 'id' ? 'Terima notifikasi untuk pesan baru' : currentLanguage === 'en' ? 'Receive notifications for new messages' : 'Terima notifikasi untuk pesan baru',
          type: 'toggle',
          value: settings.notifications
        },
        {
          id: 'sound',
          title: currentLanguage === 'id' ? 'Suara Notifikasi' : currentLanguage === 'en' ? 'Notification Sound' : 'Suara Notifikasi',
          description: currentLanguage === 'id' ? 'Putar suara saat ada notifikasi' : currentLanguage === 'en' ? 'Play sound when notifications arrive' : 'Putar suara saat ada notifikasi',
          type: 'toggle',
          value: settings.sound
        }
      ]
    },
    {
      title: t('chat_settings'),
      icon: <MessageSquare size={20} />,
      settings: [
        {
          id: 'autoSave',
          title: currentLanguage === 'id' ? 'Simpan Otomatis' : currentLanguage === 'en' ? 'Auto Save' : 'Simpan Otomatis',
          description: currentLanguage === 'id' ? 'Simpan riwayat chat secara otomatis' : currentLanguage === 'en' ? 'Automatically save chat history' : 'Simpan riwayat chat secara otomatis',
          type: 'toggle',
          value: settings.autoSave
        },
        {
          id: 'readReceipts',
          title: currentLanguage === 'id' ? 'Tanda Baca' : currentLanguage === 'en' ? 'Read Receipts' : 'Tanda Baca',
          description: currentLanguage === 'id' ? 'Tampilkan status pesan telah dibaca' : currentLanguage === 'en' ? 'Show message read status' : 'Tampilkan status pesan telah dibaca',
          type: 'toggle',
          value: settings.readReceipts
        }
      ]
    },
    {
      title: t('privacy'),
      icon: <Eye size={20} />,
      settings: [
        {
          id: 'onlineStatus',
          title: currentLanguage === 'id' ? 'Status Online' : currentLanguage === 'en' ? 'Online Status' : 'Status Online',
          description: currentLanguage === 'id' ? 'Tampilkan status online kepada pengguna lain' : currentLanguage === 'en' ? 'Show online status to other users' : 'Tampilkan status online kepada pengguna lain',
          type: 'toggle',
          value: settings.onlineStatus
        }
      ]
    }
  ];

  const renderSetting = (setting: any) => {
    if (setting.type === 'toggle') {
      return (
        <button
          onClick={() => handleSettingChange(setting.id, !setting.value)}
          className={`w-12 h-6 rounded-full transition-colors ${
            setting.value ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
            setting.value ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </button>
      );
    }

    if (setting.type === 'select') {
      return (
        <select
          value={setting.value}
          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
        >
          {setting.options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return null;
  };

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
          <Settings className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">{t('settings')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white">
              {user?.avatar || '👤'}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{user?.name || 'Demo User'}</h3>
              <p className="text-sm text-gray-600">{user?.email || 'demo@mikasa.ai'}</p>
            </div>
          </div>
          {user?.isDemo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ {currentLanguage === 'id' ? 'Beberapa pengaturan mungkin terbatas pada akun demo' : currentLanguage === 'en' ? 'Some settings may be limited on demo account' : 'Beberapa pengaturan mungkin terbatas pada akun demo'}
              </p>
            </div>
          )}
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-gray-600">
                {group.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
            </div>
            
            <div className="space-y-4">
              {group.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{setting.title}</h3>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {renderSetting(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Reset Settings */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentLanguage === 'id' ? 'Reset' : currentLanguage === 'en' ? 'Reset' : 'Reset'}</h2>
          <button
            onClick={() => {
              const confirmMessage = currentLanguage === 'id' ? 'Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?' : currentLanguage === 'en' ? 'Are you sure you want to reset all settings to default?' : 'Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?';
              if (confirm(confirmMessage)) {
               // Reset all settings to default
               const defaultSettings = {
                 theme: 'light',
                 language: 'id',
                 notifications: true,
                 sound: true,
                 autoSave: true,
                 readReceipts: true,
                 onlineStatus: true,
                 fontSize: 'medium'
               };
               
                setSettings({
                 ...defaultSettings
                });
                
               // Apply theme reset
               applyTheme('light');
               
               // Apply font size reset
               applyFontSize('medium');
               
               // Apply language reset
               setLanguage('id');
               
               // Clear localStorage settings
               localStorage.setItem('mikasa_theme', 'light');
               localStorage.setItem('mikasa_fontSize', 'medium');
               localStorage.setItem('mikasa_language', 'id');
               
                const resetMessage = currentLanguage === 'id' ? 'Pengaturan berhasil direset ke default' : currentLanguage === 'en' ? 'Settings successfully reset to default' : 'Pengaturan berhasil direset ke default';
                showNotification(resetMessage);
              }
            }}
            className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            {currentLanguage === 'id' ? 'Reset ke Pengaturan Default' : currentLanguage === 'en' ? 'Reset to Default Settings' : 'Reset ke Pengaturan Default'}
          </button>
        </div>
      </div>
    </div>
  );
}