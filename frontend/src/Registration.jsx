import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  // Создаем 3 "коробочки" для хранения того, что ты вводишь
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Эта функция сработает, когда ты нажмешь на кнопку
  const handleRegister = async (e) => {
    e.preventDefault(); // ГЛАВНОЕ: страница не перезагрузится!

    try {
      // Стучимся в твой бэкенд на порт 5000
      const response = await fetch('http://localhost:3000/api/auth/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Передаем данные. ВАЖНО: бэк ждет поле "login", поэтому пишем login: username
        body: JSON.stringify({ 
          login: username, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // alert("Успех! Пользователь " + data.text + " создан в базе!");
        navigate('/dashboard');
      } else {
        alert("Ошибка: " + data.error);
      }
    } catch (err) {
      console.error("Бэкенд не отвечает. Проверь npm run dev в папке backend!");
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: '20px', margin: '10px' }}>
      <form onSubmit={handleRegister}>
        <h2>Регистрация (Новый компонент)</h2>
        
        <input 
          type="text" 
          placeholder="Придумай логин" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="email" 
          placeholder="Твой Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <br />
        <button type="submit">Создать аккаунт</button>
      </form>
    </div>
  );
};

export default Registration;
