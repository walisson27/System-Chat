const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "https://system-chat-new.vercel.app/", 
  }
})

const PORT = process.env.PORT || 3001


app.get("/", (req, res) => {
  res.send("Servidor Socket.io rodando 🚀")
})

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id)

  socket.on('disconnect', (reason) => {
    console.log('Usuário desconectado!', socket.id)
  })

  socket.on('set_username', (username) => {
    socket.data.username = username
  })

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || "Anônimo"
    })
  })
})

server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
