import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_OPENAI_API_KEY || "",
);

export const generateAIResponse = async (
  userMessage: string,
  chatHistory?: { role: string; content: string }[],
) => {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      console.warn("Gemini API key not found in environment variables");
      return "I'm having trouble connecting to my AI services. Please check if the API key is configured properly.";
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const context = `You are SwapGamers AI, a helpful assistant for a game swapping and trading app. 
    Your role is to help users with:
    - Game swapping and trading
    - Purchasing gaming accessories (controllers, headsets, etc.)
    - Community features and finding other gamers
    - Navigating the app features
    
    Available payment methods: MTN MoMo and Telecel Cash
    App tabs: Home, Swap, Shop, Community, Profile, Assist
    
    Be friendly, helpful, and keep responses concise and relevant to gaming/swapping topics.`;

    const prompt = `${context}\n\nUser: ${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment. For immediate help, you can explore the Swap tab for game exchanges or the Shop tab for accessories.";
  }
};

export const initializeChat = () => {
  try {
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      console.warn("Gemini API key not found in environment variables");
      return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });
  } catch (error) {
    console.error("Error initializing chat:", error);
    return null;
  }
};
