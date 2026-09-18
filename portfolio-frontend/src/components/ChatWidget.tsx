"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X, Bot } from "lucide-react";
import { api, type ChatTurn } from "@/lib/api";

const SUGGESTIONS = [
  "Does she know FastAPI?",
  "Tell me about her AI projects",
  "What's her experience?",
  "Is she open to work?",
];

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState<Record<number, string>>({});
  const [hasNudge, setHasNudge] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, displayedText]);

  function typeOut(index: number, fullText: string) {
    let i = 0;
    function step() {
      i += 2;
      setDisplayedText((prev) => ({ ...prev, [index]: fullText.slice(0, i) }));
      if (i < fullText.length) setTimeout(step, 12);
    }
    step();
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setHasNudge(false);
    const nextMessages: ChatTurn[] = [...messages, { role: "user", text: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await api.askChatbot(question, nextMessages.slice(-6));
      setMessages((prev) => {
        const updated = [...prev, { role: "assistant" as const, text: data.reply }];
        typeOut(updated.length - 1, data.reply);
        return updated;
      });
    } catch (err) {
      const fallback = err instanceof Error ? err.message : "Something went wrong — please try again.";
      setMessages((prev) => {
        const updated = [...prev, { role: "assistant" as const, text: fallback }];
        typeOut(updated.length - 1, fallback);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {open ? (
                <div className="fixed bottom-24 right-6 z-40 w-88 max-w-[calc(100vw-3rem)] h-120 max-h-[70vh] card p-0 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center">
                <Bot size={16} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Zee</p>
                <p className="text-[10px] text-text-muted leading-tight">Grounded in her real data — I don&apos;t guess.</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="p-1.5 rounded-full hover:bg-bg-soft text-text-muted hover:text-text transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 arch-scroll">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-text-muted">
                  Hi, I&apos;m Zee 👋 Ask me anything about Zunaira&apos;s projects, skills, or experience — I&apos;ll only answer from what&apos;s actually in her portfolio.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "bg-bg-soft border border-border rounded-bl-sm"
                  }`}
                >
                  {m.role === "assistant" ? displayedText[i] ?? m.text : m.text}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="bg-bg-soft border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" />
                </div>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-border"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about her projects, skills..."
              maxLength={400}
              className="flex-1 px-3 py-2 rounded-lg bg-bg-soft border border-border focus:border-accent outline-none text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="p-2.5 rounded-lg bg-accent text-white disabled:opacity-40 hover:bg-accent-hover transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask about Zunaira"
          className="fixed bottom-24 right-6 z-40 p-3.5 rounded-full text-white transition-all hover:scale-110"
          style={{
            background: "var(--color-accent)",
            boxShadow: "0 8px 24px color-mix(in srgb, var(--color-accent) 55%, transparent)",
          }}
        >
          <MessageCircle size={20} />
          {hasNudge ? (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
          ) : null}
        </button>
      ) : null}
    </>
  );
}