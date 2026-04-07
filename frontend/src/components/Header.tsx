import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import './Header.css'; // Сейчас создадим этот файл

export const Header = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.totalItems);

  const clearCart = useCartStore((state) => (state as any).clearCart);

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

      navigate('/login', { replace: true});
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
          <Link to="/support" className="nav-link">Поддержка</Link>

          
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
