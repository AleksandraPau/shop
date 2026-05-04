import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Добавили Link
import { gridStyle, cardStyle, buyBtnStyle } from '../api/DashboardStyles.js';
import { useCartStore } from '../store/useCartStore';
import "../App.css";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include"
        });

        if (!authRes.ok) return navigate("/login");

        const prodRes = await fetch("http://localhost:3000/api/products", {
          credentials: "include" 
        });
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(Array.isArray(prodData) ? prodData : []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [navigate]);

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Витрина товаров</h1>
      <div style={gridStyle}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={cardStyle}>
              {/* Оборачиваем картинку и имя в Link для перехода на страницу товара */}
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', background: '#333', cursor: 'pointer' }}>
                  <img 
                    src={product.image || 'https://placeholder.com'} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h3 style={{ margin: '15px 0 5px', color: 'white', cursor: 'pointer' }}>
                  {product.name}
                </h3>
              </Link>
              
              <p style={{ color: '#646cff', fontWeight: 'bold' }}>{product.price} ₽</p>
              
              <button style={buyBtnStyle} onClick={() => addItem(product.id)}>
                В корзину
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: 'white' }}>Товаров пока нет.</p>
        )}
      </div>
    </div>
  );
}
