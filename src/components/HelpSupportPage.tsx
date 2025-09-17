import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ExternalLink, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface HelpSupportPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportPage({ onBack }: HelpSupportPageProps) {
  const { t, currentLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: currentLanguage === 'id' ? 'Bagaimana cara menggunakan Mikasa AI?' : 'How to use Mikasa AI?',
      answer: currentLanguage === 'id' 
        ? 'Mikasa AI adalah asisten AI yang dapat membantu Anda dengan berbagai pertanyaan. Cukup ketik pertanyaan Anda di kolom chat dan Mikasa akan memberikan jawaban yang akurat dan membantu.'
        : 'Mikasa AI is an AI assistant that can help you with various questions. Simply type your question in the chat field and Mikasa will provide accurate and helpful answers.',
      category: 'general'
    },
    {
      id: '2',
      question: currentLanguage === 'id' ? 'Berapa batas pesan harian untuk akun gratis?' : 'What is the daily message limit for free accounts?',
      answer: currentLanguage === 'id'
        ? 'Akun gratis memiliki batas 10 pesan per hari. Untuk mendapatkan pesan tanpa batas, Anda dapat upgrade ke paket Premium atau Pro.'
        : 'Free accounts have a limit of 10 messages per day. To get unlimited messages, you can upgrade to Premium or Pro plans.',
      category: 'account'
    },
    {
      id: '3',
      question: currentLanguage === 'id' ? 'Bagaimana cara upgrade ke Premium?' : 'How to upgrade to Premium?',
      answer: currentLanguage === 'id'
        ? 'Buka menu Langganan, pilih paket Premium, lalu ikuti instruksi pembayaran. Setelah pembayaran dikonfirmasi, akun Anda akan diupgrade otomatis.'
        : 'Go to Subscription menu, select Premium plan, then follow the payment instructions. After payment is confirmed, your account will be automatically upgraded.',
      category: 'subscription'
    },
    {
      id: '4',
      question: currentLanguage === 'id' ? 'Apakah data saya aman?' : 'Is my data safe?',
      answer: currentLanguage === 'id'
        ? 'Ya, kami menggunakan enkripsi end-to-end untuk melindungi semua percakapan Anda. Data pribadi Anda tidak akan dibagikan kepada pihak ketiga.'
        : 'Yes, we use end-to-end encryption to protect all your conversations. Your personal data will not be shared with third parties.',
      category: 'privacy'
    },
    {
      id: '5',
      question: currentLanguage === 'id' ? 'Bagaimana cara menghapus riwayat chat?' : 'How to delete chat history?',
      answer: currentLanguage === 'id'
        ? 'Buka Profil > Privasi & Keamanan > Riwayat Chat, lalu klik "Hapus Riwayat". Perhatian: tindakan ini tidak dapat dibatalkan.'
        : 'Go to Profile > Privacy & Security > Chat History, then click "Delete History". Warning: this action cannot be undone.',
      category: 'privacy'
    }
  ];

  const categories = [
    { id: 'all', name: currentLanguage === 'id' ? 'Semua' : 'All' },
    { id: 'general', name: currentLanguage === 'id' ? 'Umum' : 'General' },
    { id: 'account', name: currentLanguage === 'id' ? 'Akun' : 'Account' },
    { id: 'subscription', name: currentLanguage === 'id' ? 'Langganan' : 'Subscription' },
    { id: 'privacy', name: currentLanguage === 'id' ? 'Privasi' : 'Privacy' }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppContact = () => {
    const message = currentLanguage === 'id' 
      ? 'Halo, saya membutuhkan bantuan dengan Mikasa AI'
      : 'Hello, I need help with Mikasa AI';
    const whatsappUrl = `https://wa.me/6289676399290?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const facebookUrl = 'https://www.facebook.com/profile.php?id=61566532139079';
    window.open(facebookUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <HelpCircle className="text-blue-600" size={24} />
          <h1 className="text-xl font-semibold text-gray-900">
            {currentLanguage === 'id' ? 'Bantuan & Dukungan' : 'Help & Support'}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Support */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'id' ? 'Hubungi Dukungan' : 'Contact Support'}
          </h2>
          
          <div className="space-y-3">
            {/* WhatsApp Support */}
            <button
              onClick={handleWhatsAppContact}
              className="w-full flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">WhatsApp Support</h3>
                <p className="text-sm text-gray-600">089676399290</p>
                <p className="text-xs text-green-600">
                  {currentLanguage === 'id' ? 'Respons cepat 24/7' : 'Fast response 24/7'}
                </p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </button>

            {/* Email Support */}
            <button
              onClick={handleEmailContact}
              className="w-full flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">Facebook Support</h3>
                <p className="text-sm text-gray-600">Chat via Facebook Messenger</p>
                <p className="text-xs text-blue-600">
                  {currentLanguage === 'id' ? 'Chat langsung via Messenger' : 'Direct chat via Messenger'}
                </p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
          </h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={currentLanguage === 'id' ? 'Cari pertanyaan...' : 'Search questions...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">
                  {currentLanguage === 'id' ? 'Tidak ada pertanyaan yang ditemukan' : 'No questions found'}
                </p>
              </div>
            ) : (
              filteredFAQ.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {currentLanguage === 'id' ? 'Tips Cepat' : 'Quick Tips'}
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {currentLanguage === 'id' ? 'Gunakan Pertanyaan yang Jelas' : 'Use Clear Questions'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'id' 
                    ? 'Semakin spesifik pertanyaan Anda, semakin akurat jawaban yang diberikan Mikasa AI.'
                    : 'The more specific your question, the more accurate the answer Mikasa AI provides.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {currentLanguage === 'id' ? 'Manfaatkan Fitur Premium' : 'Utilize Premium Features'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'id'
                    ? 'Upgrade ke Premium untuk mendapatkan pesan tanpa batas dan fitur-fitur canggih lainnya.'
                    : 'Upgrade to Premium to get unlimited messages and other advanced features.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {currentLanguage === 'id' ? 'Backup Riwayat Chat' : 'Backup Chat History'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentLanguage === 'id'
                    ? 'Gunakan fitur export data untuk menyimpan percakapan penting Anda.'
                    : 'Use the export data feature to save your important conversations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}