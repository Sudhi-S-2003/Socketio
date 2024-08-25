import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import './chatcss.css'; 

const socket = io('http://localhost:5000');

const RoomMessage = function() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handlePreviousMessages = (data) => {
      setMessages(data);
    };

    const handleUserJoined = (username) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), username: 'System', message: `${username} joined the chat`, timestamp: new Date() }]);
    };

    const handleUserLeft = (username) => {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now(), username: 'System', message: `${username} left the chat`, timestamp: new Date() }]);
    };

    socket.on('message', handleMessage);
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('message', handleMessage);
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
    };
  }, []);

  const handleJoin = useCallback(() => {
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
      setError('');
    } else {
      setError('Username cannot be empty');
    }
  }, [username]);

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      socket.emit('message', message);
      setMessage('');
      setError('');
    } else {
      setError('Message cannot be empty');
    }
  }, [message]);

  return (
    <div className='chat-container'>
      {!isJoined ? (
        <div className='join-container'>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button onClick={handleJoin}>Join Chat</button>
          {error && <p className='error-message'>{error}</p>}
        </div>
      ) : (
        <div className='chat-box'>
          <div className='message-content-box'>
            <h2>Chat Messages</h2>
            <ul>
              {messages.map((msg) => (
                <li key={msg.id}>
                  <strong>{msg.username}:</strong> {msg.message}
                  <span className='timestamp'>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={sendMessage}>Send</button>
          {error && <p className='error-message'>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default RoomMessage;
