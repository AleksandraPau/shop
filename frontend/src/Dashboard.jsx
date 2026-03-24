import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { gridStyle, cardStyle, buyBtnStyle, logoutBtnStyle } from './api/DashboardStyles.ts';
import "./App.css";


function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include"
        });

        if (authRes.ok) {
          const userData = await authRes.json();
          setUser(userData);

          const prodRes = await fetch("http://localhost:3000/api/products");
          const prodData = await prodRes.json();
          setProducts(prodData);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include"
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.error("Error network on exit", err);
    }
  };

  return (
    <div style={{padding:'40px', fontFamily: 'sans-serif'}}>
      <div>
        <h1>WELCOME, {user?.username}</h1>
        <button onClick={handleLogout} style={logoutBtnStyle}>login out</button>
      </div>
      <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center' }}>
        
        <h1>Витрина товаров</h1>

      </div>

      <div style={gridStyle}>
        {products.map((product)=> (
          <div key={product.id} style={cardStyle}>
            <img 
              src={product.image} 
              alt={product.desc} 
              style={{width: '100%', borderRadius: '8px' }} 
            />
            <h3 style={{margin: '10px 0'}}>{product.name}</h3>
            <p style={{color: '#888' }}>{product.price}</p>
            <button style={buyBtnStyle}>В корзину</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;