import OpenAI from "openai";

const openrouter = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are SwapGamers AI, a helpful assistant for a game swapping and trading app based in Ghana. 
Your role is to help users with:
- Game swapping and trading
- Purchasing gaming accessories (controllers, headsets, etc.)
- Community features and finding other gamers
- Navigating the app features

Available payment methods: MTN MoMo and Telecel Cash
App tabs: Home, Swap, Shop, Community, Profile, Assist

Be friendly, helpful, and keep responses concise and relevant to gaming/swapping topics.`;

export const generateAIResponse = async (
  userMessage: string,
  chatHistory?: { role: string; content: string }[]
): Promise<string> => {
  try {
    if (!process.env.EXPO_PUBLIC_OPENROUTER_API_KEY) {
      console.warn("OpenRouter API key not found in environment variables");
      return "I'm having trouble connecting to my AI services. Please check if the API key is configured properly.";
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(chatHistory?.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })) || []),
      { role: "user", content: userMessage },
    ];

    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3-5-haiku",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I couldn't generate a response. Please try again."
    );
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return "I'm having trouble connecting right now. Please try again in a moment. For immediate help, you can explore the Swap tab for game exchanges or the Shop tab for accessories.";
  }
};