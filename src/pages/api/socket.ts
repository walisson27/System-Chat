import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { faker } from '@faker-js/faker';

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const httpServer = res.socket as any; 

  if (!httpServer.server.io) {
    console.log('Setting up socket');

    const io = new IOServer(httpServer.server);

    httpServer.server.io = io;

    io.on('connection', (socket) => {
      console.log('User connected', socket.id);

      // Simular mensagens aleatórias a cada 10 segundos
      const intervalId = setInterval(() => {
        const randomMessage = faker.hacker.phrase(); // Mensagem aleatória
        const randomUser = faker.internet.userName(); // Nome de usuário aleatório
        io.emit('message', `${randomUser}: ${randomMessage}`);
      }, 10000);

      // Receber mensagem do cliente e emitir para todos os outros
      socket.on('message', (msg) => {
        io.emit('message', msg);
      });

      // Limpar quando o usuário desconectar
      socket.on('disconnect', () => {
        clearInterval(intervalId);
        console.log('User disconnected', socket.id);
      });
    });
  } else {
    console.log('Socket.io já está configurado.');
  }

  // Finalizar a resposta para a API
  res.end();
};

export default SocketHandler;
