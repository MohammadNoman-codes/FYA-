import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../../services/api'; // Import the API function
import './Chatbot.css'; // We'll create this CSS file next

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! How can I help you learn today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // To scroll to the bottom

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    // Send message to backend and get reply
    const response = await sendChatMessage(userMessage);
    setIsLoading(false);

    // Add bot reply to chat
    const botReply = response.success ? response.reply : response.message;
    setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-button" onClick={toggleChat}>
        {isOpen ? 'X' : 'Chat'} {/* Simple toggle icon/text */}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            Naffeth Assistant
            <button className="chatbot-close-button" onClick={toggleChat}>X</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <p>...</p> {/* Simple loading indicator */}
              </div>
            )}
            {/* Dummy div to help scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
