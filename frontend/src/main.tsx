import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import { MainLayout } from './components/MainLayout'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
import { CartPage } from './pages/CartPage'
import Support from './pages/Support'
// Импортируй страницу корзины, когда создашь: 
// import CartPage from './pages/CartPage'

const container = document.getElementById('root');

if (!container) {
  throw new Error("Не удалось найти корневой элемент 'root'. Проверь index.html!");
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          {/* 1. ПУБЛИЧНЫЕ РОУТЫ (Без шапки) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* 2. ЗАЩИЩЕННЫЕ РОУТЫ (С шапкой и логикой корзины) */}
        <Route element={<MainLayout />}>
          <Route path="support" element={<Support />}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Все роуты здесь автоматически получат Header и fetchCart */}
        </Route>

        {/* Редирект с главной на логин или дашборд */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
