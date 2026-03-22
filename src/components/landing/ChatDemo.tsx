"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, SendHorizontal } from "lucide-react";

const messages = [
  { role: "user" as const, text: "Explain quantum computing in simple terms" },
  {
    role: "bot" as const,
    text: "Imagine a coin spinning in the air — it's both heads and tails at once. That's a qubit. Classical computers use bits (0 or 1), but quantum computers use qubits that can be both simultaneously, letting them solve certain problems exponentially faster.",
  },
  { role: "user" as const, text: "Can you give me an analogy?" },
  {
    role: "bot" as const,
    text: "Think of a maze. A classical computer tries one path at a time. A quantum computer explores all paths simultaneously, finding the exit much faster.",
  },
];

const ChatDemo = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < messages.length) {
      const timeout = setTimeout(() => setVisibleCount((c) => c + 1), 1200);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount]);

  return (
    <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden glow-md">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/50 px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
        </div>
        <span className="ml-2 text-xs text-muted-foreground font-medium">NovaMind Chat</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 p-5 min-h-[320px]">
        <AnimatePresence>
          {messages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${
                  msg.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div
                className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/50 text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {visibleCount < messages.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-1 py-3 px-4">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border/50 px-5 py-3 flex items-center gap-3">
        <div className="flex-1 rounded-lg bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
          Ask anything...
        </div>
        <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95">
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatDemo;
