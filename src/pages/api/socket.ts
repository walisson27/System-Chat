import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const httpServer = res.socket as any;

  if (!httpServer.server.io) {
    console.log('Setting up socket');

    const io = new IOServer(httpServer.server, {
      cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
      },
    });
    httpServer.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected', socket.id);

      //  mensagens simuladas a cada 10 segundos
      const intervalId = setInterval(() => {
        const randomMessage = faker.hacker.phrase(); 
        const randomUser = faker.internet.userName(); 
        io.emit('message', { text: randomMessage, senderName: randomUser });
      }, 10000);

      // mensagem e o nome do usuário
      socket.on('message', (msg) => {
        io.emit('message', { text: msg.text, senderName: msg.senderName });
      });

      socket.on('disconnect', () => {
        clearInterval(intervalId);
        console.log('User disconnected', socket.id);
      });
    });
  } else {
    console.log('Socket.io já está configurado.');
  }

  res.end();
};

export default SocketHandler;
