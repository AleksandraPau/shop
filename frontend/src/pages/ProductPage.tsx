import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const ProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        navigate('/dashboard'); 
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div style={{ padding: '40px', color: 'white' }}>Загрузка...</div>;
  if (!product) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Назад</button>
      
      <div style={styles.content}>
        <div style={styles.imageBlock}>
          <img src={product.image || 'https://placeholder.com'} alt={product.name} style={styles.image} />
        </div>
        
        <div style={styles.infoBlock}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>{product.price} ₽</p>
          <p style={styles.description}>{product.description || 'Описание отсутствует'}</p>
          
          <button 
            style={styles.buyBtn}
            onClick={() => addItem(product.id)}
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '1200px', margin: '0 auto', color: 'white' },
  backBtn: { background: 'none', border: 'none', color: '#646cff', cursor: 'pointer', marginBottom: '20px' },
  content: { display: 'flex', gap: '50px', flexWrap: 'wrap' as const },
  imageBlock: { flex: '1', minWidth: '300px' },
  image: { width: '100%', borderRadius: '12px', background: '#333' },
  infoBlock: { flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' as const, gap: '20px' },
  title: { fontSize: '2.5rem', margin: '0' },
  price: { fontSize: '1.8rem', color: '#00ff88', fontWeight: 'bold' },
  description: { lineHeight: '1.6', color: '#ccc' },
  buyBtn: { padding: '15px 30px', background: '#646cff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }
};
