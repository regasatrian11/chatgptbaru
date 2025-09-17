// Admin Authentication Service
export interface AdminUser {
  username: string;
  password: string;
  role: 'admin';
  permissions: string[];
}

export interface AdminSession {
  username: string;
  role: 'admin';
  loginTime: Date;
  isActive: boolean;
}

export class AdminAuthService {
  private static instance: AdminAuthService;
  private adminUsers: AdminUser[] = [
    {
      username: 'ryuumikasa',
      password: '22Kumaha@@',
      role: 'admin',
      permissions: [
        'view_users',
        'view_analytics',
        'manage_passwords',
        'view_payments',
        'view_traffic'
      ]
    }
  ];

  private constructor() {}

  static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  // Admin login
  async loginAdmin(username: string, password: string): Promise<AdminSession | null> {
    const admin = this.adminUsers.find(
      user => user.username === username && user.password === password
    );

    if (admin) {
      const session: AdminSession = {
        username: admin.username,
        role: admin.role,
        loginTime: new Date(),
        isActive: true
      };

      // Save admin session
      localStorage.setItem('mikasa_admin_session', JSON.stringify(session));
      return session;
    }

    return null;
  }

  // Check if admin is logged in
  getAdminSession(): AdminSession | null {
    try {
      // Only allow admin access for specific username
      const currentUser = localStorage.getItem('mikasa_user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        // Only allow admin access if logged in as ryuumikasa (simulated)
        // In real app, this would be checked against actual user database
        if (userData.email !== 'ryuumikasa@mikasa.ai') {
          return null;
        }
      } else {
        return null;
      }
      
      const session = localStorage.getItem('mikasa_admin_session');
      if (session) {
        const adminSession = JSON.parse(session);
        // Check if session is still valid (24 hours)
        const loginTime = new Date(adminSession.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return adminSession;
        } else {
          this.logoutAdmin();
        }
      }
    } catch (error) {
      console.error('Error getting admin session:', error);
    }
    return null;
  }

  // Admin logout
  logoutAdmin(): void {
    localStorage.removeItem('mikasa_admin_session');
  }

  // Check admin permissions
  hasPermission(permission: string): boolean {
    const session = this.getAdminSession();
    if (!session) return false;

    const admin = this.adminUsers.find(user => user.username === session.username);
    return admin ? admin.permissions.includes(permission) : false;
  }
}

export const adminAuth = AdminAuthService.getInstance();