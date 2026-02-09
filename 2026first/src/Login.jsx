import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import "./App.css";

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
  e.preventDefault();
  }
  
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