import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import InputBox from "./InputBox";
import { queryApi } from "../../services/api";
import './styles.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    const newMessage = { text: message, isUser: true };
    setMessages([...messages, newMessage]);

    try {
      const data = await queryApi(message)
      console.log("data", data);
      console.log("data type of data", typeof(data));
      const botMessageText =
        data.answer?.length > 0
          ? data.answer
          : "Sorry, I couldn't understand your request or the response is missing.";

      const botMessage = { text: botMessageText, isUser: false };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "There was an error processing your request.", isUser: false },
      ]);
      console.error("Error:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} text={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <InputBox onSend={handleSendMessage} />
    </div>
  );
};

export default ChatBox;
