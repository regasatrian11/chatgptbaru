import { useState, useEffect } from 'react';
import { DemoAuthService } from '../services/demoAuth';
import { userAnalytics } from '../services/userAnalytics';
import { useSupabaseAuth } from './useSupabaseAuth';
import type { AuthUser } from '../services/auth';

interface GoogleUser {
  name: string;
  email: string;
  username?: string;
  whatsapp?: string;
  avatar: string;
  id: string;
  isDemo?: boolean;
}

interface GoogleAuthResponse {
  credential: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
    handleGoogleSignIn: (response: GoogleAuthResponse) => void;
  }
}

export function useGoogleAuth() {
  const supabaseAuth = useSupabaseAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // If user is logged in via Supabase, use that
    if (supabaseAuth.isInitialized && supabaseAuth.user && !supabaseAuth.user.isDemo) {
      console.log('🔄 Using Supabase user');
      const supabaseUser: AuthUser = {
        id: supabaseAuth.user.id,
        name: supabaseAuth.user.full_name || supabaseAuth.user.username || 'User',
        email: supabaseAuth.user.email,
        username: supabaseAuth.user.username,
        whatsapp: supabaseAuth.user.whatsapp,
        avatar: supabaseAuth.user.avatar_url || '👤',
        isDemo: false
      };
      setUser(supabaseUser);
      setIsLoggedIn(true);
      setIsInitialized(true);
      return;
    }

    // Only proceed if Supabase auth is initialized
    if (!supabaseAuth.isInitialized) {
      console.log('🔄 Waiting for Supabase auth to initialize...');
      return;
    }
    
    // Check if user was previously logged in
    const savedUser = localStorage.getItem('mikasa_user');
    if (savedUser) {
      try {
        console.log('🔄 Loading saved user from localStorage');
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
        
        // Track user login in analytics if not demo
        if (!userData.isDemo) {
          userAnalytics.trackUserLogin(userData.id, userData.email, 'regular');
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('mikasa_user');
      }
    }
    
    console.log('✅ Google auth initialized');
    setIsInitialized(true);
  }, [supabaseAuth.user, supabaseAuth.isInitialized]);

  const signInWithGoogle = async (): Promise<AuthUser | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      
      // Check demo access first
      const demoAuth = DemoAuthService.getInstance();
      
      demoAuth.checkDemoAccess().then(({ allowed, reason }) => {
        if (!allowed) {
          setIsLoading(false);
          reject(new Error(reason || 'Demo login tidak diizinkan'));
          return;
        }
        
        // Simulate Google sign-in with realistic user data
        try {
          const mockUser: AuthUser = {
            id: 'google_user_' + Date.now(),
            name: 'ryuumikasa',
            email: 'ryuumikasa@mikasa.ai',
            avatar: '👤',
            isDemo: true,
          };
          
          setUser(mockUser);
          setIsLoggedIn(true);
          localStorage.setItem('mikasa_user', JSON.stringify(mockUser));
          
          // Track user login in analytics
          userAnalytics.trackUserLogin(mockUser.id, mockUser.email, 'demo');
          
          setIsLoading(false);
          resolve(mockUser);
        } catch (error) {
          setIsLoading(false);
          reject(error);
        }
      }).catch(reject);
      
      // Uncomment this for real Google sign-in:
      /*
      if (window.google) {
        window.google.accounts.id.prompt();
        
        // Set up a temporary callback
        const originalCallback = window.handleGoogleSignIn;
        window.handleGoogleSignIn = (response: GoogleAuthResponse) => {
          handleCredentialResponse(response);
          setIsLoading(false);
          resolve(user);
          window.handleGoogleSignIn = originalCallback;
        };
      } else {
        setIsLoading(false);
        reject(new Error('Google Sign-In not available'));
      }
      */
    });
  };

  const signOut = () => {
    // Sign out from Supabase if logged in there
    if (supabaseAuth.user && !supabaseAuth.user.isDemo) {
      supabaseAuth.signOut();
    }

    // Track user logout
    if (user) {
      userAnalytics.trackUserLogout(user.id);
    }
    
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('mikasa_user');
    // Clear any other stored data
    localStorage.removeItem('mikasa_daily_usage');
    // Keep theme, fontSize, and language settings
    // localStorage.removeItem('mikasa_theme');
    // localStorage.removeItem('mikasa_fontSize');
    // localStorage.removeItem('mikasa_language');
  };

  return {
    user,
    isLoggedIn: isLoggedIn || !!supabaseAuth.user,
    isInitialized: isInitialized && supabaseAuth.isInitialized,
    isLoading,
    signInWithGoogle,
    signOut,
    supabaseAuth, // Expose Supabase auth methods
  };
}