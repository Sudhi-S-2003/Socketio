import { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserProvider';

// Initialize the socket connection
const socket = io('http://localhost:5000/group');

function GroupChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    socket.emit('login', user.username);

    socket.on('receive_group_message', (data) => {
      const { message, sender, groupName } = data;
      if (groupName === selectedGroup) {
        setMessages((prevMessages) => [...prevMessages, { message, sender }]);
      }
    });

    return () => {
      socket.off('receive_group_message');
    };
  }, [user.username, selectedGroup]);

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      socket.emit('create_group', groupName);
      setGroupName('');
    }
  };

  const handleJoinGroup = () => {
    if (groupName.trim()) {
      socket.emit('join_group', { groupName, username: user.username });
      setSelectedGroup(groupName);
      setGroupName('');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedGroup) {
      socket.emit('send_group_message', {
        groupName: selectedGroup,
        message: newMessage,
        sender: user.username,
      });
      setNewMessage('');
    }
  };

  return (
    <div>
      <h2>Group Chat</h2>
      {selectedGroup ? (
        <div>
          <button onClick={() => setSelectedGroup(null)}>Change Group</button>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender===user.username ?'You' :msg.sender }:</strong> {msg.message}
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
          <div>Create or Join a Group</div>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
          />
          <button onClick={handleCreateGroup}>Create Group</button>
          <button onClick={handleJoinGroup}>Join Group</button>
        </div>
      )}
    </div>
  );
}

export default GroupChat;
