let messageHistory = [];
function HistotyPublicChat(io) {
    io.on('connection', (socket) => {
        socket.emit('receive_message_history', messageHistory);
        socket.on('send_public_message',(data)=>{
            messageHistory.push(data);
            io.emit('receive_public_message',data);
        })
    })
    
}

export default HistotyPublicChat
