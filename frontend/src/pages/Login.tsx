import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./App.css";

function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({identifier, password}),
      credentials: 'include',
    });

    const data = await response.json();
console.log(response);

    if (response.ok) {
      alert("Вход выполнен!");
      navigate('/dashboard');
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    console.error("Ошибка при входе:", err);
  }
  };
  
  return (
    <form onSubmit={submit}>
      <h2>Вход</h2>
      <input
        type="text"
        placeholder="login or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input type="submit" value="Войти " />
    </form>
  );
}

// export default Login;
export default Login;
