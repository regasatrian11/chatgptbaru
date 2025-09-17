export type NavigationTab = 'chat' | 'explore' | 'subscription' | 'notifications' | 'profile';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subscription: {
    plan: string;
    expiresAt: Date;
    isActive: boolean;
  };
  usage: {
    messagesUsed: number;
    messagesLimit: number;
  };
}