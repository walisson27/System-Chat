import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { initSocket } from '../utils/socket';
import { toggleDarkMode } from '@/utils/themeSwitcher';
import { Message as MessageComponent } from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

type Message = {
  text?: string;
  audio?: string;
  sender: 'me' | 'simulated';
  senderName: string;
  time: string;
};


interface ChatWindowProps {
  username: string;
  socket: any; 
}

export const ChatWindow = ({ username }: ChatWindowProps) => {
  const { t, i18n } = useTranslation();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socket = initSocket();

  // Carregar mensagens do localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Failed to parse chatMessages from localStorage', e);
      }
    }
  }, []);

  // Salvar mensagens no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chatMessages to localStorage', e);
    }
  }, [messages]);

  // Receber mensagens do socket
  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: { text?: string; senderName: string }) => {
        const messageData: Message = {
          text: msg.text,
          sender: msg.senderName === username ? 'me' : 'simulated',
          senderName: msg.senderName,
          time: new Date().toLocaleTimeString(),
        };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, messageData];
          return updatedMessages.filter((msg, index, arr) =>
            index === 0 || !(msg.text === arr[index - 1].text && msg.sender === arr[index - 1].sender)
          );
        });
        scrollDown();
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, username]);

  // Enviar mensagem
  const sendMessage = () => {
    if (input.trim() && socket) {
      const messageData: Message = {
        text: input,
        sender: 'me',
        senderName: username,
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, messageData];
        return updatedMessages.filter((msg, index, arr) =>
          index === 0 || !(msg.text === arr[index - 1].text && msg.sender === arr[index - 1].sender)
        );
      });
      socket.emit('message', { text: input, senderName: username });
      setInput('');
      scrollDown();
    }
  };

  // Rolagem automática para o fim
  const scrollDown = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full bg-animated-background">
    <div className="w-full max-w-md mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('welcome_message')}</h3>
        <button onClick={toggleDarkMode} className="p-2 rounded-md dark:bg-gray-700 dark:text-white">
          <FontAwesomeIcon icon={faMoon} className="dark:hidden" />
          <FontAwesomeIcon icon={faSun} className="hidden dark:block" />
        </button>
        <select
          className="ml-4 p-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Português</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <MessageComponent
            key={index}
            text={msg.text}
            sender={msg.sender}
            senderName={msg.senderName}
            time={msg.time}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 bg-white border-t flex items-center dark:bg-gray-800">
        <input
          className="flex-1 p-2 border rounded-l-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder={t('type_message')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-teal-600 text-white px-4 py-2 rounded-r-lg dark:bg-teal-700">
          {t('send_button')}
        </button>
      </div>
    </div>
    </div>
  );
};
