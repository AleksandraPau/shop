
export async function login(identifier, password) {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({identifier, password}),
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "errorLogIn");
  }

  return data;
}

//сохранение при перезагрузке
export async function checkAuth() {
  const response = await fetch("http://localhost:3000/api/auth/me", {
    method: "GET",
    credentials: 'include'
  });
  if (!response.ok) throw new Error("NotAuthorized");
  return await response.json();
}
