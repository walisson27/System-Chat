import { useState, useEffect, useRef } from 'react'; // Adicione useRef aqui
import { useTranslation } from 'react-i18next';
import { initSocket } from '../utils/socket';
import { toggleDarkMode } from '@/utils/themeSwitcher';
import { Message } from './Message';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

type Message = {
  text?: string;
  audio?: string;
  sender: 'me' | 'simulated';
  time: string;
};

export const ChatWindow = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const socket = initSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null); // Agora a importação está correta

  // Load messages from localStorage
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

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chatMessages to localStorage', e);
    }
  }, [messages]);

  // Handle WebSocket connection
  useEffect(() => {
    if (socket) {
      socket.on('message', (msg: string | { audio: string }) => {
        if (typeof msg === 'string') {
          const messageData: Message = {
            text: msg,
            sender: 'simulated',
            time: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, messageData]);
        } else {
          const audioMessageData: Message = {
            audio: msg.audio,
            sender: 'simulated',
            time: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, audioMessageData]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket]);

  // Function to handle sending a text message
  const sendMessage = () => {
    if (input.trim() && socket) {
      const messageData: Message = {
        text: input,
        sender: 'me',
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, messageData]);
      socket.emit('message', input);
      setInput('');
    }
  };

  // Function to handle starting the audio recording
  const startRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
    }
  };

  // Function to stop recording and send audio message
  const stopRecording = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Send audio message to server
        const audioMessageData: Message = {
          audio: audioUrl,
          sender: 'me',
          time: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, audioMessageData]);
        socket.emit('message', { audio: audioUrl });

        // Clear chunks
        setAudioChunks([]);
      };
    }
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
          onChange={(e) => i18n.changeLanguage(e.target.value)}
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
