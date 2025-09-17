import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type NewChatSession = Database['public']['Tables']['chat_sessions']['Insert']
type NewMessage = Database['public']['Tables']['messages']['Insert']

export class ChatService {
  // Get all chat sessions for current user
  async getChatSessions(): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching chat sessions:', error)
      return []
    }

    return data || []
  }

  // Create new chat session
  async createChatSession(title: string = 'New Chat'): Promise<ChatSession | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('User not authenticated')
      return null
    }

    const newSession: NewChatSession = {
      user_id: user.id,
      title
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(newSession)
      .select()
      .single()

    if (error) {
      console.error('Error creating chat session:', error)
      return null
    }

    return data
  }

  // Get messages for a chat session
  async getMessages(chatSessionId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_session_id', chatSessionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }

    return data || []
  }

  // Add message to chat session
  async addMessage(chatSessionId: string, content: string, role: 'user' | 'assistant'): Promise<Message | null> {
    const newMessage: NewMessage = {
      chat_session_id: chatSessionId,
      content,
      role
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single()

    if (error) {
      console.error('Error adding message:', error)
      return null
    }

    // Update chat session's updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatSessionId)

    return data
  }

  // Update chat session title
  async updateChatSessionTitle(chatSessionId: string, title: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', chatSessionId)

    if (error) {
      console.error('Error updating chat session title:', error)
      return false
    }

    return true
  }

  // Delete chat session
  async deleteChatSession(chatSessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', chatSessionId)

    if (error) {
      console.error('Error deleting chat session:', error)
      return false
    }

    return true
  }

  // Delete all messages in a chat session
  async clearChatSession(chatSessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('chat_session_id', chatSessionId)

    if (error) {
      console.error('Error clearing chat session:', error)
      return false
    }

    return true
  }

  // Get message count for user (for usage tracking)
  async getUserMessageCount(timeframe: 'today' | 'all' = 'today'): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return 0

    let query = supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'user')
      .in('chat_session_id', 
        supabase
          .from('chat_sessions')
          .select('id')
          .eq('user_id', user.id)
      )

    if (timeframe === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = query.gte('created_at', today.toISOString())
    }

    const { count, error } = await query

    if (error) {
      console.error('Error getting message count:', error)
      return 0
    }

    return count || 0
  }
}

export const chatService = new ChatService()