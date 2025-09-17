// User Analytics Service
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  demoUsers: number;
  regularUsers: number;
  premiumUsers: number;
  dailyActiveUsers: number;
  totalMessages: number;
  averageMessagesPerUser: number;
  registrationsByDay: { date: string; count: number }[];
  usersByPlan: { plan: string; count: number }[];
}

export interface UserActivity {
  userId: string;
  userName: string;
  email: string;
  accountType: 'demo' | 'regular' | 'premium';
  lastActive: Date;
  totalMessages: number;
  joinDate: Date;
  isOnline: boolean;
}

export class UserAnalyticsService {
  private static instance: UserAnalyticsService;
  
  private constructor() {}
  
  static getInstance(): UserAnalyticsService {
    if (!UserAnalyticsService.instance) {
      UserAnalyticsService.instance = new UserAnalyticsService();
    }
    return UserAnalyticsService.instance;
  }

  // Track user login
  trackUserLogin(userId: string, userEmail: string, accountType: 'demo' | 'regular' = 'demo') {
    const users = this.getStoredUsers();
    const existingUser = users.find(u => u.userId === userId);
    
    if (existingUser) {
      existingUser.lastActive = new Date();
      existingUser.isOnline = true;
    } else {
      users.push({
        userId,
        userName: accountType === 'demo' ? 'Demo User' : 'Regular User',
        email: userEmail,
        accountType,
        lastActive: new Date(),
        totalMessages: 0,
        joinDate: new Date(),
        isOnline: true
      });
    }
    
    this.saveUsers(users);
    this.updateDailyStats();
  }

  // Track user logout
  trackUserLogout(userId: string) {
    const users = this.getStoredUsers();
    const user = users.find(u => u.userId === userId);
    if (user) {
      user.isOnline = false;
      user.lastActive = new Date();
    }
    this.saveUsers(users);
  }

  // Track message sent
  trackMessageSent(userId: string) {
    const users = this.getStoredUsers();
    const user = users.find(u => u.userId === userId);
    if (user) {
      user.totalMessages++;
      user.lastActive = new Date();
    }
    this.saveUsers(users);
  }

  // Get user statistics
  getUserStats(): UserStats {
    const users = this.getStoredUsers();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const totalUsers = users.length;
    const demoUsers = users.filter(u => u.accountType === 'demo').length;
    const regularUsers = users.filter(u => u.accountType === 'regular').length;
    const premiumUsers = users.filter(u => u.accountType === 'premium').length;
    
    // Active users (logged in within last 24 hours)
    const activeUsers = users.filter(u => {
      const lastActive = new Date(u.lastActive);
      return (now.getTime() - lastActive.getTime()) < (24 * 60 * 60 * 1000);
    }).length;

    // Daily active users (active today)
    const dailyActiveUsers = users.filter(u => {
      const lastActive = new Date(u.lastActive);
      return lastActive >= today;
    }).length;

    const totalMessages = users.reduce((sum, u) => sum + u.totalMessages, 0);
    const averageMessagesPerUser = totalUsers > 0 ? Math.round(totalMessages / totalUsers) : 0;

    // Registration by day (last 7 days)
    const registrationsByDay = this.getRegistrationsByDay(7);
    
    const usersByPlan = [
      { plan: 'Demo', count: demoUsers },
      { plan: 'Gratis', count: regularUsers },
      { plan: 'Premium', count: premiumUsers }
    ];

    return {
      totalUsers,
      activeUsers,
      demoUsers,
      regularUsers,
      premiumUsers,
      dailyActiveUsers,
      totalMessages,
      averageMessagesPerUser,
      registrationsByDay,
      usersByPlan
    };
  }

  // Get all user activities
  getUserActivities(): UserActivity[] {
    return this.getStoredUsers().sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
  }

  private getStoredUsers(): UserActivity[] {
    try {
      const stored = localStorage.getItem('mikasa_user_analytics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: UserActivity[]) {
    localStorage.setItem('mikasa_user_analytics', JSON.stringify(users));
  }

  private updateDailyStats() {
    const today = new Date().toDateString();
    const dailyStats = this.getDailyStats();
    
    if (!dailyStats[today]) {
      dailyStats[today] = {
        date: today,
        newUsers: 1,
        activeUsers: 1,
        totalMessages: 0
      };
    } else {
      dailyStats[today].activeUsers++;
    }
    
    localStorage.setItem('mikasa_daily_stats', JSON.stringify(dailyStats));
  }

  private getDailyStats(): any {
    try {
      const stored = localStorage.getItem('mikasa_daily_stats');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private getRegistrationsByDay(days: number): { date: string; count: number }[] {
    const users = this.getStoredUsers();
    const result: { date: string; count: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = users.filter(u => {
        const joinDate = new Date(u.joinDate);
        return joinDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      result.push({
        date: dateStr,
        count
      });
    }
    
    return result;
  }

  // Clear all analytics data (for testing)
  clearAnalytics() {
    localStorage.removeItem('mikasa_user_analytics');
    localStorage.removeItem('mikasa_daily_stats');
  }
}

export const userAnalytics = UserAnalyticsService.getInstance();