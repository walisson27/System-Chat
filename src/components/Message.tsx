import React from 'react';

interface MessageProps {
  text?: string;
  sender: 'me' | 'simulated';
  senderName: string; 
  time: string;
}

export const Message = ({ text, sender, senderName, time }: MessageProps) => (
  <div className={`flex ${sender === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
    {text && (
      <div
        className={`max-w-xs px-4 py-2 rounded-lg shadow-lg ${sender === 'me' ? 'bg-teal-600 text-white' : 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'} flex flex-col`}
      >
        <p className="font-semibold">{senderName}</p> 
        <p>{text}</p>
        <span className="text-xs text-right mt-1 opacity-75">{time}</span>
      </div>
    )}
  </div>
);
