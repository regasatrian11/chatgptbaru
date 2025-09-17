import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { tripayService, TripayPaymentResponse } from '../services/tripay';

interface TripayPaymentProps {
  planId: string;
  planName: string;
  planPrice: number;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TripayPayment({
  planId,
  planName,
  planPrice,
  paymentMethod,
  customerName,
  customerEmail,
  onClose,
  onSuccess
}: TripayPaymentProps) {
  const [paymentData, setPaymentData] = useState<TripayPaymentResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID' | 'EXPIRED'>('UNPAID');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    createPayment();
  }, []);

  useEffect(() => {
    if (paymentData && paymentStatus === 'UNPAID') {
      // Check payment status every 30 seconds
      const statusInterval = setInterval(checkStatus, 30000);
      
      // Update countdown timer
      const timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = paymentData.expired_time - now;
        
        if (remaining <= 0) {
          setPaymentStatus('EXPIRED');
          clearInterval(statusInterval);
          clearInterval(timerInterval);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => {
        clearInterval(statusInterval);
        clearInterval(timerInterval);
      };
    }
  }, [paymentData, paymentStatus]);

  const createPayment = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Validate user is logged in and not demo
      if (!customerEmail || customerEmail === 'demo@mikasa.ai') {
        setError('Akun demo tidak dapat melakukan pembayaran. Silakan daftar akun reguler.');
        return;
      }

      const merchantRef = `MIKASA_${planId}_${Date.now()}`;
      
      const response = await tripayService.createPayment({
        method: paymentMethod,
        merchant_ref: merchantRef,
        amount: planPrice,
        customer_name: customerName,
        customer_email: customerEmail,
        order_items: [
          {
            name: `Mikasa AI ${planName} - 1 Bulan`,
            price: planPrice,
            quantity: 1
          }
        ],
        expired_time: 24 * 60 * 60 // 24 hours
      });

      if (response.success && response.data) {
        setPaymentData(response.data);
        setPaymentStatus(response.data.status as any);
        setTimeLeft(response.data.expired_time - Date.now());
      } else {
        setError(response.message || 'Gagal membuat pembayaran');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat membuat pembayaran');
      console.error('Payment creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!paymentData) return;

    try {
      const response = await tripayService.checkPaymentStatus(paymentData.reference);
      
      if (response.success && response.data) {
        setPaymentStatus(response.data.status as any);
        
        if (response.data.status === 'PAID') {
          onSuccess();
        }
      }
    } catch (err) {
      console.error('Status check error:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    notification.textContent = 'Berhasil disalin!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'PAID':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'EXPIRED':
        return <AlertCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-yellow-500" size={24} />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'PAID':
        return 'Pembayaran Berhasil';
      case 'EXPIRED':
        return 'Pembayaran Kedaluwarsa';
      default:
        return 'Menunggu Pembayaran';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Membuat pembayaran...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={createPayment}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{getStatusText()}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Payment Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Paket</span>
            <span className="font-medium text-gray-900">{planName}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Metode</span>
            <span className="font-medium text-gray-900">{paymentData.payment_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-blue-600">
              Rp {paymentData.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Timer */}
        {paymentStatus === 'UNPAID' && timeLeft > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Batas Waktu</span>
            </div>
            <p className="text-lg font-mono font-bold text-yellow-800">
              {formatTime(timeLeft)}
            </p>
          </div>
        )}

        {/* Payment Details */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {paymentMethod === 'BCAVA' ? 'Nomor Virtual Account' : 'Nomor Tujuan'}
            </label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="flex-1 font-mono text-lg font-bold text-gray-900">
                {paymentData.pay_code}
              </span>
              <button
                onClick={() => copyToClipboard(paymentData.pay_code)}
                className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* QR Code for e-wallets */}
          {paymentData.qr_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scan QR Code
              </label>
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                <img 
                  src={paymentData.qr_url} 
                  alt="QR Code" 
                  className="w-32 h-32"
                />
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {paymentData.instructions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Cara Pembayaran</h4>
            {paymentData.instructions.map((instruction, index) => (
              <div key={index} className="mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-2">{instruction.title}</h5>
                <ol className="text-xs text-gray-600 space-y-1">
                  {instruction.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* Status Messages */}
        {paymentStatus === 'PAID' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-medium text-green-800">Pembayaran Berhasil!</span>
            </div>
            <p className="text-sm text-green-700">
              Terima kasih! Akun Anda akan segera diupgrade ke {planName}.
            </p>
          </div>
        )}

        {paymentStatus === 'EXPIRED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-red-600" />
              <span className="font-medium text-red-800">Pembayaran Kedaluwarsa</span>
            </div>
            <p className="text-sm text-red-700">
              Batas waktu pembayaran telah habis. Silakan buat pembayaran baru.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {paymentStatus === 'EXPIRED' && (
            <button
              onClick={createPayment}
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Buat Pembayaran Baru
            </button>
          )}
          
          {paymentStatus === 'UNPAID' && (
            <button
              onClick={checkStatus}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Cek Status Pembayaran
            </button>
          )}
          
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {paymentStatus === 'PAID' ? 'Selesai' : 'Tutup'}
          </button>
        </div>

        {/* Reference */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Referensi: {paymentData.reference}
          </p>
        </div>
      </div>
    </div>
  );
}