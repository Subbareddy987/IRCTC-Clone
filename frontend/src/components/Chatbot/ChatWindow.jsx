import { quickActions } from "../../data/ChatResponse.js";
import "./ChatBot.css";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatWindow = ({
  onClose,
  message,
  setMessage,
  messages,
  isTyping,
  onSendMessage,
  onAction,
}) => {
  return (
    <section className="chat-window" aria-label="RailMate AI chat">
      <div className="chat-header">
        <div>
          <p>Subbu's IRCTC AI</p>
          <span>Online railway assistant</span>
        </div>

        <button className="close-btn" onClick={onClose} aria-label="Close chat">
          x
        </button>
      </div>

      <div className="quick-actions" aria-label="Quick chat actions">
        {quickActions.map((action) => (
          <button key={action} type="button" onClick={() => onAction(action)}>
            {action}
          </button>
        ))}
      </div>

      <ChatMessages messages={messages} isTyping={isTyping} onAction={onAction} />
      <ChatInput
        message={message}
        setMessage={setMessage}
        isTyping={isTyping}
        onSendMessage={onSendMessage}
      />
    </section>
  );
};

export default ChatWindow;
