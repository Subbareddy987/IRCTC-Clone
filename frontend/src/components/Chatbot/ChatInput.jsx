import "./ChatBot.css";

const ChatInput = ({ message, setMessage, isTyping, onSendMessage }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSendMessage();
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask about trains, PNR, food..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit" disabled={isTyping} aria-label="Send message">
        Go
      </button>
    </form>
  );
};

export default ChatInput;
