// Mock API responses for testing
const mockResponses = [
  "Halo! Saya Mikasa, asisten AI yang siap membantu Anda. Ada yang bisa saya bantu hari ini?",
  "Pertanyaan yang menarik! Mari saya pikirkan sejenak untuk memberikan jawaban terbaik...",
  "Saya memahami apa yang Anda tanyakan. Berikut perspektif saya tentang topik tersebut.",
  "Poin yang bagus! Saya dengan senang hati akan menjelaskan lebih detail tentang hal itu.",
  "Terima kasih telah berbagi dengan saya. Saya merasa ini cukup menarik untuk dibahas.",
  "Saya paham maksud Anda. Mari saya berikan beberapa wawasan tambahan.",
  "Pertanyaan yang sangat bagus! Saya senang Anda menanyakan hal tersebut.",
  "Saya menghargai rasa ingin tahu Anda. Berikut pendapat saya tentang masalah itu.",
  "Observasi yang sangat baik! Anda telah menyentuh sesuatu yang sangat penting.",
  "Saya di sini untuk membantu! Mari saya berikan jawaban yang komprehensif.",
  "Itu mengingatkan saya pada konsep menarik yang ingin saya bagikan dengan Anda.",
  "Anda telah mengangkat poin yang sangat thoughtful. Saya ingin mengembangkan ide tersebut.",
  "Saya terkesan dengan pertanyaan Anda! Berikut respons detail saya.",
  "Itulah jenis pertanyaan yang saya suka eksplorasi bersama pengguna.",
  "Terima kasih atas percakapan yang menarik! Saya menikmati obrolan kita.",
];

const conversationalResponses = [
  "Saya baik-baik saja, terima kasih sudah bertanya! Bagaimana kabar Anda hari ini?",
  "Kedengarannya sangat menarik! Bisakah Anda ceritakan lebih banyak tentang hal itu?",
  "Saya sangat memahami perspektif Anda tentang masalah tersebut.",
  "Itu cara yang bagus untuk memikirkannya! Saya belum mempertimbangkan sudut pandang itu.",
  "Anda benar sekali tentang hal itu. Ini pertimbangan yang penting.",
  "Saya menghargai Anda berbagi pemikiran dengan saya. Sangat insightful!",
  "Itu topik yang kompleks dengan banyak sudut pandang berbeda untuk dipertimbangkan.",
  "Saya juga merasa topik itu menarik! Ada begitu banyak hal untuk dieksplorasi.",
  "Pertanyaan Anda benar-benar membuat saya berpikir mendalam tentang subjek tersebut.",
  "Saya suka bagaimana Anda mendekati masalah ini. Pemikiran yang sangat kreatif!",
];

function getRandomResponse(input: string): string {
  // Simple keyword-based responses for more realistic interaction
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
    return "Halo! Senang bertemu dengan Anda. Saya Mikasa, asisten AI yang siap membantu. Ada yang ingin Anda bicarakan?";
  }
  
  if (lowerInput.includes('halo') || lowerInput.includes('hai') || lowerInput.includes('selamat')) {
    return "Halo! Senang bertemu dengan Anda. Saya Mikasa, asisten AI yang siap membantu. Ada yang bisa saya bantu hari ini?";
  }
  
  if (lowerInput.includes('who are you') || lowerInput.includes('what are you')) {
    return "Saya Mikasa, asisten AI yang dibuat untuk membantu Anda dalam berbagai hal. Saya siap membantu dengan pertanya\an atau diskusi apapun!";
  }
  
  if (lowerInput.includes('thank')) {
    return "Sama-sama! Saya senang bisa membantu. Ada hal lain yang ingin Anda tanyakan?";
  }
  
  if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('selamat tinggal')) {
    return "Selamat tinggal! Senang bisa mengobrol dengan Anda. Sampai jumpa lagi!";
  }
  
  // For longer messages, use conversational responses
  if (input.length > 50) {
    return conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
  }
  
  // Default to random responses
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

export async function getMockChatCompletion(messages: Array<{ role: 'user' | 'assistant'; content: string }>) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
  const userInput = lastUserMessage?.content || '';
  
  // Simulate occasional errors for testing error handling
  if (Math.random() < 0.05) { // 5% chance of error
    throw new Error('Mock API error: Simulated network timeout for testing error handling.');
  }
  
  return getRandomResponse(userInput);
}