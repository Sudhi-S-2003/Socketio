import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import './style.css'
const socket = io('http://localhost:5000'); 
const SocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMessage = (data) => {
      console.log('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (message.trim()) {
      console.log('Sending message:', message);
      socket.emit('message', message);
      setMessage('');
    }
  }, [message]);

  return (
    <div className='message-box'>
      <div className='message-content-box'>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SocketComponent;
