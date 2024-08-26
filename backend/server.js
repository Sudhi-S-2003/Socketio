import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import basicconnection from './basicconnection.js';
import roomsocket from './roomsocket.js';
import PublicChat from './chat/PublicChat.js';
import { Socket } from 'dgram';
import HistotyPublicChat from './chat/HistotyPublicChat.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', 
      methods: ['GET', 'POST']
    }
  });
  


app.get('/', (req, res) => {
  res.send('Socket io ');
});
//basic connection
// basicconnection(io)
//basic room connection
// roomsocket(io)
//public message
const publicNamespace = io.of('/public');
PublicChat(publicNamespace)
const historypublicNamespace = io.of('/historypublic');
HistotyPublicChat(historypublicNamespace)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
