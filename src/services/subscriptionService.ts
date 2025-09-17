import { supabase } from '../lib/supabase'

export interface SubscriptionInfo {
  plan_type: 'free' | 'premium' | 'pro'
  status: 'active' | 'inactive' | 'expired' | 'cancelled'
  end_date: string | null
  is_active: boolean
  messages_limit: number
}

export interface UsageInfo {
  can_send: boolean
  messages_used: number
  messages_limit: number
  plan_type: 'free' | 'premium' | 'pro'
}

export interface CreateSubscriptionData {
  plan_type: 'premium' | 'pro'
  payment_method: string
  payment_reference: string
  duration_months?: number
}

export class SubscriptionService {
  // Get user's current subscription status
  async getUserSubscription(): Promise<SubscriptionInfo | null> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return null
    }

    try {
      console.log('🔄 Getting user subscription...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No authenticated user')
        return null
      }

      const { data, error } = await supabase.rpc('get_user_subscription_status', {
        user_uuid: user.id
      })

      if (error) {
        console.error('❌ Error getting subscription:', error)
        // Return default free subscription
        return {
          plan_type: 'free',
          status: 'active',
          end_date: null,
          is_active: true,
          messages_limit: 10
        }
      }

      const subscription = data?.[0]
      console.log('✅ Subscription retrieved:', subscription)
      
      return subscription || {
        plan_type: 'free',
        status: 'active',
        end_date: null,
        is_active: true,
        messages_limit: 10
      }
    } catch (error) {
      console.error('❌ Exception getting subscription:', error)
      return {
        plan_type: 'free',
        status: 'active',
        end_date: null,
        is_active: true,
        messages_limit: 10
      }
    }
  }

  // Check user's usage limit
  async checkUsageLimit(): Promise<UsageInfo | null> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return null
    }

    try {
      console.log('🔄 Checking usage limit...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No authenticated user')
        return null
      }

      const { data, error } = await supabase.rpc('check_usage_limit', {
        user_uuid: user.id
      })

      if (error) {
        console.error('❌ Error checking usage limit:', error)
        // Return default free usage
        return {
          can_send: true,
          messages_used: 0,
          messages_limit: 10,
          plan_type: 'free'
        }
      }

      const usage = data?.[0]
      console.log('✅ Usage limit checked:', usage)
      
      return usage || {
        can_send: true,
        messages_used: 0,
        messages_limit: 10,
        plan_type: 'free'
      }
    } catch (error) {
      console.error('❌ Exception checking usage limit:', error)
      return {
        can_send: true,
        messages_used: 0,
        messages_limit: 10,
        plan_type: 'free'
      }
    }
  }

  // Update user's message usage
  async updateUsage(): Promise<boolean> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return false
    }

    try {
      console.log('🔄 Updating usage...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No authenticated user')
        return false
      }

      const { data, error } = await supabase.rpc('update_user_usage', {
        user_uuid: user.id
      })

      if (error) {
        console.error('❌ Error updating usage:', error)
        return false
      }

      console.log('✅ Usage updated successfully')
      return true
    } catch (error) {
      console.error('❌ Exception updating usage:', error)
      return false
    }
  }

  // Create new subscription
  async createSubscription(data: CreateSubscriptionData): Promise<boolean> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return false
    }

    try {
      console.log('🔄 Creating subscription...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No authenticated user')
        return false
      }

      // Calculate end date based on duration
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + (data.duration_months || 1))

      // First, deactivate any existing active subscriptions
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'active')

      // Create new subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_type: data.plan_type,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          payment_method: data.payment_method,
          payment_reference: data.payment_reference
        })

      if (subscriptionError) {
        console.error('❌ Error creating subscription:', subscriptionError)
        return false
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payment_records')
        .insert({
          user_id: user.id,
          amount: data.plan_type === 'premium' ? 15000 : 45000,
          payment_method: data.payment_method,
          payment_reference: data.payment_reference,
          status: 'paid'
        })

      if (paymentError) {
        console.warn('⚠️ Warning creating payment record:', paymentError)
      }

      console.log('✅ Subscription created successfully')
      return true
    } catch (error) {
      console.error('❌ Exception creating subscription:', error)
      return false
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<boolean> {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return false
    }

    try {
      console.log('🔄 Cancelling subscription...')
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ No authenticated user')
        return false
      }

      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (error) {
        console.error('❌ Error cancelling subscription:', error)
        return false
      }

      console.log('✅ Subscription cancelled successfully')
      return true
    } catch (error) {
      console.error('❌ Exception cancelling subscription:', error)
      return false
    }
  }

  // Get subscription history
  async getSubscriptionHistory() {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return []
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error getting subscription history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Exception getting subscription history:', error)
      return []
    }
  }

  // Get usage history
  async getUsageHistory(days: number = 30) {
    if (!supabase) {
      console.error('❌ Supabase not initialized')
      return []
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false })

      if (error) {
        console.error('❌ Error getting usage history:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Exception getting usage history:', error)
      return []
    }
  }
}

export const subscriptionService = new SubscriptionService()