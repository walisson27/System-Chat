interface MessageProps {
    text?: string;
    sender: 'me' | 'simulated';
    time: string;
  }
  
  export const Message = ({ text, sender, time }: MessageProps) => (
    <div className={`flex ${sender === 'me' ? 'justify-end' : 'justify-start'}`}>
      {text && (
        <div className={`max-w-xs px-4 py-2 rounded-lg shadow ${sender === 'me' ? 'bg-green-400 text-white' : 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white'}`}>
          <p>{text}</p>
          <span className="block text-xs text-right mt-1 opacity-75">{time}</span>
        </div>
      )}
    </div>
  );
  