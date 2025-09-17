import { useState, useEffect } from 'react'
import { authService, type AuthUser, type SignUpData, type SignInData } from '../services/auth'

export function useSupabaseAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let mounted = true
    
    // Get initial user
    const getInitialUser = async () => {
      try {
        // Check for demo user first
        const savedUser = localStorage.getItem('mikasa_user');
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            if (userData.isDemo) {
              console.log('🎭 Demo user found in localStorage');
              if (mounted) {
                setUser({
                  id: userData.id,
                  email: userData.email,
                  full_name: userData.name,
                  username: userData.username,
                  whatsapp: userData.whatsapp,
                  avatar_url: userData.avatar,
                  isDemo: true
                });
                setIsLoading(false);
                setIsInitialized(true);
                return;
              }
            }
          } catch (error) {
            console.error('Error parsing demo user:', error);
          }
        }
        
        console.log('🔄 Getting initial Supabase user...')
        const currentUser = await authService.getCurrentUser()
        
        if (mounted) {
          console.log('👤 Current user:', currentUser ? 'Found' : 'Not found')
          setUser(currentUser)
          setIsLoading(false)
          setIsInitialized(true)
        }
      } catch (error) {
        console.error('❌ Error getting initial user:', error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    // Set timeout to prevent infinite loading
    const initTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⚠️ Auth initialization timeout')
        setIsLoading(false)
        setIsInitialized(true)
      }
    }, 2000) // 2 second timeout

    getInitialUser()

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      if (mounted) {
        console.log('🔄 Supabase auth state changed:', user ? 'User logged in' : 'User logged out')
        setUser(user)
        setIsLoading(false)
        setIsInitialized(true)
      }
    })

    return () => {
      mounted = false
      clearTimeout(initTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      console.log('🔄 Starting signup...')
      const { user, error } = await authService.signUp(data)
      
      if (error) {
        console.error('❌ Signup failed:', error.message)
        return { success: false, error: error.message }
      }

      if (user) {
        console.log('✅ Signup successful')
        setUser(user)
        return { success: true }
      }

      return { success: false, error: 'Registrasi gagal' }
    } catch (error) {
      console.error('❌ Signup exception:', error)
      return { success: false, error: 'Terjadi kesalahan saat registrasi' }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (data: SignInData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      console.log('🔄 Starting signin...')
      const { user, error } = await authService.signIn(data)
      
      if (error) {
        console.error('❌ Signin failed:', error.message)
        return { success: false, error: error.message }
      }

      if (user) {
        console.log('✅ Signin successful')
        setUser(user)
        
        // Clear any demo user data
        localStorage.removeItem('mikasa_user')
        
        return { success: true }
      }

      return { success: false, error: 'Login gagal' }
    } catch (error) {
      console.error('❌ Signin exception:', error)
      return { success: false, error: 'Terjadi kesalahan saat login' }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      console.log('🔄 Starting signout...')
      const { error } = await authService.signOut()
      
      if (error) {
        console.error('❌ Signout failed:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ Signout successful')
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('❌ Signout exception:', error)
      return { success: false, error: 'Terjadi kesalahan saat logout' }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User tidak ditemukan' }

    setIsLoading(true)
    try {
      console.log('🔄 Updating profile...')
      const { error } = await authService.updateProfile(user.id, updates)
      
      if (error) {
        console.error('❌ Profile update failed:', error.message)
        return { success: false, error: error.message }
      }

      console.log('✅ Profile updated successfully')
      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null)
      return { success: true }
    } catch (error) {
      console.error('❌ Profile update exception:', error)
      return { success: false, error: 'Terjadi kesalahan saat update profil' }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    isInitialized,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}