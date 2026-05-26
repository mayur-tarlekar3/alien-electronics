import { useState, useEffect } from 'react';
import { getOrders, API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
          Order History
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse bg-slate-800/50"></div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div key={idx} className="glass-card p-6 flex flex-col md:flex-row gap-6 border-slate-800 hover:border-slate-700 transition">
                <div className="w-24 h-24 bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                   <img 
                    src={`${API_BASE_URL}/ShowImage?pid=${order.productId}`} 
                    alt={order.prodName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540340334550-80151c0953d1?auto=format&fit=crop&q=80&w=200'; }}
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{order.prodName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.shipped === 2 ? 'bg-blue-500/20 text-blue-400' : 
                      order.shipped === 1 ? 'bg-green-500/20 text-green-400' : 
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.shipped === 2 ? 'Delivered' : order.shipped === 1 ? 'Shipped' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                    <div>
                      <p className="text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Order ID</p>
                      <p className="font-mono text-slate-300">{order.orderId}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Quantity</p>
                      <p className="text-slate-300">{order.qty}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Amount</p>
                      <p className="text-slate-300 font-bold">₹{order.amount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1 uppercase tracking-wider text-[10px]">Date</p>
                      <p className="text-slate-300">
                        {order.time ? new Date(order.time).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card border-dashed border-slate-800">
            <h3 className="text-2xl font-bold mb-2">No orders yet</h3>
            <p className="text-slate-400 mb-8">You haven't placed any orders yet. Start shopping!</p>
            <a href="/shopping-cart/home" className="btn btn-primary px-8">Go to Shop</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
