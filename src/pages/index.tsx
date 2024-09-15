import { useState } from 'react';
import { ChatWindow } from '../components/ChatWindow';
import Join from '../components/Join/Join';
import '../../i18.ts';

const Home = () => {
  const [chatVisible, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState<any>(null); 
  const [username, setUsername] = useState('');

  return (
    <div className="h-screen">
      {chatVisible ? (
        <ChatWindow socket={socket} username={username} />
      ) : (
        <Join
          setChatVisibility={setChatVisibility}
          setSocket={setSocket}
          setUsername={setUsername}
        />
      )}
    </div>
  );
};

export default Home;
