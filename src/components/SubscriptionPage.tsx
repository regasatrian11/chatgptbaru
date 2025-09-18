import React, { useState } from 'react';
import { Crown, Check, Star, Zap, MessageCircle, Search, Bell, User, CreditCard, Smartphone, Building2, X } from 'lucide-react';
import { SubscriptionPlan, NavigationTab } from '../types/navigation';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useSubscription } from '../hooks/useSubscription';
import TripayPayment from './TripayPayment';

interface SubscriptionPageProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export default function SubscriptionPage({ activeTab, onTabChange }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTripayPayment, setShowTripayPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  const { user, isLoggedIn, isInitialized, signInWithGoogle, signOut, isLoading } = useGoogleAuth();
  const { 
    subscription, 
    isPremium, 
    isPro, 
    isFree, 
    messagesUsed, 
    messagesLimit, 
    messagesRemaining,
    canSendMessage,
    createSubscription 
  } = useSubscription();
  
  // Show loading while checking auth status
  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
              👑
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👑
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 text-sm mb-6">
              Silakan login terlebih dahulu untuk melihat paket langganan
            </p>
            <button
              onClick={() => onTabChange('profile')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <MessageCircle size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Obrolan</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <Search size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Jelajahi</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed"
          >
            <Crown size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300">Langganan</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 opacity-50 cursor-not-allowed min-w-0"
          >
            <Bell size={20} className="text-gray-300" />
            <span className="text-xs text-gray-300 whitespace-nowrap">Pemberitahuan</span>
          </button>
          <button 
            onClick={() => onTabChange('profile')}
            className="flex flex-col items-center gap-1"
          >
            <User size={20} className={activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'} />
            <span className={`text-xs ${activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              Profil
            </span>
          </button>
        </div>
      </div>
    );
  }

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratis',
      price: 0,
      duration: 'selamanya',
      features: [
        '10 pesan per hari',
        'Akses ke model dasar',
        'Riwayat chat 7 hari',
        'Dukungan komunitas'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15000,
      duration: 'per bulan',
      features: [
        'Pesan tanpa batas',
        'Akses ke model terbaru',
        'Riwayat chat tanpa batas',
        'Prioritas respons',
        'Akses fitur beta',
        'Dukungan prioritas'
      ],
      isPopular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 45000,
      duration: 'per bulan',
      features: [
        'Semua fitur Premium',
        'API akses',
        'Custom model training',
        'Analytics dashboard',
        'White-label solution',
        'Dedicated support'
      ]
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') return;
    
    // Always require login for premium plans
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk berlangganan paket premium');
      onTabChange('profile');
      return;
    }
    
    // Check if user is demo account
    if (user?.isDemo) {
      alert('Akun demo tidak dapat berlangganan. Silakan daftar akun reguler terlebih dahulu.');
      onTabChange('profile');
      return;
    }
    
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await signInWithGoogle();
      setShowLoginModal(false);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login gagal. Silakan coba lagi.');
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Silakan pilih metode pembayaran');
      return;
    }
    
    setShowPaymentModal(false);
    setShowTripayPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowTripayPayment(false);
    setSelectedPaymentMethod('');
    
    // Create subscription in database
    const planType = selectedPlan === 'premium' ? 'premium' : 'pro';
    const paymentMethod = selectedPaymentMethod;
    const paymentReference = 'T' + Date.now(); // Mock reference
    
    createSubscription(planType, paymentMethod, paymentReference).then(success => {
      if (success) {
        alert('Pembayaran berhasil! Akun Anda telah diupgrade.');
      } else {
        alert('Pembayaran berhasil, tetapi terjadi kesalahan saat mengupdate akun. Silakan hubungi support.');
      }
    });
    
    setSelectedPlan('');
  };

  const paymentMethods = [
    { id: 'gopay', name: 'GoPay', icon: <Smartphone size={20} />, account: '089676399290' },
    { id: 'dana', name: 'DANA', icon: <Smartphone size={20} />, account: '089676399290' },
    { id: 'bank-transfer', name: 'Transfer Bank BCA', icon: <Building2 size={20} />, account: '7611263426' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Tripay Payment Modal */}
      {showTripayPayment && selectedPlan && (
        <TripayPayment
          planId={selectedPlan}
          planName={plans.find(p => p.id === selectedPlan)?.name || ''}
          planPrice={plans.find(p => p.id === selectedPlan)?.price || 0}
          paymentMethod={selectedPaymentMethod.toUpperCase()}
          customerName={user?.name || 'Demo User'}
          customerEmail={user?.email || 'demo@mikasa.ai'}
          onClose={() => setShowTripayPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Masuk ke Akun</h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-6">
              Masuk untuk melanjutkan berlangganan {plans.find(p => p.id === selectedPlan)?.name}
            </p>
            
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">
                {isLoading ? 'Memproses...' : 'Masuk dengan Google'}
              </span>
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Dengan masuk, Anda menyetujui syarat dan ketentuan kami
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pilih Metode Pembayaran</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {user?.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    Rp {plans.find(p => p.id === selectedPlan)?.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">per bulan</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.name)}
                  className={`w-full flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                    selectedPaymentMethod === method.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`${
                    selectedPaymentMethod === method.name ? 'text-blue-500' : 'text-gray-600'
                  }`}>
                    {method.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <span className={`font-medium block ${
                      selectedPaymentMethod === method.name ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {method.name}
                    </span>
                    {method.account && (
                      <span className="text-sm text-gray-600 block">
                        {method.account}
                      </span>
                    )}
                  </div>
                  {selectedPaymentMethod === method.name && (
                    <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Lanjutkan Pembayaran
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Pembayaran aman dan terenkripsi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <Crown className="text-yellow-500" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">Langganan</h1>
        </div>
        <p className="text-gray-600 text-sm mt-1">Tingkatkan pengalaman chat Anda</p>
      </div>

      {/* Current Status */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Status Saat Ini</h3>
            <p className="text-sm text-gray-600">
              {user?.isDemo ? 'Akun Demo' : 
               isPremium ? 'Premium' : 
               isPro ? 'Pro' : 'Paket Gratis'}
            </p>
            {user?.isDemo && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ Akun demo tidak dapat berlangganan
              </p>
            )}
            {subscription && subscription.end_date && (
              <p className="text-xs text-gray-500 mt-1">
                Berakhir: {new Date(subscription.end_date).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Pesan tersisa</p>
            <p className="font-semibold text-blue-600">
              {messagesLimit === -1 ? '∞' : messagesRemaining}
            </p>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ 
              width: messagesLimit === -1 ? '100%' : `${Math.min((messagesUsed / messagesLimit) * 100, 100)}%` 
            }}
          ></div>
        </div>
        {!canSendMessage && (
          <p className="text-xs text-red-600 mt-2">
            ⚠️ Batas harian tercapai! Upgrade untuk melanjutkan chat.
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border-2 p-4 ${
              plan.isPopular 
                ? 'border-blue-500 relative' 
                : 'border-gray-100'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star size={12} />
                Paling Populer
              </div>
            )}
            
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Gratis' : `Rp ${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <p className="text-sm text-gray-600">/{plan.duration}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                (plan.id === 'premium' && isPremium) || (plan.id === 'pro' && isPro)
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : plan.isPopular
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : plan.price === 0
                  ? 'bg-gray-100 text-gray-600 cursor-default'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              disabled={plan.price === 0 || (plan.id === 'premium' && isPremium) || (plan.id === 'pro' && isPro)}
            >
              {(plan.id === 'premium' && isPremium) || (plan.id === 'pro' && isPro)
                ? 'Paket Aktif'
                : plan.price === 0 
                ? 'Paket Aktif' 
                : !isLoggedIn 
                ? 'Login untuk Berlangganan'
                : user?.isDemo
                ? 'Daftar Akun Reguler'
                : 'Berlangganan Sekarang'
              }
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around p-4 border-t border-gray-100 bg-white">
        <button 
          onClick={() => onTabChange('chat')}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={20} className={activeTab === 'chat' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'chat' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Obrolan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('explore')}
          className="flex flex-col items-center gap-1"
        >
          <Search size={20} className={activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'explore' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Jelajahi
          </span>
        </button>
        <button 
          onClick={() => onTabChange('subscription')}
          className="flex flex-col items-center gap-1"
        >
          <Crown size={20} className={activeTab === 'subscription' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'subscription' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Langganan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="flex flex-col items-center gap-1"
        >
          <Bell size={20} className={activeTab === 'notifications' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'notifications' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Pemberitahuan
          </span>
        </button>
        <button 
          onClick={() => onTabChange('profile')}
          className="flex flex-col items-center gap-1"
        >
          <User size={20} className={activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs ${activeTab === 'profile' ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
            Profil
          </span>
        </button>
      </div>
    </div>
  );
}