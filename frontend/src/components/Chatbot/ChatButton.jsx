import "./ChatBot.css";

const ChatButton = ({ onClick }) => {
  return (
    <button className="chat-button" onClick={onClick} aria-label="Open chat">
      <span className="chat-button-icon" aria-hidden="true">
        <span className="chat-button-antenna" />
        <span className="chat-button-eyes" />
        <span className="chat-button-rail" />
      </span>
    </button>
  );
};

export default ChatButton;
