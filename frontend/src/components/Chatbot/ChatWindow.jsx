import "./ChatBot.css";

import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatWindow = ({
  onClose,
  message,
  setMessage,
  messages,
  setMessages,
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

      <ChatMessages messages={messages} />
      <ChatInput
        message={message}
        setMessage={setMessage}
        messages={messages}
        setMessages={setMessages}
      />
    </section>
  );
};

export default ChatWindow;
