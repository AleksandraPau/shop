import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import './Header.css'; // Сейчас создадим этот файл

export const Header = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.totalItems);

  // В будущем сюда добавим логику logout
  const handleLogout = () => {
    // Очистка кук на бэке и редирект
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          STORE<span>.TS</span>
        </Link>

        <nav className="nav">
          <Link to="/catalog" className="nav-link">Каталог</Link>
          
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
