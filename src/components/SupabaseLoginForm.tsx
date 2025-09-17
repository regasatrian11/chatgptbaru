import React, { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, User, Mail, Phone } from 'lucide-react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

interface SupabaseLoginFormProps {
  onBack: () => void
  onSuccess: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function SupabaseLoginForm({ onBack, onSuccess, defaultMode = 'signin' }: SupabaseLoginFormProps) {
  const { signIn, signUp, isLoading } = useSupabaseAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    whatsapp: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔄 Form submitted:', { mode, email: formData.email })
    setErrors({})
    
    // Validation
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    if (mode === 'signup') {
      if (!formData.full_name.trim()) {
        newErrors.full_name = 'Nama lengkap wajib diisi'
      }

      if (formData.whatsapp && formData.whatsapp.length < 10) {
        newErrors.whatsapp = 'Nomor WhatsApp minimal 10 digit'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      let result
      
      if (mode === 'signin') {
        console.log('🔄 Attempting signin with Supabase...')
        result = await signIn({
          email: formData.email,
          password: formData.password
        })
      } else {
        console.log('🔄 Attempting signup with Supabase...')
        result = await signUp({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          username: formData.username,
          whatsapp: formData.whatsapp
        })
      }

      console.log('🔄 Auth result:', result)
      
      if (result.success) {
        console.log('✅ Auth successful, calling onSuccess')
        onSuccess()
      } else {
        // Handle specific error cases
        let errorMessage = result.error || 'Terjadi kesalahan'
        if (typeof result.error === 'string' && result.error.includes('Email atau password salah')) {
          if (mode === 'signin') {
            errorMessage = 'Email atau password salah. Pastikan Anda sudah memiliki akun atau coba daftar terlebih dahulu.'
          }
        }
        // Handle invalid credentials more specifically
        if (typeof result.error === 'string' && result.error.includes('Invalid login credentials')) {
          if (mode === 'signin') {
            errorMessage = 'Email atau password tidak ditemukan. Silakan periksa kembali atau daftar akun baru jika belum memiliki akun.'
          }
        }
        // Handle database error during signup (likely username conflict)
        if (typeof result.error === 'string' && result.error.includes('Database error saving new user')) {
          if (mode === 'signup') {
            errorMessage = 'Email mungkin sudah digunakan atau ada masalah dengan data profil. Silakan coba email yang berbeda atau login jika sudah memiliki akun.'
          }
        }
        console.error('❌ Auth failed:', errorMessage)
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error('❌ Auth exception:', error)
      setErrors({ general: 'Terjadi kesalahan yang tidak terduga' })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

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
          <h1 className="text-2xl font-normal text-gray-900 mb-2 text-center">
            {mode === 'signin' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </h1>
          <p className="text-gray-600 text-sm mb-6 text-center">
            {mode === 'signin' 
              ? 'Masukkan email dan password Anda' 
              : 'Buat akun baru untuk mengakses semua fitur'
            }
          </p>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - Only for signup */}
            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Nama Lengkap"
                    required
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-2">{errors.full_name}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email"
                  required
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Username - Only for signup */}
            {mode === 'signup' && (
              <div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Username (opsional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* WhatsApp - Only for signup */}
            {mode === 'signup' && (
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="Nomor WhatsApp (opsional)"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-2">{errors.whatsapp}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
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
              {mode === 'signup' && (
                <p className="text-xs text-gray-500 mt-1">Password minimal 6 karakter</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Memproses...' : mode === 'signin' ? 'Masuk' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button 
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-600 hover:underline font-medium"
              >
                {mode === 'signin' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </p>
            
            {mode === 'signin' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Pengguna baru?</strong> Jika Anda belum memiliki akun, silakan daftar terlebih dahulu. 
                  Klik "Daftar di sini\" untuk membuat akun baru.
                </p>
              </div>
            )}
            
            {mode === 'signin' && errors.general && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700">
                  🔑 <strong>Lupa password atau belum punya akun?</strong> Pastikan email dan password benar, 
                  atau klik "Daftar di sini\" jika Anda belum memiliki akun.
                </p>
              </div>
            )}
            
            {mode === 'signup' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  ✅ <strong>Membuat akun baru?</strong> Isi semua data dengan benar. 
                  Username dan WhatsApp akan ditampilkan di profil Anda setelah login.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}