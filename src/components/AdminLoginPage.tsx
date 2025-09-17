import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { adminAuth } from '../services/adminAuth';

interface AdminLoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginPage({ onBack, onLoginSuccess }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if current user is authorized for admin access
      const currentUser = localStorage.getItem('mikasa_user');
      if (!currentUser) {
        setError('Anda harus login terlebih dahulu');
        setIsLoading(false);
        return;
      }
      
      const userData = JSON.parse(currentUser);
      if (userData.email !== 'ryuumikasa@mikasa.ai') {
        setError('Akses admin tidak diizinkan untuk akun ini');
        setIsLoading(false);
        return;
      }
      
      const session = await adminAuth.loginAdmin(username, password);
      
      if (session) {
        onLoginSuccess();
      } else {
        setError('Username atau password salah');
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
            <Shield size={32} />
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Login</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Masuk sebagai administrator untuk mengelola sistem
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username Admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password Admin"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Memproses...' : 'Login Admin'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Area Terbatas</span>
            </div>
            <p className="text-xs text-yellow-700">
              Halaman ini hanya untuk administrator sistem. Akses tidak sah akan dicatat dan dilaporkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}