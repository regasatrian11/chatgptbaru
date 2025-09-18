import React, { useState, useEffect } from 'react';
import { User, UserPlus, Info, Mail } from 'lucide-react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

interface LandingPageProps {
  onGetStarted: () => void;
  onDemoLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage({ onGetStarted, onDemoLogin, onRegister }: LandingPageProps) {
  const { signInWithGoogle, isLoading } = useGoogleAuth();
  const [demoError, setDemoError] = useState<string>('');
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  // Generate confetti particles
  useEffect(() => {
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3
    }));
    setConfetti(particles);
  }, []);

  const handleDemoLogin = async () => {
    console.log('🔄 Demo login clicked');
    setDemoError('');
    try {
      const demoUser = {
        id: 'demo_user_' + Date.now(),
        name: 'Demo User',
        email: 'demo@mikasa.ai',
        avatar: '👤',
        isDemo: true
      };
      
      localStorage.setItem('mikasa_user', JSON.stringify(demoUser));
      
      const { userAnalytics } = await import('../services/userAnalytics');
      userAnalytics.trackUserLogin(demoUser.id, demoUser.email, 'demo');
      
      onDemoLogin();
    } catch (error) {
      console.error('Demo login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login demo gagal. Silakan coba lagi.';
      setDemoError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Futuristic City Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-blue-900/60 to-transparent"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Neon Grid Lines */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse delay-500"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating Confetti */}
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8">
        {/* Character Avatars */}
        <div className="absolute top-20 left-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl animate-bounce delay-300 shadow-lg border-2 border-white/30">
          👧🏻
        </div>
        <div className="absolute top-32 right-12 w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xl animate-bounce delay-700 shadow-lg border-2 border-white/30">
          👦🏻
        </div>
        <div className="absolute bottom-40 left-12 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-lg animate-bounce delay-1000 shadow-lg border-2 border-white/30">
          👩🏻
        </div>
        <div className="absolute bottom-32 right-16 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xl animate-bounce delay-500 shadow-lg border-2 border-white/30">
          👨🏻
        </div>

        {/* Speech Bubbles */}
        <div className="absolute top-16 left-24 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg animate-pulse delay-300">
          <span className="text-sm font-medium text-gray-800">Halo!</span>
          <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
        </div>
        <div className="absolute bottom-36 right-24 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg animate-pulse delay-1000">
          <span className="text-sm font-medium text-gray-800">Halo!</span>
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/90"></div>
        </div>

        {/* Main Character */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 rounded-full mb-6 shadow-2xl relative overflow-hidden border-4 border-white/30">
            <img 
              src="/dddddddddddd.jpg"
              alt="Mikasa AI"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full"></div>
            
            {/* Glowing Ring Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-75 blur-lg animate-spin-slow"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-50 blur-md animate-pulse"></div>
          </div>
          
          {/* Character Speech Bubble */}
          <div className="absolute -top-4 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl animate-bounce">
            <span className="text-lg font-bold text-gray-800">Halo!</span>
            <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
            Selamat Datang
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-2xl">
            di Mikasa AI
          </h2>
          <p className="text-white/90 text-lg leading-relaxed max-w-sm drop-shadow-lg">
            Masuk untuk melanjutkan atau coba mode demo
          </p>
        </div>

        {/* Neon Button Container */}
        <div className="w-full max-w-sm space-y-4 relative">
          {/* Glowing Container */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl opacity-30 blur-xl animate-pulse"></div>
          
          <div className="relative bg-black/20 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            {/* Login dengan Email Button */}
            <button
              onClick={onGetStarted}
              className="w-full mb-4 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-2xl py-4 px-6 font-bold text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-3">
                  <User size={24} />
                  <span>Login dengan Email</span>
                </div>
              </div>
            </button>

            {/* Daftar Akun Baru Button */}
            <button
              onClick={onRegister}
              className="w-full mb-4 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl py-4 px-6 font-bold text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center gap-3">
                  <UserPlus size={24} />
                  <span>Daftar Akun Baru</span>
                </div>
              </div>
            </button>

            {/* Coba Demo Gratis Button */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl py-4 px-6 font-bold text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300 disabled:opacity-50">
                <div className="flex items-center justify-center gap-3">
                  <Info size={24} />
                  <span>{isLoading ? 'Memproses...' : 'Coba Demo Gratis'}</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Demo Error Message */}
        {demoError && (
          <div className="w-full max-w-sm mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl">
            <p className="text-red-200 text-sm text-center font-medium">{demoError}</p>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm mb-4 font-medium drop-shadow-lg">Fitur Unggulan:</p>
          <div className="flex justify-center gap-8 text-xs text-white/70">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 shadow-lg">
                💬
              </div>
              <span className="font-medium drop-shadow">Chat AI</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400/30 to-teal-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 shadow-lg">
                🚀
              </div>
              <span className="font-medium drop-shadow">Cepat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-2 border border-white/20 shadow-lg">
                🔒
              </div>
              <span className="font-medium drop-shadow">Aman</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs leading-relaxed max-w-xs drop-shadow">
            Dengan menggunakan aplikasi ini, Anda menyetujui syarat dan ketentuan kami
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.6);
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}