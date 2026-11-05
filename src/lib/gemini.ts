import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export const getGeminiClient = () => {
  if (!aiInstance) {
    // Uses VITE_GEMINI_API_KEY if present or default environment key
    aiInstance = new GoogleGenAI();
  }
  return aiInstance;
};

export interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor' | 'system';
  text: string;
  timestamp: string;
}

export const askTutorAI = async (
  prompt: string, 
  courseContext: string, 
  history: ChatMessage[]
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    const formattedHistory = history.slice(-6).map(m => ({
      role: m.sender === 'student' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const systemInstruction = `Eres el Tutor Inteligente Oficial de Punta Cana Academy, la academia híbrida de formación en idiomas y habilidades del futuro en Friusa, Punta Cana. 
Tu rol es orientar a los estudiantes con respuestas claras, motivadoras, didácticas y en español caribeño profesional. 
Contexto del curso actual: ${courseContext}.
Explica de manera concisa (máximo 2 párrafos) y añade siempre un consejo o ejemplo práctico.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || 'No pude procesar la respuesta en este momento. Intenta de nuevo.';
  } catch (err: any) {
    console.warn('Gemini tutor fallback:', err);
    return `¡Excelente pregunta sobre ${courseContext}! En Punta Cana Academy recomendamos repasar los conceptos fundamentales de esta unidad y ponerlos en práctica en la sesión de ejercicios. Si tienes dudas adicionales, puedes consultarle también al docente titular en la clase en vivo.`;
  }
};
