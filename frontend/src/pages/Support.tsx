import { useState } from 'react';
import './Support.css'
// Описание типов для пропсов (если нужны)


interface Message {
  id: number;
  text: string;
  isMe: boolean;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Привет! Как дела?", isMe: false },
    { id: 2, text: "Всё супер, пишу код на TSX!", isMe: true },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: Date.now(), text: input, isMe: true };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isMe ? 'my-message' : 'other-message'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Напишите сообщение..." 
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default App;