export default function(io) {
    io.on('connection', (socket) => {
        console.log('A user connected');
        
        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
      
        socket.on('message', (data) => {
          console.log('Message received:', data);
          //emit all message 
          // io.emit('message', data);
          // Emit  all message except sender message
          socket.broadcast.emit('message', data);
        });
      });
      
}