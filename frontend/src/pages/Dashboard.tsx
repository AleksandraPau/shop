import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
// Импортируем стили и наш стор корзины
import { gridStyle, cardStyle, buyBtnStyle } from '../api/DashboardStyles.js';
import { useCartStore } from '../store/useCartStore';
import "../App.css";

// Описываем тип товара, чтобы TS не ругался на .id или .name
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Достаем функцию добавления в корзину из Zustand
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // 1. Проверяем авторизацию через наш эндпоинт
        const authRes = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include"
        });

        if (authRes.ok) {
          // 2. Если авторизован — грузим товары (не забудь credentials!)
          const prodRes = await fetch("http://localhost:3000/api/products", {
            credentials: "include" 
          });
          const prodData = await prodRes.json();
          setProducts(prodData);
        } else {
          // Если не ок — мягко уходим на логин (без стробоскопа)
          navigate("/login");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [navigate]);

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Загрузка товаров...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Витрина товаров</h1>

      <div style={gridStyle}>
        {products.map((product) => (
          <div key={product.id} style={cardStyle}>
            <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', background: '#333' }}>
              <img 
                src={product.image || 'https://via.placeholder.com'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <h3 style={{ margin: '15px 0 5px', color: 'white' }}>{product.name}</h3>
            <p style={{ color: '#646cff', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {product.price} ₽
            </p>
            
            {/* Кнопка теперь реально работает с корзиной */}
            <button 
              style={buyBtnStyle}
              onClick={() => addItem(product.id)}
            >
              В корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
