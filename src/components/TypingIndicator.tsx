import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;
