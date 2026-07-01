import { chatResponses } from "../../data/ChatResponse.js";
import "./ChatBot.css";

const ChatInput = ({ message, setMessage, messages, setMessages }) => {
  const getBotReply = (text) => {
    const lowerMessage = text.toLowerCase();

    const response = chatResponses.find((item) =>
      item.keywords.some((keyword) => lowerMessage.includes(keyword)),
    );

    if (response) {
      return {
        text: response.reply,
        action: response.action,
      };
    }

    return {
      text: "I am not fully sure, but I can help with train search, seat selection, bookings, PNR status, food ordering and payment. Try asking in simple words like 'how to select seats' or 'check my PNR'.",
      action: null,
    };
  };

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: message,
    };
    const reply = getBotReply(message);
    const botMessage = {
      sender: "bot",
      text: reply.text,
      action: reply.action,
    };

    setMessages([...messages, userMessage, botMessage]);
    setMessage("");
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Ask Anything..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
      <button
        className="chat-send-btn"
        onClick={sendMessage}
        aria-label="Send message"
      >
        <span className="railway-send-icon" aria-hidden="true">
          <span className="railway-track" />
        </span>
      </button>
    </div>
  );
};

export default ChatInput;
