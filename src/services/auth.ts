import { supabase } from '../lib/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  username?: string
  whatsapp?: string
  avatar_url?: string
  isDemo?: boolean
}

export interface SignUpData {
  email: string
  password: string
  full_name: string
  username?: string
  whatsapp?: string
}

export interface SignInData {
  email: string
  password: string
}

class AuthService {
  // Sign up with email and password
  async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    if (!supabase) {
      console.error('❌ Supabase not initialized for signup')
      return { user: null, error: { message: 'Supabase not initialized' } as AuthError }
    }

    try {
      console.log('🔄 Starting signup process...')
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            full_name: data.full_name,
            username: data.username || null,
            whatsapp: data.whatsapp || null,
          }
        }
      })

      if (authError) {
        console.error('❌ Signup error:', authError)
        let errorMessage = authError.message
        if (authError.message.includes('User already registered')) {
          errorMessage = 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
        } else if (authError.message.includes('Password should be at least')) {
          errorMessage = 'Password minimal 6 karakter.'
        } else if (authError.message.includes('Invalid email')) {
          errorMessage = 'Format email tidak valid.'
        }
        return { user: null, error: authError }
      }

      if (authData.user) {
        console.log('✅ User created successfully')
        
        // Create profile manually if needed
        try {
          // First check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single()
          
          if (existingProfile) {
            console.log('✅ Profile already exists')
          } else {
            console.log('🔄 Creating new profile...')
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: data.email,
                full_name: data.full_name,
                username: data.username || null,
                whatsapp: data.whatsapp || null,
              })
            
            if (profileError) {
              console.warn('⚠️ Profile creation warning:', profileError)
            } else {
              console.log('✅ Profile created successfully')
            }
          }
        } catch (profileError) {
          console.warn('⚠️ Profile creation failed:', profileError)
        }
      } else {
        // Handle case where user creation succeeded but no user returned
        console.warn('⚠️ User creation succeeded but no user data returned')
      }

      return { user: null, error: null }
    } catch (error) {
      console.error('❌ Signup exception:', error)
      return { user: null, error: error as AuthError }
    }
  }

  // Sign in with email and password
  async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    if (!supabase) {
      console.error('❌ Supabase not initialized for signin')
      return { user: null, error: { message: 'Supabase not initialized' } as AuthError }
    }

    try {
      console.log('🔄 Starting signin process...')
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError) {
        console.error('❌ Signin error:', authError)
        // Provide more user-friendly error messages
        let errorMessage = authError.message
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah. Jika belum memiliki akun, silakan daftar terlebih dahulu.'
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Silakan coba login lagi atau daftar ulang.'
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda.'
        } else if (authError.message.includes('Too many requests')) {
          errorMessage = 'Terlalu banyak percobaan login. Silakan coba lagi nanti.'
        } else if (authError.message.includes('Invalid email')) {
          errorMessage = 'Format email tidak valid.'
        } else if (authError.message.includes('User not found')) {
          errorMessage = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.'
        }
        return { user: null, error: { ...authError, message: errorMessage } }
      }

      if (authData.user) {
        console.log('✅ User signed in successfully')
        
        // Get user profile with timeout
        let profile = null
        try {
          console.log('🔄 Fetching user profile...')
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()
          
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
          
          const result = await Promise.race([profilePromise, timeoutPromise]) as any
          if (result.data) {
            profile = result.data
            console.log('✅ Profile fetched successfully')
          } else if (result.error) {
            console.warn('⚠️ Profile fetch error:', result.error)
          }
        } catch (profileError) {
          console.warn('⚠️ Profile handling failed:', profileError)
        }

        const user: AuthUser = {
          id: authData.user.id,
          email: authData.user.email || '',
          full_name: profile?.full_name || '',
          username: profile?.username || '',
          whatsapp: profile?.whatsapp || '',
          avatar_url: profile?.avatar_url || '',
          isDemo: false
        }

        return { user, error: null }
      }

      return { user: null, error: null }
    } catch (error) {
      console.error('❌ Signin exception:', error)
      return { user: null, error: error as AuthError }
    }
  }

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Supabase not initialized' } as AuthError }
    }

    console.log('🔄 Signing out...')
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Signout error:', error)
    } else {
      console.log('✅ User signed out successfully')
    }
    
    return { error }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return null
    }

    try {
      console.log('🔄 Getting current user from Supabase...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('❌ No user found in Supabase')
        return null
      }

      console.log('👤 User found, getting profile...')

      // Get user profile
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
      )
      
      let profile = null
      let profileError = null
      
      try {
        const result = await Promise.race([profilePromise, timeoutPromise]) as any
        profile = result.data
        profileError = result.error
      } catch (error) {
        console.warn('⚠️ Profile fetch timeout, continuing without profile')
        profileError = { code: 'TIMEOUT' }
      }
      
      if (profileError) {
        console.warn('⚠️ Profile fetch warning:', profileError)
      }
      
      // Create profile if it doesn't exist (PGRST116 = no rows returned)
      if (profileError && profileError.code === 'PGRST116') {
        console.log('🔄 Creating missing profile...')
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
          console.log('✅ Profile created successfully')
        } catch (createError) {
          console.error('❌ Failed to create profile:', createError)
        }
      }
      
      console.log('📋 Profile data:', profile ? 'Found' : 'Not found')

      return {
        id: user.id,
        email: user.email || '',
        full_name: profile?.full_name || user.user_metadata?.full_name || '',
        username: profile?.username || '',
        whatsapp: profile?.whatsapp || '',
        avatar_url: profile?.avatar_url || '',
        isDemo: false
      }
    } catch (error) {
      console.error('❌ Error getting current user:', error)
      // Return null instead of throwing to prevent blocking initialization
      return null
    }
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<AuthUser>): Promise<{ error: AuthError | null }> {
    if (!supabase) {
      return { error: { message: 'Supabase not initialized' } as AuthError }
    }

    try {
      console.log('🔄 Updating profile...')
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          username: updates.username,
          whatsapp: updates.whatsapp,
          avatar_url: updates.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('❌ Profile update error:', error)
      } else {
        console.log('✅ Profile updated successfully')
      }

      return { error }
    } catch (error) {
      console.error('❌ Profile update exception:', error)
      return { error: error as AuthError }
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!supabase) {
      console.error('❌ Supabase not initialized for auth state change')
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    console.log('🔄 Setting up auth state listener...')
    
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event)
      
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()