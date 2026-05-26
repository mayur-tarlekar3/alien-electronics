import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import { checkout } from '../api';

const CartPage = () => {
  const { cart, handleUpdateCart, fetchCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const onPaymentSuccess = async () => {
    try {
      const response = await checkout(cart.total);
      if (response.data.status === 'success') {
        alert('Payment Successful & Order Placed!');
        fetchCart();
        setShowPayment(false);
        navigate('/orders');
      } else {
        alert(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Checkout failed. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
            Shopping <span className="text-indigo-500">Cart</span>
          </h1>
          <p className="text-slate-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-bold">Review your premium selection</p>
        </div>

        <div className="glass-card overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-300 text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-6 py-5 font-bold">Picture</th>
                <th className="px-6 py-5 font-bold">Products</th>
                <th className="px-6 py-5 font-bold">Price</th>
                <th className="px-6 py-5 font-bold text-center">Quantity</th>
                <th className="px-6 py-5 font-bold text-center">Add</th>
                <th className="px-6 py-5 font-bold text-center">Remove</th>
                <th className="px-6 py-5 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-900/50">
              {cart.items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-20">
                    <p className="text-slate-400 text-xl">Your cart is empty.</p>
                    <button onClick={() => navigate('/home')} className="mt-4 text-green-500 hover:underline">Continue Shopping</button>
                  </td>
                </tr>
              ) : cart.items.map((item) => (
                <tr key={item.prodId} className="hover:bg-white/5 transition group">
                  <td className="px-6 py-4">
                    <img 
                      src={`${API_BASE_URL}/ShowImage?pid=${item.prodId}`} 
                      className="w-20 h-20 object-cover rounded-lg bg-slate-800"
                      alt={item.prodName}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white text-sm line-clamp-2 max-w-xs">{item.prodName}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">₹{item.prodPrice.toFixed(1)}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-center font-bold text-white"
                      readOnly
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleUpdateCart(item.prodId, item.quantity + 1)}
                      className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleUpdateCart(item.prodId, item.quantity - 1)}
                      className="p-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500 hover:text-white transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-white">
                    ₹{(item.prodPrice * item.quantity).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
            {cart.items.length > 0 && (
              <tfoot className="bg-white/[0.02]">
                <tr className="text-white">
                  <td colSpan="6" className="px-8 py-8 text-right font-black uppercase tracking-[0.2em] text-xs">Total Investment</td>
                  <td className="px-8 py-8 text-right font-mono font-black text-2xl text-indigo-400">₹{cart.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {cart.items.length > 0 && (
          <div className="mt-8 flex justify-end gap-4">
            <button 
              onClick={() => navigate('/home')}
              className="px-10 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition uppercase tracking-widest text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => setShowPayment(true)}
              className="px-10 py-4 bg-green-500 text-slate-950 rounded-xl font-black hover:bg-green-400 transition uppercase tracking-widest text-sm shadow-xl shadow-green-500/20"
            >
              Pay Now
            </button>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        onPaymentSuccess={onPaymentSuccess}
        amount={cart.total}
      />
    </div>
  );
};

export default CartPage;
