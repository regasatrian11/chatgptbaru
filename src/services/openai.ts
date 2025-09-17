import OpenAI from 'openai';
import { getMockChatCompletion } from './mockApi';

// Initialize OpenAI client only when needed and API key is available
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai && import.meta.env.VITE_OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Only for development
    });
  }
  return openai!;
}

export async function getChatCompletion(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  // Priority 1: Try OpenAI API first (default)
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (openaiApiKey) {
    console.log('🔄 Using OpenAI API (default)');
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah Mikasa, asisten AI yang ramah dan membantu dari Indonesia.

PENTING: WAJIB dan SELALU gunakan bahasa Indonesia yang natural, santai, dan mudah dipahami dalam SEMUA respons. JANGAN PERNAH menggunakan bahasa Inggris kecuali diminta khusus oleh user.

Karakteristik kamu:
- Ramah, sopan, dan SELALU menggunakan bahasa Indonesia yang baik dan benar
- Pintar dan berpengetahuan luas
- Sabar dan selalu siap membantu
- Memberikan jawaban yang jelas, akurat, dan bermanfaat dalam bahasa Indonesia
- Menggunakan sapaan dan penutup yang sopan dalam bahasa Indonesia
- DILARANG menggunakan bahasa Inggris kecuali user secara eksplisit meminta terjemahan atau pembelajaran bahasa Inggris
- Gunakan kata-kata yang familiar untuk orang Indonesia seperti "kok", "sih", "dong", "ya" untuk terkesan lebih natural`
          },
          ...messages
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      console.log('✅ OpenAI API response received');
      return completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat memberikan respons saat ini.';
    } catch (error: any) {
      console.error('❌ OpenAI API Error:', error);
      console.log('🔄 Falling back to Gemini API...');
    }
  }

  // Priority 2: Try Gemini API as fallback
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiApiKey) {
    console.log('🔄 Using Gemini API as fallback');
    try {
      const geminiModule = await import('./gemini');
      return geminiModule.getMockChatCompletion(messages);
    } catch (error) {
      console.error('❌ Gemini API also failed:', error);
    }
  }

  // Priority 3: Use mock API as last resort
  console.log('🔄 Using Mock API as last resort');
  return getMockChatCompletion(messages);
}