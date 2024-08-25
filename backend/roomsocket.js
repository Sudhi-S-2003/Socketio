import { v4 as uuidv4 } from 'uuid';

const users = {}; 
const messages = []; 

export default function(io) {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user joining
    socket.on('join', (username) => {
      if (username.trim()) {
        users[socket.id] = username;
        console.log(`${username} joined the chat`);

        // Emit previous messages to the new user
        socket.emit('previousMessages', messages);

        // Notify all users of the new user
        socket.broadcast.emit('userJoined', username);
      } else {
        socket.emit('error', 'Invalid username');
      }
    });

    // Handle message sending
    socket.on('message', (message) => {
      const username = users[socket.id];
      if (username && message.trim()) {
        const messageObj = { id: uuidv4(), username, message, timestamp: new Date() };
        messages.push(messageObj);
        io.emit('message', messageObj); // Broadcast to all clients
      } else {
        socket.emit('error', 'Message cannot be empty');
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      const username = users[socket.id];
      if (username) {
        console.log(`${username} disconnected`);
        socket.broadcast.emit('userLeft', username);
        delete users[socket.id];
      }
    });
  });
}
