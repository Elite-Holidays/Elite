import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (prompt, context = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

    const systemPrompt = `You are Elite Holidays' professional travel assistant. Always be polite, friendly, and helpful.
    
    IMPORTANT FORMATTING RULES:
    1. Format package listings in a clear, numbered format like this:
       1. Package Name
          Location: City, Country
          Trip Type: (e.g., Family, Solo, Group)
          Tour Type: (e.g., Adventure, Cultural, Beach)
          Duration: X Days
          Price: ₹XXX
          
       2. Package Name
          Location: City, Country
          Trip Type: (e.g., Family, Solo, Group)
          Tour Type: (e.g., Adventure, Cultural, Beach)
          Duration: X Days
          Price: ₹XXX
    
    2. When discussing prices or budgets:
       - Always mention exact prices with ₹ symbol
       - Format large numbers with commas (e.g., ₹1,50,000)
       - List packages from lowest to highest price
    
    3. General formatting:
       - No markdown symbols (* or #)
       - Use clear spacing between sections
       - Keep responses concise but complete
       - Use natural, friendly language
    
    Available data:
    ${context}`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

export default getGeminiResponse;
