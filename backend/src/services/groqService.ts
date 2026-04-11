import fetch from "node-fetch";

type GroqResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

export async function groqChat(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY missing in .env");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a professional military medical AI assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    }),
  });

  const data = (await response.json()) as GroqResponse;

  return data.choices?.[0]?.message?.content || "No AI response";
}
