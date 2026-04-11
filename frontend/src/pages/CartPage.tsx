import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import './CartPage.css';
import { useState } from 'react';

export const CartPage = () => {
    const {items, totalItems, clearCart } = useCartStore();
    const [isOrdered, setIsOrdered] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);

    const handleCheckout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/cart/checkout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setOrderId(data.orderId);
                setIsOrdered(true);
                clearCart();
            }
        } catch (error) {
            alert("Ошибка при оформлении");
        }
    };

    const clearCartAll = useCartStore((state) => state.clearCartAll);

    if (isOrdered) {
        return (
            <div className="cart-empty">
                <h1 style={{ color: '#646cff' }}>🚀 Заказ принят!</h1>
                <p>Ваш номер заказа: <strong>#{orderId}</strong></p>
                <p>Менеджер свяжется с вами в ближайшее время.</p>
                 <Link to={"/dashboard"} style={{marginTop: '20px', display: 'inline-block'}}>
                    Вернуться за покупками
                 </Link>
            </div>
        );
    }

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (totalItems === 0) {
        return (
            <div className="cart-empty">
                <h2>Cart is empty</h2>
                <Link to={"/dashboard"}>Return to dashboard</Link>
            </div>
        );
    }

    return (
    <div className="cart-page">
      <h1>Ваша корзина</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.product.image || 'https://placeholder.com'} 
              className="cart-item-img"
              alt={item.product.name}
            />
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p className="cart-item-price">{item.product.price} ₽</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>{item.quantity} шт.</strong></p>
              <p style={{ color: '#646cff' }}>{item.product.price * item.quantity} ₽</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Всего товаров: {totalItems}</span>
        <span className="total-price">Итого: {totalPrice} ₽</span>
        <button className="checkout-btn" onClick={handleCheckout}>Оформить заказ</button>
      </div>
      <div>
        <button className="clear-btn" onClick={clearCartAll}>Очистить всё</button>
      </div>
    </div>
  );
};