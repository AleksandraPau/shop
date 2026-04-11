import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import './Support.css'

interface Message {
  id: number;
  text: string;
  isMe: boolean;
}

const Support: React.FC = () => {
  
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      auth: {
        userId: user?.id
      }
    });

    socketRef.current.emit("get_history");

    socketRef.current.on("chat_history", (history: Message[]) => {
      setMessages(history);
    });

    socketRef.current.on("server_message", (newMsg: Message) => {
      console.log("Message from server:", newMsg);
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const myMsg: Message = { 
      id: Date.now(), 
      text: input, 
      isMe: true 
    };
    
    socketRef.current.emit("client_message", {
      text: input,
      userId: user?.id
    });

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.length === 0 && <p style={{color: '#888', textAlign: 'center'}}>История чата пуста</p>}
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isMe ? 'my-message' : 'other-message'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
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