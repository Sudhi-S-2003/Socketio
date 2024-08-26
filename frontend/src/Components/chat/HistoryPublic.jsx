
import  { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserProvider';

function HistoryPublic() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useContext(UserContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io('http://localhost:5000/historypublic'); 
    setSocket(socketInstance);

    // Listen for historical messages
    socketInstance.on('receive_message_history', (history) => {
      setMessages(history);
    });

    // Listen for incoming messages
    socketInstance.on('receive_public_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle errors
    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('send_public_message', { user: user.username, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>history Public Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
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

export default HistoryPublic;
