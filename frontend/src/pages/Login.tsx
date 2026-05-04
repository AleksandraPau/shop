import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Убедись, что этот файл создан в той же папке

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Вот эта функция, которой не хватало:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
        credentials: "include" // Важно для сохранения кук!
      });

      if (res.ok) {
        // Если логин успешен, летим на Дашборд
        navigate("/dashboard");
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Вход</h1>
        
        <input 
          type="text"
          placeholder="Логин или Email" 
          value={identifier} 
          onChange={(e) => setIdentifier(e.target.value)} 
          required
        />
        
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        
        <button type="submit" className="login-btn">
          Войти
        </button>
      </form>
    </div>
  );
}
