"use client"; // needed because this page uses useState (it runs in the browser)

import { useState } from "react";
import "./askadvice.css";

export default function AskAdvice() {
  // list of all messages in the chat
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your AI finance assistant. Ask me anything about your money." },
  ]);

  // what the user is typing in the input box
  const [input, setInput] = useState("");

  // true while we wait for the answer
  const [loading, setLoading] = useState(false);

  // runs when the user clicks Send (or a question button)
  async function sendMessage(question: string) {
    if (question === "") {
      return;
    }

    // show the user's message in the chat
    const newMessages = [...messages, { sender: "user", text: question }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // send the question to our backend (app/api/chat/route.ts)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question }),
    });
    const data = await response.json();

    // show the bot's answer in the chat
    setMessages([...newMessages, { sender: "bot", text: data.answer }]);
    setLoading(false);
  }

  return (
    <div className="chat-page">
      <h1>Ask Advice - AI Chatbot</h1>

      {/* chat messages */}
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === "user" ? "message user-message" : "message bot-message"}>
            {message.text}
          </div>
        ))}

        {loading && <div className="message bot-message">Thinking...</div>}
      </div>

      {/* example questions */}
      <div className="suggestions">
        <button onClick={() => sendMessage("How much did I spend?")}>How much did I spend?</button>
        <button onClick={() => sendMessage("How much should I save?")}>How much should I save?</button>
        <button onClick={() => sendMessage("Are my subscriptions too much?")}>Are my subscriptions too much?</button>
        <button onClick={() => sendMessage("Make me a budget")}>Make me a budget</button>
      </div>

      {/* input box and send button */}
      <div className="chat-form">
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
}