const privateChat = (io) => {
    // Store the mapping between usernames and socket IDs
    const userSocketMap = new Map();
  
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
  
      // When a user logs in, store their username and socket ID
      socket.on('login', (username) => {
        userSocketMap.set(username, socket.id);
        console.log(`User ${username} logged in with socket ID ${socket.id}`);
      });
  
      // Listen for private messages
      socket.on('send_private_message', (data) => {
        const { user, recipient, message } = data;
        
        // Validate input
        if (recipient && message) {
          const recipientSocketId = userSocketMap.get(recipient);
          
          if (recipientSocketId) {
            // Emit the message to the recipient's socket ID
            io.to(recipientSocketId).emit('receive_private_message', {
              message,
              sender: user, // Send the sender's username
            });
            console.log(`Message sent from ${user} to ${recipient}`);
          } else {
            console.error(`Recipient ${recipient} not found`);
          }
        } else {
          console.error('Recipient or message missing');
        }
      });
  
      // Handle user disconnection
      socket.on('disconnect', () => {
        // Remove the disconnected user from the map
        for (let [username, socketId] of userSocketMap) {
          if (socketId === socket.id) {
            userSocketMap.delete(username);
            console.log(`User ${username} disconnected`);
            break;
          }
        }
        console.log('A user disconnected:', socket.id);
      });
    });
  };
  
  export default privateChat;
  