import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'http';
import { faker } from '@faker-js/faker';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    console.log('Setting up socket');
    const httpServer: Server = res.socket.server as any;
    const io = new IOServer(httpServer);

    io.on('connection', (socket) => {
      console.log('User connected', socket.id);

      const intervalId = setInterval(() => {
        const randomMessage = faker.hacker.phrase(); 
        const randomUser = faker.internet.userName(); 
        io.emit('message', `${randomUser}: ${randomMessage}`);
      }, 10000);

      socket.on('message', (msg) => {
        io.emit('message', msg);
      });

      socket.on('disconnect', () => {
        clearInterval(intervalId);
        console.log('User disconnected', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
