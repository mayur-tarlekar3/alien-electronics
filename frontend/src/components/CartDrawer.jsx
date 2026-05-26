import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL, checkout } from '../api';
import PaymentModal from './PaymentModal';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, handleUpdateCart, loading, fetchCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    setShowPayment(true);
  };

  const onPaymentSuccess = async () => {
    try {
      const response = await checkout(cart.total);
      if (response.data.status === 'success') {
        alert('Payment Successful & Order Placed!');
        fetchCart();
        setShowPayment(false);
        onClose();
      } else {
        alert(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md glass-card !rounded-none border-l border-white/10 shadow-2xl flex flex-col h-full bg-slate-900">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="text-xl font-bold">Shopping Cart ({cart.count})</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">✕</button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400">Your cart is empty</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.prodId} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={`${API_BASE_URL}/ShowImage?pid=${item.prodId}`} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.prodName}</h4>
                        <span className="font-mono text-sm">₹{(item.prodPrice * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-800 rounded-lg p-1">
                          <button 
                            onClick={() => handleUpdateCart(item.prodId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:text-indigo-400"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateCart(item.prodId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:text-indigo-400"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => handleUpdateCart(item.prodId, 0)}
                          className="text-[10px] text-slate-500 hover:text-red-400 uppercase tracking-wider font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-slate-800/30">
                <div className="flex justify-between mb-6">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="text-2xl font-black">₹{cart.total.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full py-4 text-lg">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onPaymentSuccess={onPaymentSuccess}
        amount={cart.total}
      />
    </>
  );
};

export default CartDrawer;
