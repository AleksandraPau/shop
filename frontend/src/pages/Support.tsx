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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
  }
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connect to chat");
      socket.emit("get_history");
    });

    socket.on("chat_history", (history: Message[]) => {
      setMessages(history);
    });

    socketRef.current.on("server_message", (newMsg: Message) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket Auth Error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit("client_message", { 
      text: input, 
    });
   
    setInput('');
  };

   return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
            История чата пуста. Напишите что-нибудь!
          </p>
        )}
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
        <button onClick={sendMessage} disabled={!input.trim()}>Отправить</button>
      </div>
    </div>
  );
};

export default Support;