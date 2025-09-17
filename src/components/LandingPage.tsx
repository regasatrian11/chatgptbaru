import React, { useState } from 'react';
import { User, UserPlus, Info } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { DemoAuthService } from '../services/demoAuth';

interface LandingPageProps {
  onGetStarted: () => void;
  onDemoLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onGetStarted, onDemoLogin, onRegister }: LandingPageProps) {
  const { signInWithGoogle, isLoading } = useGoogleAuth();
  const [demoError, setDemoError] = useState<string>('');

  const handleUsernameLogin = () => {
    console.log('🔄 Username login clicked');
    // Navigate to welcome page which has username login option
    onGetStarted();
  };

  const handleRegister = () => {
    console.log('🔄 Register clicked');
    onRegister();
  };

  const handleDemoLogin = async () => {
    console.log('🔄 Demo login clicked');
    setDemoError('');
    try {
      // Create demo user directly without Google auth
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
      
      onDemoLogin();
    } catch (error) {
      console.error('Demo login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login demo gagal. Silakan coba lagi.';
      setDemoError(errorMessage);
    }
  };

  const handleGetStarted = () => {
    console.log('🔄 Get started clicked - directing to Supabase login');
    onGetStarted();
  };
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
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Mikasa AI</h1>
        <p className="text-gray-600 text-base leading-relaxed max-w-sm">
          Asisten AI yang ramah dan membantu untuk semua kebutuhan Anda
        </p>
      </div>

      {/* Login Options */}
      <div className="w-full max-w-sm space-y-4">
        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white rounded-xl py-4 px-6 hover:bg-blue-600 transition-all duration-200 shadow-sm font-medium"
        >
          <User size={20} />
          <div className="text-center">
            <div className="font-semibold">Mulai Sekarang</div>
            <div className="text-xs opacity-90">Login dengan Email dan Password</div>
          </div>
        </button>

        {/* Register Button */}
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
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl py-4 px-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info size={20} className="text-gray-600" />
          <span className="text-gray-700">{isLoading ? 'Memproses...' : 'Coba Demo Gratis'}</span>
        </button>
        
        {/* Demo Error Message */}
        {demoError && (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm text-center">{demoError}</p>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan kami
        </p>
      </div>

      {/* Features Preview */}
      <div className="mt-6 text-center">
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
    </div>
  );
}