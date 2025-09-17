import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, User, Mail } from 'lucide-react';

interface RegisterFormProps {
  onBack: () => void;
  onRegister: (name: string, email: string, username: string, password: string, whatsapp: string) => void;
  isLoading: boolean;
}

export default function RegisterForm({ onBack, onRegister, isLoading }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    // Reset errors
    setErrors({});
    const newErrors: {[key: string]: string} = {};

    // Validation
    if (!name.trim()) {
      newErrors.name = 'Masukkan nama lengkap';
    }

    if (!email.trim()) {
      newErrors.email = 'Masukkan email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Masukkan nomor WhatsApp';
    } else if (whatsapp.length < 10) {
      newErrors.whatsapp = 'Nomor WhatsApp minimal 10 digit';
    }

    if (!username.trim()) {
      newErrors.username = 'Masukkan username';
    } else if (username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!password.trim()) {
      newErrors.password = 'Masukkan password';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Konfirmasi password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onRegister(name, email, username, password, whatsapp);
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl mb-4">
            👤
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-normal text-gray-900 mb-2 text-center">Daftar Akun Baru</h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Buat akun untuk mengakses semua fitur Mikasa AI
          </p>

          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({...errors, name: ''});
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Nama Lengkap"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: ''});
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => {
                setWhatsapp(e.target.value);
                if (errors.whatsapp) setErrors({...errors, whatsapp: ''});
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Nomor WhatsApp (contoh: 08123456789)"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({...errors, username: ''});
              }}
              onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Username"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-2">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                }}
                onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                placeholder="Konfirmasi Password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium mb-4"
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button 
                onClick={onBack}
                className="text-blue-600 hover:underline font-medium"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}