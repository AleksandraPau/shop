import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import { MainLayout } from './components/MainLayout'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Dashboard from './pages/Dashboard'
// Импортируй страницу корзины, когда создашь: 
// import CartPage from './pages/CartPage'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          {/* 1. ПУБЛИЧНЫЕ РОУТЫ (Без шапки) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* 2. ЗАЩИЩЕННЫЕ РОУТЫ (С шапкой и логикой корзины) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<div>Тут будет корзина</div>} />
          {/* Все роуты здесь автоматически получат Header и fetchCart */}
        </Route>

        {/* Редирект с главной на логин или дашборд */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
