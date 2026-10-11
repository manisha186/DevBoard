
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import "./Astro.css";

export default function Astro() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "astro",
      text: "Hey Broooo, space explorer!!!!!!!! I'm Astro, your DevBoard AI assistant. How can I help you today??",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(event) {
    event.preventDefault();

    const question = input.trim();
    if (!question || isLoading) return;

    setInput("");
    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to DevBoard to chat with Astro.");
      }

      const response = await fetch(
        "http://localhost:8080/api/astro/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Your session may have expired. Please log in again.");
        }
        throw new Error(`Astro couldn't respond (HTTP ${response.status}).`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "astro",
          text: data.answer || "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "astro",
          text: `Oops, space explorer! ${error.message || "Something went wrong."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="astro-widget">
      {isOpen && (
        <div className="astro-panel">
          <div className="astro-header">
            <div className="astro-avatar">
              <Bot size={25} />
            </div>

            <div className="astro-title">
              <h3>Astro AI</h3>
              <span>
                <span className="astro-status-dot"></span>
                Your DevBoard companion
              </span>
            </div>

            <button
              type="button"
              className="astro-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Astro chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="astro-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`astro-message ${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {isLoading && (
              <div className="astro-message astro astro-typing">
                Astro is thinking
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="astro-prompts">
            <button
              type="button"
              onClick={() =>
                setInput("How can you help me with DevBoard?")
              }
            >
              <Sparkles size={13} /> Help me get started
            </button>
          </div>

          <form className="astro-input-area" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Astro anything..."
              aria-label="Message Astro"
              disabled={isLoading}
            />

            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="astro-launcher"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close Astro" : "Open Astro"}
      >
        {isOpen ? (
          <X size={25} />
        ) : (
          <span className="astro-character">🧑‍🚀</span>
        )}

        
      </button>
    </div>
  );
}
