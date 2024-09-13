import { useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/globals.css';
import { applySavedTheme } from '../utils/themeSwitcher';
const socket = io();

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/socket');
    applySavedTheme();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
