import  { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserProvider';

// Initialize the socket connection
const socket = io('http://localhost:5000/public');

function Public() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    
    socket.on('receive_public_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    
    return () => {
      socket.off('receive_public_message');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_public_message',{user:user.username,message: newMessage});
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Public Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>  <strong>{msg.user}:</strong> {msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default Public;
