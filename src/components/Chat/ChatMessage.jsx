import React from "react";

const ChatMessage = ({ text, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? "user-message" : "bot-message"}`}>
      {text}
    </div>
  );
};

export default ChatMessage;
