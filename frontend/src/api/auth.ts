import { API_BASE_URL, fetchOptions } from "./config";

export async function login(identifier: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`,
    fetchOptions('POST', {identifier, password}));

  const data = await response.json();

  if (!response.ok) throw new Error(data.error || "errorLogIn");

  return data;
}

//сохранение при перезагрузке
export async function checkAuth() {
  const response = await fetch(`${API_BASE_URL}api/auth/me`, {
    method: "GET",
    credentials: 'include'
  });
  
  if (!response.ok) throw new Error("NotAuthorized");
  return await response.json();
}
