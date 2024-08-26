const groupChat = (io) => {
    const userSocketMap = new Map(); // Maps usernames to socket IDs
    const groupSocketMap = new Map(); // Maps group names to sets of socket IDs
  
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
  
      // Handle user login
      socket.on('login', (username) => {
        userSocketMap.set(username, socket.id);
        console.log(`User ${username} logged in with socket ID ${socket.id}`);
      });
  
      // Handle group creation
      socket.on('create_group', (groupName) => {
        if (!groupSocketMap.has(groupName)) {
          groupSocketMap.set(groupName, new Set());
          console.log(`Group ${groupName} created`);
        } else {
          console.error(`Group ${groupName} already exists`);
        }
      });
  
      // Handle joining a group
      socket.on('join_group', ({ groupName, username }) => {
        if (groupSocketMap.has(groupName)) {
          groupSocketMap.get(groupName).add(socket.id);
          console.log(`User ${username} joined group ${groupName}`);
        } else {
          console.error(`Group ${groupName} does not exist`);
        }
      });
  
      // Handle sending a group message
      socket.on('send_group_message', ({ groupName, message, sender }) => {
        if (groupSocketMap.has(groupName)) {
          groupSocketMap.get(groupName).forEach((socketId) => {
            io.to(socketId).emit('receive_group_message', {
              message,
              sender,
              groupName,
            });
          });
          console.log(`Message sent to group ${groupName} from ${sender}`);
        } else {
          console.error(`Group ${groupName} does not exist`);
        }
      });
  
      // Handle user disconnection
      socket.on('disconnect', () => {
        for (let [username, socketId] of userSocketMap) {
          if (socketId === socket.id) {
            userSocketMap.delete(username);
            console.log(`User ${username} disconnected`);
            break;
          }
        }
        for (let [groupName, sockets] of groupSocketMap) {
          sockets.delete(socket.id);
        }
        console.log('A user disconnected:', socket.id);
      });
    });
  };
  
  export default groupChat;
  