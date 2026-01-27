import { useState } from "react";
import "./App.css";

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");

  // const submit = (e)=>{

  // }

  const submit = async (e) => {
  e.preventDefault();
  
  }
  
  // Просто отправляем данные на сервер
//   const response = await fetch('/api/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       login: userLogin,
//       password: password
//     })
//   });

//   if (response.ok) {
//     alert('Вход выполнен!');
//   } else {
//     alert('Ошибка входа');
//   }
// };

  
  return (
    <form onSubmit={submit}>
      <input
        type="text"
        placeholder="login"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="login " />
    </form>
  );
}

export default Login;