import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { socket } from '../socket'; // Наш общий сокет
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Добавляем, чтобы знать, когда мы в чате
  const totalItems = useCartStore((state) => state.totalItems);
  const clearCart = useCartStore((state) => (state as any).clearCart);
  
  const { hasNewMessage, setHasNewMessage } = useAuthStore();

  // Логика уведомлений
  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      // Если мы НЕ на странице саппорта и сообщение пришло от "поддержки"
      if (location.pathname !== '/support' && !msg.isMe) {
        setHasNewMessage(true);
      }
    };

    socket.on("server_message", handleNewMessage);

    // Сбрасываем точку, если зашли в саппорт
    if (location.pathname === '/support') {
      setHasNewMessage(false);
    }

    return () => {
      socket.off("server_message", handleNewMessage);
    };
  }, [location.pathname, setHasNewMessage]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.log("Сессия уже закрыта или сервер недоступен");
    } finally {
      if (clearCart) clearCart();
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/dashboard" className="logo">
          STORE<span>.TS</span>
        </Link>

        <nav className="nav">
          <Link to="/dashboard" className="nav-link">Каталог</Link>
          
          <Link 
            to="/support" 
            className="nav-link"
            style={{ position: 'relative' }}
          >
            Поддержка
            {hasNewMessage && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '10px',
                height: '10px',
                backgroundColor: '#ff4646',
                borderRadius: '50%',
                border: '2px solid #121212'
              }} />
            )}
          </Link>

          <Link to="/cart" className="cart-link">
            <span className="cart-icon">🛒</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </nav>
      </div>
    </header>
  );
};
