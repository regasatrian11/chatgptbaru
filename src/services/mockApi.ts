// Mock API responses for testing
const mockResponses = [
  "Halo! Saya Mikasa, asisten AI yang siap membantu kamu. Ada yang bisa saya bantu hari ini?",
  "Pertanyaan yang menarik nih! Mari saya pikirkan sejenak untuk memberikan jawaban terbaik ya...",
  "Saya paham apa yang kamu tanyakan. Berikut perspektif saya tentang topik tersebut.",
  "Poin yang bagus! Saya dengan senang hati akan menjelaskan lebih detail tentang hal itu.",
  "Terima kasih sudah berbagi dengan saya. Ini cukup menarik untuk dibahas nih.",
  "Saya paham maksud kamu. Mari saya berikan beberapa wawasan tambahan ya.",
  "Pertanyaan yang sangat bagus! Saya senang kamu menanyakan hal tersebut.",
  "Saya menghargai rasa ingin tahu kamu. Berikut pendapat saya tentang masalah itu.",
  "Observasi yang sangat baik! Kamu sudah menyentuh sesuatu yang sangat penting.",
  "Saya di sini untuk membantu kok! Mari saya berikan jawaban yang lengkap.",
  "Itu mengingatkan saya pada konsep menarik yang ingin saya bagikan dengan kamu.",
  "Kamu sudah mengangkat poin yang sangat bagus. Saya ingin mengembangkan ide tersebut.",
  "Saya terkesan dengan pertanyaan kamu! Berikut respons detail saya.",
  "Itulah jenis pertanyaan yang saya suka eksplorasi bareng pengguna.",
  "Terima kasih atas percakapan yang menarik! Saya menikmati obrolan kita.",
];

const conversationalResponses = [
  "Saya baik-baik saja, terima kasih sudah bertanya! Bagaimana kabar kamu hari ini?",
  "Kedengarannya sangat menarik! Bisa ceritakan lebih banyak tentang hal itu?",
  "Saya sangat memahami perspektif kamu tentang masalah tersebut.",
  "Itu cara yang bagus untuk memikirkannya! Saya belum mempertimbangkan sudut pandang itu.",
  "Kamu benar sekali tentang hal itu. Ini pertimbangan yang penting.",
  "Saya menghargai kamu berbagi pemikiran dengan saya. Sangat menarik!",
  "Itu topik yang kompleks dengan banyak sudut pandang berbeda untuk dipertimbangkan.",
  "Saya juga merasa topik itu menarik! Ada begitu banyak hal untuk dieksplorasi.",
  "Pertanyaan kamu benar-benar membuat saya berpikir mendalam tentang subjek tersebut.",
  "Saya suka bagaimana kamu mendekati masalah ini. Pemikiran yang sangat kreatif!",
];

function getRandomResponse(input: string): string {
  // Simple keyword-based responses for more realistic interaction
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || lowerInput.includes('halo') || lowerInput.includes('hai')) {
    return "Halo! Senang bertemu dengan kamu. Saya Mikasa, asisten AI yang siap membantu. Ada yang ingin kamu obrolin?";
  }
  
  if (lowerInput.includes('how are you') || lowerInput.includes('how do you do') || lowerInput.includes('apa kabar') || lowerInput.includes('gimana kabar')) {
    return "Saya baik-baik saja, terima kasih sudah bertanya! Sebagai AI, saya selalu siap untuk ngobrol dan membantu kamu. Gimana kabar kamu hari ini?";
  }
  
  if ((lowerInput.includes('what') && lowerInput.includes('name')) || (lowerInput.includes('siapa') && lowerInput.includes('nama'))) {
    return "Saya Mikasa, asisten AI yang dibuat untuk membantu kamu! Siapa nama kamu?";
  }
  
  if (lowerInput.includes('thank') || lowerInput.includes('terima kasih') || lowerInput.includes('makasih')) {
    return "Sama-sama! Saya senang bisa membantu kamu. Ada hal lain yang ingin kamu coba?";
  }
  
  if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('dadah') || lowerInput.includes('sampai jumpa')) {
    return "Dadah! Senang bisa ngobrol dengan kamu. Terima kasih sudah mencoba aplikasi ini!";
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
  
  // Get the last user message
  const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
  const userInput = lastUserMessage?.content || '';
  
  // Simulate occasional errors for testing error handling
  if (Math.random() < 0.05) { // 5% chance of error
    throw new Error('Mock API error: Simulated network timeout for testing error handling.');
  }
  
  return getRandomResponse(userInput);
}