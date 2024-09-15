import { Message } from './Message'

interface MessagesContainerProps {
  messages: { text?: string; sender: 'me' | 'simulated'; senderName: string; time: string }[];
}

export const MessagesContainer = ({ messages }: MessagesContainerProps) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg, index) => (
      <Message key={index} text={msg.text} sender={msg.sender} senderName={msg.senderName} time={msg.time} />
    ))}
  </div>
);
