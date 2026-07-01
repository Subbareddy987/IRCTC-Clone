import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

const ChatMessages = ({ messages }) => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    switch (action) {
      case "Search Trains":
        navigate("/trains/search");
        break;
      case "My Bookings":
        navigate("/mybookings");
        break;
      case "PNR Status":
        navigate("/pnr-search");
        break;
      case "Order Food":
        navigate("/food-selection");
        break;
      case "Payment":
        navigate("/payment");
        break;
      case "Home":
        navigate("/home");
        break;
      case "About Developer":
        navigate("/about-developer");
        break;
      default:
        break;
    }
  };

  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={msg.sender === "user" ? "user-message" : "bot-message"}
        >
          <p>{msg.text}</p>

          {msg.action && (
            <button
              className="chat-action-btn"
              onClick={() => handleAction(msg.action)}
            >
              {msg.action}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
