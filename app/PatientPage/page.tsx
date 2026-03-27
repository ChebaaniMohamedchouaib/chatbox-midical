"use client";
import { useState, useRef, useEffect } from "react";
import "./globals.css";
type Message = { id: number; text: string; sender: string; severity?: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Describe your symptoms, and I will try to help you.", sender: "them" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { id: Date.now(), text: input, sender: "me" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      
      const data = await res.json();
      let botReplyText = "";
      let severityClass = ""; 

      if (data.type === "question") {
        botReplyText = data.text;
      } else if (data.type === "diagnosis" && data.disease) {
        const { name, common_name, severity, symptoms } = data.disease;
        
        const symptomsList = symptoms.join("، ");

        botReplyText = `Diagnosis Alert:\nBased on your symptoms, this matches: **${name}** (${common_name}).\n\n📌 Matched Symptoms: ${symptomsList}\n\n⚠️ Severity: ${severity}\n\nPlease seek professional medical care.`;
        
        severityClass = severity.toLowerCase();
      } else {
        botReplyText = "I couldn't process the diagnosis. Please try again.";
      }

      setMessages((prev) => [
        ...prev, 
        { id: Date.now() + 1, text: botReplyText, sender: "them", severity: severityClass }
      ]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { id: Date.now(), text: "Connection error.", sender: "them" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <strong>Cardiology Assistant</strong>
      </div>

      <div className="messageBox">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`bubble ${msg.sender === "me" ? "me" : "them"} ${msg.severity || ""}`}
            style={{ whiteSpace: "pre-wrap" }} 
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="bubble them" style={{ opacity: 0.7 }}>
            Doctor is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form className="inputArea" onSubmit={sendMessage}>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer or symptoms..."
          disabled={isLoading}
        />
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? " wait..." : "send"}
        </button>
      </form>
    </div>
  );

}