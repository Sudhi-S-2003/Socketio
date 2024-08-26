import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserProvider';

// Initialize the socket connection
const socket = io('http://localhost:5000/private');

function PrivateChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientIn, setRecipientIn] = useState('');
  const [recipient, setRecipient] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Emit login event when user connects
    socket.emit('login', user.username);

    // Listen for incoming private messages
    socket.on('receive_private_message', (data) => {
      const { message, sender } = data;
      setMessages((prevMessages) => [...prevMessages, { message, sender }]);
    });

    return () => {
      socket.off('receive_private_message');
    };
  }, [user.username]);

  const handleSendMessage = () => {
    if (newMessage.trim() && recipient) {
      socket.emit('send_private_message', {
        user: user.username,
        message: newMessage,
        recipient: recipient,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: newMessage, sender: 'You' }, 
      ]);
      setNewMessage('');
    }
  };

  const handleRecipientChange = (e) => {
    setRecipientIn(e.target.value);
  };

  const handleSelectRecipient = () => {
    if (recipientIn.trim()) {
      setRecipient(recipientIn);
      setRecipientIn('');
    }
  };

  return (
    <div>
      <h2>Private Chat</h2>
      {recipient ? (
        <div>
          <button onClick={() => setRecipient(null)}>Change Recipient</button>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
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
      ) : (
        <div>
          <div>Select a recipient</div>
          <input
            type="text"
            value={recipientIn}
            onChange={handleRecipientChange}
            placeholder="Recipient ID"
          />
          <button onClick={handleSelectRecipient}>Set Recipient</button>
        </div>
      )}
    </div>
  );
}

export default PrivateChat;
