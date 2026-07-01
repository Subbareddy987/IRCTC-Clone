import { useState } from "react";

import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Namaskaram ! I am Subbu's AI. How can I help you today?",
    },
  ]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setOpen(true)} />

      {open && (
        <ChatWindow
          onClose={() => setOpen(false)}
          message={message}
          setMessage={setMessage}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </>
  );
};

export default ChatBot;
