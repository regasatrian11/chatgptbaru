import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';
import { getChatCompletion } from '../services/openai';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useSubscription } from './useSubscription';
import { userAnalytics } from '../services/userAnalytics';

export function useChat() {
  const { isLoggedIn } = useSupabaseAuth();
  const { canSendMessage, messagesUsed, messagesLimit, messagesRemaining, updateUsage } = useSubscription();
  
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    // Check daily message limit
    if (!canSendMessage) {
      if (!isLoggedIn) {
        setState(prev => ({
          ...prev,
          error: 'Silakan login terlebih dahulu untuk dapat mengirim pesan.'
        }));
        return;
      }
      
      setState(prev => ({
        ...prev,
        error: `Anda telah mencapai batas ${messagesLimit} pesan per hari. ${messagesLimit === 10 ? 'Daftar akun reguler atau upgrade ke Premium untuk pesan tanpa batas!' : 'Upgrade ke Premium untuk pesan tanpa batas!'}`
      }));
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const chatHistory = state.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log('🔄 Sending message to AI...');
      const response = await getChatCompletion([
        ...chatHistory,
        { role: 'user', content }
      ]);
      console.log('✅ AI response received');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      // Update usage in Supabase
      await updateUsage();
      
      // Track message in analytics
      const savedUser = localStorage.getItem('mikasa_user'); // Keep for demo compatibility
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          userAnalytics.trackMessageSent(userData.id);
        } catch (error) {
          console.error('Error tracking message:', error);
        }
      }
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [state.messages, canSendMessage, messagesLimit, updateUsage, isLoggedIn]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  // Get current usage stats
  const getUsageStats = useCallback(() => {
    return {
      messagesUsed,
      messagesLimit,
      messagesRemaining,
      canSend: isLoggedIn ? canSendMessage : false
    };
  }, [messagesUsed, messagesLimit, messagesRemaining, canSendMessage, isLoggedIn]);
  
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearError,
    clearChat,
    messagesEndRef,
    getUsageStats,
  };
}