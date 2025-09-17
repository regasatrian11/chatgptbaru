import { useState, useEffect, useCallback } from 'react'
import { subscriptionService, SubscriptionInfo, UsageInfo } from '../services/subscriptionService'
import { useSupabaseAuth } from './useSupabaseAuth'

export function useSubscription() {
  const { isLoggedIn, user } = useSupabaseAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load subscription and usage data
  const loadData = useCallback(async () => {
    if (!isLoggedIn) {
      setIsLoading(false)
      return
    }
    
    if (user?.isDemo) {
      // For demo users, set default free plan
      console.log('🔄 Setting demo user defaults...')
      
      // Get demo usage from localStorage
      const today = new Date().toDateString()
      const demoUsage = JSON.parse(localStorage.getItem('mikasa_demo_usage') || '{}')
      const todayUsage = demoUsage[today] || 0
      
      setSubscription({
        plan_type: 'free',
        status: 'active',
        end_date: null,
        is_active: true,
        messages_limit: 10
      })
      setUsage({
        can_send: todayUsage < 10,
        messages_used: todayUsage,
        messages_limit: 10,
        plan_type: 'free'
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('🔄 Loading subscription data...')
      setIsLoading(true)
      setError(null)

      const [subscriptionData, usageData] = await Promise.all([
        subscriptionService.getUserSubscription(),
        subscriptionService.checkUsageLimit()
      ])

      console.log('✅ Subscription data loaded:', { subscriptionData, usageData })
      setSubscription(subscriptionData)
      setUsage(usageData)
    } catch (err) {
      console.error('❌ Error loading subscription data:', err)
      setError('Gagal memuat data langganan')
      
      // Set fallback data
      setSubscription({
        plan_type: 'free',
        status: 'active',
        end_date: null,
        is_active: true,
        messages_limit: 10
      })
      setUsage({
        can_send: true,
        messages_used: 0,
        messages_limit: 10,
        plan_type: 'free'
      })
    } finally {
      setIsLoading(false)
    }
  }, [isLoggedIn, user?.isDemo])

  // Update usage when user sends a message
  const updateUsage = useCallback(async () => {
    if (!isLoggedIn || user?.isDemo) {
      if (user?.isDemo) {
        console.log('🔄 Updating demo user usage...')
        
        // Update demo usage in localStorage
        const today = new Date().toDateString()
        const demoUsage = JSON.parse(localStorage.getItem('mikasa_demo_usage') || '{}')
        const todayUsage = (demoUsage[today] || 0) + 1
        
        demoUsage[today] = todayUsage
        localStorage.setItem('mikasa_demo_usage', JSON.stringify(demoUsage))
        
        // Update usage state
        setUsage(prev => prev ? {
          ...prev,
          messages_used: todayUsage,
          can_send: todayUsage < 10
        } : null)
        
        console.log('✅ Demo usage updated:', todayUsage)
        return true
      }
      
      console.log('⚠️ Skipping usage update for non-logged user')
      return false
    }

    try {
      console.log('🔄 Updating usage...')
      const success = await subscriptionService.updateUsage()
      
      if (success) {
        // Reload usage data
        const usageData = await subscriptionService.checkUsageLimit()
        setUsage(usageData)
        console.log('✅ Usage updated successfully')
      }
      
      return success
    } catch (err) {
      console.error('❌ Error updating usage:', err)
      return false
    }
  }, [isLoggedIn, user?.isDemo])

  // Create new subscription
  const createSubscription = useCallback(async (planType: 'premium' | 'pro', paymentMethod: string, paymentReference: string) => {
    if (!isLoggedIn || user?.isDemo) {
      console.log('⚠️ Demo user cannot create subscription')
      return false
    }

    try {
      console.log('🔄 Creating subscription...')
      const success = await subscriptionService.createSubscription({
        plan_type: planType,
        payment_method: paymentMethod,
        payment_reference: paymentReference
      })

      if (success) {
        // Reload subscription data
        await loadData()
        console.log('✅ Subscription created successfully')
      }

      return success
    } catch (err) {
      console.error('❌ Error creating subscription:', err)
      return false
    }
  }, [isLoggedIn, user?.isDemo, loadData])

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!isLoggedIn || user?.isDemo) {
      console.log('⚠️ Demo user cannot cancel subscription')
      return false
    }

    try {
      console.log('🔄 Cancelling subscription...')
      const success = await subscriptionService.cancelSubscription()
      
      if (success) {
        // Reload subscription data
        await loadData()
        console.log('✅ Subscription cancelled successfully')
      }
      
      return success
    } catch (err) {
      console.error('❌ Error cancelling subscription:', err)
      return false
    }
  }, [isLoggedIn, user?.isDemo, loadData])

  // Load data when user logs in
  useEffect(() => {
    if (isLoggedIn !== undefined) { // Wait for auth to initialize
      loadData()
    }
  }, [isLoggedIn, loadData])

  // Helper functions
  const isPremium = subscription?.plan_type === 'premium' && subscription?.is_active
  const isPro = subscription?.plan_type === 'pro' && subscription?.is_active
  const isFree = subscription?.plan_type === 'free' || !subscription?.is_active
  const canSendMessage = usage?.can_send ?? false
  const messagesUsed = usage?.messages_used ?? 0
  const messagesLimit = usage?.messages_limit ?? 10
  const messagesRemaining = messagesLimit === -1 ? -1 : Math.max(0, messagesLimit - messagesUsed)

  return {
    subscription,
    usage,
    isLoading,
    error,
    isPremium,
    isPro,
    isFree,
    canSendMessage,
    messagesUsed,
    messagesLimit,
    messagesRemaining,
    updateUsage,
    createSubscription,
    cancelSubscription,
    refreshData: loadData
  }
}