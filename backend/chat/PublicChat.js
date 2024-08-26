function PublicChat(io) {
    io.on('connection', (socket) => {
        socket.on('send_public_message',(data)=>{
            io.emit('receive_public_message',data);
        })
    })
    
}

export default PublicChat
