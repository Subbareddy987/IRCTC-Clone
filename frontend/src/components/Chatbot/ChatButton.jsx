import "./ChatBot.css";

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick} aria-label="Open chat">
      AI
    </button>
  );
};

export default ChatButton;
