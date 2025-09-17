// Internationalization utility
export interface Translations {
  [key: string]: string;
}

export const translations = {
  id: {
    // Navigation
    chat: 'Obrolan',
    explore: 'Jelajahi',
    subscription: 'Langganan',
    notifications: 'Pemberitahuan',
    profile: 'Profil',
    
    // Settings
    settings: 'Pengaturan',
    appearance: 'Tampilan',
    theme: 'Tema',
    fontSize: 'Ukuran Font',
    language: 'Bahasa',
    languageRegion: 'Bahasa & Wilayah',
    notifications_settings: 'Notifikasi',
    chat_settings: 'Chat',
    privacy: 'Privasi',
    
    // Theme options
    light: 'Terang',
    dark: 'Gelap',
    auto: 'Otomatis',
    
    // Font size options
    small: 'Kecil',
    medium: 'Sedang',
    large: 'Besar',
    
    // Language options
    indonesian: 'Bahasa Indonesia',
    english: 'English',
    malay: 'Bahasa Melayu',
    
    // Common
    back: 'Kembali',
    save: 'Simpan',
    cancel: 'Batal',
    confirm: 'Konfirmasi',
    success: 'Berhasil',
    error: 'Error',
    
    // Messages
    settingsSaved: 'Pengaturan berhasil disimpan',
    languageChanged: 'Bahasa diubah ke',
    themeChanged: 'Tema berhasil diubah',
    fontSizeChanged: 'Ukuran font berhasil diubah',
    
    // Profile
    demoAccount: 'Akun Demo',
    loginRequired: 'Login Diperlukan',
    loginNow: 'Login Sekarang',
    logout: 'Keluar',
    
    // Chat
    typeMessage: 'Ketik pesan...',
    typing: 'mengetik...',
    online: 'Online',
    
    // Welcome
    welcome: 'Selamat Datang!',
    welcomeMessage: 'Masuk untuk mengakses profil Anda dan menikmati fitur lengkap Mikasa AI',
    
    // Subscription
    free: 'Gratis',
    premium: 'Premium',
    pro: 'Pro',
    subscribeNow: 'Berlangganan Sekarang',
    
    // Usage
    messagesUsed: 'Pesan terpakai',
    messagesLimit: 'Batas pesan',
    dailyLimit: 'Batas harian',
    remainingMessages: 'Pesan tersisa'
  },
  
  en: {
    // Navigation
    chat: 'Chat',
    explore: 'Explore',
    subscription: 'Subscription',
    notifications: 'Notifications',
    profile: 'Profile',
    
    // Settings
    settings: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    fontSize: 'Font Size',
    language: 'Language',
    languageRegion: 'Language & Region',
    notifications_settings: 'Notifications',
    chat_settings: 'Chat',
    privacy: 'Privacy',
    
    // Theme options
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    
    // Font size options
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    
    // Language options
    indonesian: 'Bahasa Indonesia',
    english: 'English',
    malay: 'Bahasa Melayu',
    
    // Common
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    
    // Messages
    settingsSaved: 'Settings saved successfully',
    languageChanged: 'Language changed to',
    themeChanged: 'Theme changed successfully',
    fontSizeChanged: 'Font size changed successfully',
    
    // Profile
    demoAccount: 'Demo Account',
    loginRequired: 'Login Required',
    loginNow: 'Login Now',
    logout: 'Logout',
    
    // Chat
    typeMessage: 'Type a message...',
    typing: 'typing...',
    online: 'Online',
    
    // Welcome
    welcome: 'Welcome!',
    welcomeMessage: 'Sign in to access your profile and enjoy the full features of Mikasa AI',
    
    // Subscription
    free: 'Free',
    premium: 'Premium',
    pro: 'Pro',
    subscribeNow: 'Subscribe Now',
    
    // Usage
    messagesUsed: 'Messages used',
    messagesLimit: 'Message limit',
    dailyLimit: 'Daily limit',
    remainingMessages: 'Messages remaining'
  },
  
  ms: {
    // Navigation
    chat: 'Sembang',
    explore: 'Terokai',
    subscription: 'Langganan',
    notifications: 'Pemberitahuan',
    profile: 'Profil',
    
    // Settings
    settings: 'Tetapan',
    appearance: 'Penampilan',
    theme: 'Tema',
    fontSize: 'Saiz Fon',
    language: 'Bahasa',
    languageRegion: 'Bahasa & Wilayah',
    notifications_settings: 'Pemberitahuan',
    chat_settings: 'Sembang',
    privacy: 'Privasi',
    
    // Theme options
    light: 'Cerah',
    dark: 'Gelap',
    auto: 'Auto',
    
    // Font size options
    small: 'Kecil',
    medium: 'Sederhana',
    large: 'Besar',
    
    // Language options
    indonesian: 'Bahasa Indonesia',
    english: 'English',
    malay: 'Bahasa Melayu',
    
    // Common
    back: 'Kembali',
    save: 'Simpan',
    cancel: 'Batal',
    confirm: 'Sahkan',
    success: 'Berjaya',
    error: 'Ralat',
    
    // Messages
    settingsSaved: 'Tetapan berjaya disimpan',
    languageChanged: 'Bahasa ditukar kepada',
    themeChanged: 'Tema berjaya ditukar',
    fontSizeChanged: 'Saiz fon berjaya ditukar',
    
    // Profile
    demoAccount: 'Akaun Demo',
    loginRequired: 'Login Diperlukan',
    loginNow: 'Login Sekarang',
    logout: 'Log Keluar',
    
    // Chat
    typeMessage: 'Taip mesej...',
    typing: 'menaip...',
    online: 'Dalam Talian',
    
    // Welcome
    welcome: 'Selamat Datang!',
    welcomeMessage: 'Log masuk untuk mengakses profil anda dan nikmati ciri penuh Mikasa AI',
    
    // Subscription
    free: 'Percuma',
    premium: 'Premium',
    pro: 'Pro',
    subscribeNow: 'Langgan Sekarang',
    
    // Usage
    messagesUsed: 'Mesej digunakan',
    messagesLimit: 'Had mesej',
    dailyLimit: 'Had harian',
    remainingMessages: 'Mesej berbaki'
  }
};

export class I18n {
  private static instance: I18n;
  private currentLanguage: string = 'id';
  private listeners: Array<() => void> = [];

  private constructor() {
    // Load saved language
    const savedLanguage = localStorage.getItem('mikasa_language') || 'id';
    this.currentLanguage = savedLanguage;
  }

  static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    localStorage.setItem('mikasa_language', language);
    document.documentElement.lang = language;
    
    // Notify all listeners
    this.listeners.forEach(listener => listener());
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  t(key: string): string {
    const languageTranslations = translations[this.currentLanguage as keyof typeof translations];
    return languageTranslations?.[key] || key;
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: () => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}

export const i18n = I18n.getInstance();