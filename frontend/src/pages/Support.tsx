import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Support.css'

const socket = io("http://localhost:3000");

interface Message {
  id: number;
  text: string;
  isMe: boolean;
}

const Support: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on("server_message", (newMsg: Message) => {
      console.log("Message from server:", newMsg);
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("server_message");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const myMsg: Message = { id: Date.now(), text: input, isMe: true };
    
    setMessages((prev) => [...prev, myMsg]);

    socket.emit("client_message", myMsg);

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

export default Support;