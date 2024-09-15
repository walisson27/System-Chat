import io from 'socket.io-client';
import { useState } from 'react';

export default function Join({ setChatVisibility, setSocket, setUsername }) {
  const [username, setUsernameLocal] = useState('');

  const handleJoin = () => {
    if (username.trim()) {
      const socket = io('http://localhost:3001');
      socket.emit('join', username);
      setSocket(socket);
      setUsername(username); // o usuário globalmente
      setChatVisibility(true);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-blue-400 to-cyan-500">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Chat</h2>
        <input
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 mb-4"
          type="text"
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsernameLocal(e.target.value)}
        />
        <button
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          onClick={handleJoin}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
