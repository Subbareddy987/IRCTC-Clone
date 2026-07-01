import "./ChatBot.css";
import { useEffect, useRef } from "react";

const ChatMessages = ({ messages, isTyping, onAction }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages" aria-live="polite">
      {messages.map((msg, index) => (
        <div
          key={`${msg.sender}-${index}`}
          className={msg.sender === "user" ? "user-message" : "bot-message"}
        >
          <p>{msg.text}</p>

          {msg.action && (
            <button
              className="chat-action-btn"
              onClick={() => onAction(msg.action, msg.payload)}
            >
              {msg.action}
            </button>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="bot-message typing-message">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
