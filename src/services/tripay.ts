// Tripay Payment Gateway Integration
export interface TripayConfig {
  merchantCode: string;
  apiKey: string;
  privateKey: string;
  baseUrl: string;
}

export interface TripayPaymentRequest {
  method: string;
  merchant_ref: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_items: Array<{
    sku?: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  return_url?: string;
  expired_time?: number;
}

export interface TripayPaymentResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    merchant_ref: string;
    payment_selection_type: string;
    payment_method: string;
    payment_name: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    callback_url: string;
    return_url: string;
    amount: number;
    fee_merchant: number;
    fee_customer: number;
    total_fee: number;
    amount_received: number;
    pay_code: string;
    pay_url: string;
    checkout_url: string;
    status: string;
    expired_time: number;
    order_items: Array<{
      sku: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    instructions: Array<{
      title: string;
      steps: string[];
    }>;
    qr_code?: string;
    qr_url?: string;
  };
  errors?: any;
}

export class TripayService {
  private config: TripayConfig;

  constructor(config: TripayConfig) {
    this.config = config;
  }

  private generateSignature(data: string): string {
    // In a real implementation, you would use crypto to generate HMAC-SHA256
    // For demo purposes, we'll return a mock signature
    return 'mock_signature_' + Date.now();
  }

  async createPayment(paymentData: TripayPaymentRequest): Promise<TripayPaymentResponse> {
    try {
      // For demo purposes, we'll simulate a successful Tripay response
      // In production, you would make actual API calls to Tripay
      
      const mockResponse: TripayPaymentResponse = {
        success: true,
        message: 'Transaction created successfully',
        data: {
          reference: 'T' + Date.now(),
          merchant_ref: paymentData.merchant_ref,
          payment_selection_type: 'static',
          payment_method: paymentData.method.toUpperCase(),
          payment_name: this.getPaymentName(paymentData.method),
          customer_name: paymentData.customer_name,
          customer_email: paymentData.customer_email,
          customer_phone: paymentData.customer_phone || '',
          callback_url: '',
          return_url: paymentData.return_url || '',
          amount: paymentData.amount,
          fee_merchant: 0,
          fee_customer: Math.floor(paymentData.amount * 0.007), // 0.7% fee
          total_fee: Math.floor(paymentData.amount * 0.007),
          amount_received: paymentData.amount - Math.floor(paymentData.amount * 0.007),
          pay_code: this.generatePayCode(paymentData.method),
          pay_url: `https://tripay.co.id/checkout/${Date.now()}`,
          checkout_url: `https://tripay.co.id/checkout/${Date.now()}`,
          status: 'UNPAID',
          expired_time: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          order_items: paymentData.order_items,
          instructions: this.getPaymentInstructions(paymentData.method),
          qr_code: paymentData.method === 'GOPAY' ? `data:image/png;base64,mock_qr_code` : undefined,
          qr_url: paymentData.method === 'GOPAY' ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=mock_payment_${Date.now()}` : undefined
        }
      };

      return mockResponse;
    } catch (error) {
      console.error('Tripay payment creation failed:', error);
      return {
        success: false,
        message: 'Failed to create payment',
        errors: error
      };
    }
  }

  private getPaymentName(method: string): string {
    const names: { [key: string]: string } = {
      'GOPAY': 'GoPay',
      'DANA': 'DANA',
      'BCAVA': 'BCA Virtual Account'
    };
    return names[method.toUpperCase()] || method;
  }

  private generatePayCode(method: string): string {
    const timestamp = Date.now().toString();
    switch (method.toUpperCase()) {
      case 'GOPAY':
      case 'DANA':
        return '089676399290'; // Phone number for e-wallet
      case 'BCAVA':
        return '7611263426' + timestamp.slice(-4); // VA number
      default:
        return timestamp;
    }
  }

  private getPaymentInstructions(method: string): Array<{ title: string; steps: string[] }> {
    switch (method.toUpperCase()) {
      case 'GOPAY':
        return [
          {
            title: 'Cara Pembayaran GoPay',
            steps: [
              'Buka aplikasi Gojek atau GoPay',
              'Pilih menu "Bayar" atau "Pay"',
              'Scan QR Code atau masukkan nomor: 089676399290',
              'Masukkan jumlah pembayaran sesuai tagihan',
              'Konfirmasi pembayaran dengan PIN GoPay Anda',
              'Simpan bukti pembayaran'
            ]
          }
        ];
      case 'DANA':
        return [
          {
            title: 'Cara Pembayaran DANA',
            steps: [
              'Buka aplikasi DANA',
              'Pilih menu "Kirim" atau "Transfer"',
              'Masukkan nomor tujuan: 089676399290',
              'Masukkan jumlah pembayaran sesuai tagihan',
              'Tambahkan catatan: "Pembayaran Mikasa AI Premium"',
              'Konfirmasi dengan PIN DANA Anda',
              'Simpan bukti pembayaran'
            ]
          }
        ];
      case 'BCAVA':
        return [
          {
            title: 'Cara Pembayaran BCA Virtual Account',
            steps: [
              'Login ke BCA Mobile atau Internet Banking',
              'Pilih menu "Transfer"',
              'Pilih "Virtual Account"',
              'Masukkan nomor VA: 7611263426',
              'Masukkan jumlah pembayaran sesuai tagihan',
              'Konfirmasi detail pembayaran',
              'Masukkan PIN transaksi',
              'Simpan bukti pembayaran'
            ]
          }
        ];
      default:
        return [];
    }
  }

  async checkPaymentStatus(reference: string): Promise<TripayPaymentResponse> {
    try {
      // Mock payment status check
      // In production, you would call Tripay's transaction detail API
      
      return {
        success: true,
        message: 'Transaction found',
        data: {
          reference: reference,
          merchant_ref: 'MIKASA_' + Date.now(),
          payment_selection_type: 'static',
          payment_method: 'GOPAY',
          payment_name: 'GoPay',
          customer_name: 'Demo User',
          customer_email: 'demo@mikasa.ai',
          customer_phone: '',
          callback_url: '',
          return_url: '',
          amount: 15000,
          fee_merchant: 0,
          fee_customer: 105,
          total_fee: 105,
          amount_received: 14895,
          pay_code: '089676399290',
          pay_url: '',
          checkout_url: '',
          status: Math.random() > 0.5 ? 'PAID' : 'UNPAID', // Random status for demo
          expired_time: Date.now() + (24 * 60 * 60 * 1000),
          order_items: [
            {
              sku: 'PREMIUM_MONTHLY',
              name: 'Mikasa AI Premium - 1 Bulan',
              price: 15000,
              quantity: 1
            }
          ],
          instructions: []
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to check payment status',
        errors: error
      };
    }
  }
}

// Initialize Tripay service with demo configuration
export const tripayService = new TripayService({
  merchantCode: 'MIKASA001', // Demo merchant code
  apiKey: 'demo_api_key',
  privateKey: 'demo_private_key',
  baseUrl: 'https://tripay.co.id/api-sandbox' // Use sandbox for demo
});