import { useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/globals.css';
import { applySavedTheme } from '../utils/themeSwitcher';
import type { AppProps } from 'next/app'; // Importar o tipo AppProps

const socket = io();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    fetch('/api/socket');
    applySavedTheme();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
