import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User } from 'lucide-react';

interface UsernamePasswordLoginProps {
  onBack: () => void;
  onLogin: (username: string, password: string) => void;
  isLoading: boolean;
}

export default function UsernamePasswordLogin({ onBack, onLogin, isLoading }: UsernamePasswordLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = () => {
    // Reset errors
    setUsernameError('');
    setPasswordError('');

    // Validation
    if (!username.trim()) {
      setUsernameError('Masukkan username');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Masukkan password');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password minimal 6 karakter');
      return;
    }

    // Call onLogin with username and password
    onLogin(username, password);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl mb-4">
            👤
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-normal text-gray-900 mb-2 text-center">Masuk ke Akun</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Masukkan username dan password Anda untuk melanjutkan
          </p>

          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameError('');
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Username"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                usernameError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-2">{usernameError}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-4"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <button 
                onClick={onBack}
                className="text-blue-600 hover:underline font-medium"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}