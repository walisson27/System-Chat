const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://system-chat-new.vercel.app", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Servidor Socket.io rodando 🚀");
});

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);

  socket.on('join', (username) => {
    socket.data.username = username;
    console.log(`Usuário ${username} entrou com ID: ${socket.id}`);
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || "Anônimo"
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado!', socket.id);
  });
});

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
