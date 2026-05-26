import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCart } from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      if (response.data.status === 'success') {
        setCart({
          items: response.data.items,
          total: response.data.total,
          count: response.data.count
        });
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (pid, qty = 1) => {
    try {
      const response = await addToCart(pid, qty);
      if (response.data.status === 'success') {
        fetchCart();
      } else {
        alert(response.data.message || 'Failed to add product');
      }
      return response.data;
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert('Could not connect to server. Please try again.');
      return { status: 'error', message: 'Connection failed' };
    }
  };

  const handleUpdateCart = async (pid, qty) => {
    try {
      const response = await updateCart(pid, qty);
      fetchCart();
      return response.data;
    } catch (err) {
      console.error('Failed to update cart', err);
      return { status: 'error', message: 'Connection failed' };
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, handleAddToCart, handleUpdateCart }}>
      {children}
    </CartContext.Provider>
  );
};
