const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "https://system-chat-5.onrender.com/", 
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Servidor Socket.io rodando 🚀");
});

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuário desconectado!', socket.id);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || "Anônimo"
    });
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
