import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import './Dashboard.css'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const init = async () => {
      try {
        const auth = await fetch("http://localhost:3000/api/auth/me", { credentials: "include" });
        if (!auth.ok) return navigate("/login");

        const res = await fetch("http://localhost:3000/api/products", { credentials: "include" });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Каталог</h1>
      
      <div className="products-grid">
        {products.map((product: any) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <div className="product-image-wrapper">
                <img src={product.image || 'https://placeholder.com'} alt={product.name} />
              </div>
              <h3 className="product-title">{product.name}</h3>
            </Link>
            
            <div className="product-footer">
              <span className="product-price">{product.price} ₽</span>
              <button className="add-button" onClick={() => addItem(product.id)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
