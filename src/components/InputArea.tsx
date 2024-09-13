interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
  }
  
  export const InputArea = ({ input, setInput, sendMessage }: InputAreaProps) => (
    <div className="p-4 bg-white border-t flex items-center dark:bg-gray-800">
      <input
        className="flex-1 p-2 border rounded-l-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        placeholder="Digite uma mensagem..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} className="bg-teal-600 text-white px-4 py-2 rounded-r-lg dark:bg-teal-700">
        Enviar
      </button>
    </div>
  );
  