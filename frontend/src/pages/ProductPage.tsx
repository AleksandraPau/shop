import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import './ProductPage.css'; // Подключаем CSS

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  if (loading) return <div className="product-page-container" style={{textAlign: 'center'}}>Загрузка...</div>;

  return (
    <div className="product-page-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Назад в каталог
      </button>
      
      <div className="product-content">
        <div className="product-image-block">
          <img 
            src={product.image || 'https://placeholder.com'} 
            alt={product.name} 
            className="product-main-image" 
          />
        </div>
        
        <div className="product-info-block">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price-tag">{product.price} ₽</p>
          <div className="divider" />
          <p className="product-description">{product.description || 'Описание товара отсутствует.'}</p>
          
          <button 
            className="product-buy-btn"
            onClick={() => addItem(product.id)}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};
