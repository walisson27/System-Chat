import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initSocket } from '../utils/socket';
import { toggleDarkMode } from '@/utils/themeSwitcher';
import { Message } from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faGlobe } from '@fortawesome/free-solid-svg-icons';

export const ChatWindow = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<{ text?: string; sender: 'me' | 'simulated'; time: string }[]>([]);
  const [input, setInput] = useState('');
  const socket = initSocket();

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem('chatMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        } else {
          console.error('Parsed data is not an array');
        }
      }
    } catch (e) {
      console.error('Failed to load chatMessages from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chatMessages to localStorage', e);
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: string) => {
        const messageData = {
          text: msg,
          sender: 'simulated',
          time: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, messageData]);
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      const messageData = {
        text: input,
        sender: 'me',
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit('message', input);
      setInput('');
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-teal-600 text-white p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('welcome_message')}</h3>
        <button onClick={toggleDarkMode} className="p-2 rounded-md dark:bg-gray-700 dark:text-white">
            <FontAwesomeIcon icon={faMoon} className="dark:hidden" />
            <FontAwesomeIcon icon={faSun} className="hidden dark:block" />
          </button>
        <select
          className="ml-4 p-2 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white"
          value={i18n.language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Português</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} time={msg.time} />
        ))}
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
  );
};
