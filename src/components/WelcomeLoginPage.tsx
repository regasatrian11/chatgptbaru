import React, { useState } from 'react';
import { User, UserPlus, Info } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { DemoAuthService } from '../services/demoAuth';
import { userAnalytics } from '../services/userAnalytics';
import GoogleLoginPage from './GoogleLoginPage';
import UsernamePasswordLogin from './UsernamePasswordLogin';
import RegisterForm from './RegisterForm';
import SupabaseLoginForm from './SupabaseLoginForm';

interface WelcomeLoginPageProps {
  onLoginSuccess: () => void;
}

export default function WelcomeLoginPage({ onLoginSuccess }: WelcomeLoginPageProps) {
  const [currentView, setCurrentView] = useState<'welcome' | 'google' | 'username' | 'register' | 'supabase'>('welcome');
  const { isLoading } = useGoogleAuth();

  const handleDemoLogin = async () => {
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
      
      onLoginSuccess();
    } catch (error) {
      console.error('Demo login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login demo gagal. Silakan coba lagi.';
      alert(errorMessage);
    }
  };

  const handleUsernameLogin = () => {
    console.log('🔄 Navigating to Supabase login...');
    setCurrentView('supabase');
  };

  const handleRegister = () => {
    console.log('🔄 Navigating to register form...');
    setCurrentView('register');
  };

  const handleBack = () => {
    console.log('🔄 Going back to welcome...');
    setCurrentView('welcome');
  };

  if (currentView === 'supabase') {
    console.log('🔄 Rendering Supabase login form...');
    return (
      <SupabaseLoginForm
        onBack={handleBack}
        onSuccess={onLoginSuccess}
      />
    );
  }

  if (currentView === 'register') {
    console.log('🔄 Rendering register form...');
    return (
      <SupabaseLoginForm
        onBack={handleBack}
        onSuccess={onLoginSuccess}
        defaultMode="signup"
      />
    );
  }
  console.log('🔄 Rendering welcome page...');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg">
          <User size={40} />
        </div>
      </div>

      {/* Welcome Text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Selamat Datang!</h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm">
          Masuk untuk mengakses profil Anda dan menikmati fitur lengkap Mikasa AI
        </p>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-sm space-y-4">
        {/* Username/Password Login */}
        <button
          onClick={handleUsernameLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
        >
          <User size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700">Masuk dengan Username dan Password</span>
        </button>

        {/* Register */}
        <button
          onClick={handleRegister}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-green-500 text-white rounded-xl py-4 px-6 hover:bg-green-600 transition-all duration-200 shadow-sm font-medium"
        >
          <UserPlus size={20} />
          <span>Daftar Pengguna Baru</span>
        </button>

        {/* Demo Login */}
        <button
          onClick={handleDemoLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white rounded-xl py-4 px-6 hover:bg-blue-600 transition-all duration-200 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info size={20} />
          <span>{isLoading ? 'Memproses...' : 'Login dengan Demo'}</span>
        </button>
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          Dengan masuk, Anda menyetujui syarat dan ketentuan kami
        </p>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <button 
            onClick={handleRegister}
            type="button"
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            Daftar di sini
          </button>
        </p>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-yellow-700">
            💡 <strong>Tips:</strong> Pengguna baru dapat mendaftar dengan mudah menggunakan email dan password.
          </p>
        </div>
      </div>
    </div>
  );
}