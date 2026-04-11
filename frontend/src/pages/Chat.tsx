import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };

    // ✅ Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      // ✅ FIXED API URL
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      console.log("🤖 AI RESPONSE:", data);

      const aiMessage: Message = {
        role: "ai",
        text: data.reply || "No response",
      };

      // ✅ Append AI message
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("❌ Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error contacting AI server" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-zinc-900 rounded p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded max-w-xl ${
              m.role === "user"
                ? "bg-blue-600 self-end ml-auto"
                : "bg-zinc-800"
            }`}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="bg-zinc-800 p-3 rounded w-fit">
            🤖 AI is typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(); // ✅ Enter key support
          }}
          placeholder="Ask about soldier health, risks, alerts..."
          className="flex-1 p-3 rounded bg-zinc-800 text-white outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-5 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}