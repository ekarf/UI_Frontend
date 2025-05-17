import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    // Add user message to chat
    const userMessage = { sender: 'user', message };
    setChat((prevChat) => [...prevChat, userMessage]);
    
    // Clear input field immediately for better UX
    setMessage('');

    // Send message to Flask backend
    fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then(response => response.json())
      .then(data => {
        // Only add the bot's response, not the user message again
        const botMessage = { sender: 'bot', message: data.response };
        setChat((prevChat) => [...prevChat, botMessage]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key press
      handleSendMessage(); // Send message
    }
  };

  return (
    <div className="App">
      <div className="chatbox">
        <div className="chat-header">
          <h2>Chat with Flask</h2>
        </div>
        <div className="messages">
          {chat.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-content">
                <p><strong>{msg.sender === 'user' ? 'You: ' : 'Bot: '}</strong>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}  // Handle Enter key press
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;