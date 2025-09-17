// User Management Service for Admin
import { userAnalytics, UserActivity } from './userAnalytics';

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  status: 'PAID' | 'UNPAID' | 'EXPIRED' | 'REFUNDED';
  transactionDate: Date;
  reference: string;
}

export interface UserManagementData {
  id: string;
  name: string;
  email: string;
  username?: string;
  whatsapp?: string;
  accountType: 'demo' | 'regular' | 'premium';
  status: 'active' | 'suspended' | 'deleted';
  joinDate: Date;
  lastActive: Date;
  totalMessages: number;
  isOnline: boolean;
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

export class UserManagementService {
  private static instance: UserManagementService;

  private constructor() {}

  static getInstance(): UserManagementService {
    if (!UserManagementService.instance) {
      UserManagementService.instance = new UserManagementService();
    }
    return UserManagementService.instance;
  }

  // Get all users with management data
  getAllUsers(): UserManagementData[] {
    const activities = userAnalytics.getUserActivities();
    
    return activities.map(activity => ({
      id: activity.userId,
      name: activity.userName,
      email: activity.email,
      accountType: activity.accountType,
      status: 'active',
      joinDate: new Date(activity.joinDate),
      lastActive: new Date(activity.lastActive),
      totalMessages: activity.totalMessages,
      isOnline: activity.isOnline,
      subscription: activity.accountType === 'premium' ? {
        plan: 'Premium',
        startDate: new Date(activity.joinDate),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true
      } : undefined
    }));
  }

  // Reset user password (admin only)
  resetUserPassword(userId: string, newPassword: string): boolean {
    try {
      // In a real app, this would update the database
      // For demo, we'll just simulate success
      console.log(`Password reset for user ${userId} to: ${newPassword}`);
      
      // Save password reset log
      const resetLog = {
        userId,
        newPassword,
        resetDate: new Date(),
        resetBy: 'admin'
      };
      
      const existingLogs = this.getPasswordResetLogs();
      existingLogs.push(resetLog);
      localStorage.setItem('mikasa_password_resets', JSON.stringify(existingLogs));
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }

  // Get password reset logs
  getPasswordResetLogs(): any[] {
    try {
      const logs = localStorage.getItem('mikasa_password_resets');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  // Suspend user account
  suspendUser(userId: string, reason: string): boolean {
    try {
      const suspensions = this.getSuspendedUsers();
      suspensions.push({
        userId,
        reason,
        suspendedDate: new Date(),
        suspendedBy: 'admin'
      });
      localStorage.setItem('mikasa_suspended_users', JSON.stringify(suspensions));
      return true;
    } catch {
      return false;
    }
  }

  // Get suspended users
  getSuspendedUsers(): any[] {
    try {
      const suspended = localStorage.getItem('mikasa_suspended_users');
      return suspended ? JSON.parse(suspended) : [];
    } catch {
      return [];
    }
  }

  // Get payment records
  getPaymentRecords(): PaymentRecord[] {
    try {
      const payments = localStorage.getItem('mikasa_payment_records');
      if (payments) {
        return JSON.parse(payments);
      }
      
      // Generate some demo payment data
      const demoPayments: PaymentRecord[] = [
        {
          id: 'PAY001',
          userId: 'user_001',
          userName: 'Demo User 1',
          userEmail: 'demo1@mikasa.ai',
          planName: 'Premium',
          amount: 15000,
          paymentMethod: 'GOPAY',
          status: 'PAID',
          transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          reference: 'T123456789'
        },
        {
          id: 'PAY002',
          userId: 'user_002',
          userName: 'Demo User 2',
          userEmail: 'demo2@mikasa.ai',
          planName: 'Pro',
          amount: 45000,
          paymentMethod: 'DANA',
          status: 'PAID',
          transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          reference: 'T987654321'
        },
        {
          id: 'PAY003',
          userId: 'user_003',
          userName: 'Demo User 3',
          userEmail: 'demo3@mikasa.ai',
          planName: 'Premium',
          amount: 15000,
          paymentMethod: 'BCAVA',
          status: 'UNPAID',
          transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          reference: 'T456789123'
        }
      ];
      
      localStorage.setItem('mikasa_payment_records', JSON.stringify(demoPayments));
      return demoPayments;
    } catch {
      return [];
    }
  }

  // Add payment record
  addPaymentRecord(payment: PaymentRecord): void {
    try {
      const payments = this.getPaymentRecords();
      payments.push(payment);
      localStorage.setItem('mikasa_payment_records', JSON.stringify(payments));
    } catch (error) {
      console.error('Error adding payment record:', error);
    }
  }

  // Get traffic data
  getTrafficData() {
    const stats = userAnalytics.getUserStats();
    const users = this.getAllUsers();
    
    // Calculate additional traffic metrics
    const todayUsers = users.filter(u => {
      const today = new Date();
      const lastActive = new Date(u.lastActive);
      return lastActive.toDateString() === today.toDateString();
    }).length;

    const weeklyUsers = users.filter(u => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const lastActive = new Date(u.lastActive);
      return lastActive >= weekAgo;
    }).length;

    const monthlyUsers = users.filter(u => {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const lastActive = new Date(u.lastActive);
      return lastActive >= monthAgo;
    }).length;

    return {
      ...stats,
      todayUsers,
      weeklyUsers,
      monthlyUsers,
      onlineUsers: users.filter(u => u.isOnline).length,
      totalRevenue: this.getPaymentRecords()
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0)
    };
  }
}

export const userManagement = UserManagementService.getInstance();