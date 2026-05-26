import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, shipOrder } from '../api';
import Navbar from '../components/Navbar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, shipped, delivered
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/GetAllOrdersSrv`, { withCredentials: true });
      if (response.data.status === 'success') {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = async (orderId, prodId, customerUserName, amount) => {
    try {
      const response = await shipOrder(orderId, prodId, customerUserName, amount);
      if (response.data.status === 'success') {
        setStatus({ type: 'success', message: response.data.message });
        fetchOrders();
      } else {
        setStatus({ type: 'error', message: response.data.message });
      }
    } catch (err) {
      console.error('Failed to ship order', err);
      setStatus({ type: 'error', message: 'Failed to ship order' });
    }
  };

  const handleMarkDelivered = async (orderId, prodId, userName, amount) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/DeliveredServlet`, {
        params: { orderid: orderId, prodid: prodId, userid: userName, amount: amount },
        withCredentials: true
      });
      if (response.data.status === 'success') {
        setStatus({ type: 'success', message: response.data.message });
        fetchOrders();
      } else {
        setStatus({ type: 'error', message: response.data.message });
      }
    } catch (err) {
      console.error('Failed to mark delivered', err);
      setStatus({ type: 'error', message: 'Failed to mark as delivered' });
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.shipped === 0;
    if (activeTab === 'shipped') return order.shipped === 1;
    if (activeTab === 'delivered') return order.shipped === 2;
    return true;
  });

  return (
    <div className="min-h-screen pb-12 bg-slate-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Order <span className="text-indigo-500">Management</span>
            </h1>
            <p className="text-slate-400 mt-2">Track and process customer fulfillments</p>
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
            {['pending', 'shipped', 'delivered'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 border ${
            status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
          }`}>
            {status.message}
          </div>
        )}

        <div className="glass-card overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-300 text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-6 py-5">Transaction ID</th>
                <th className="px-6 py-5">Customer Info</th>
                <th className="px-6 py-5">Address</th>
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5 text-center">Qty</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-20 text-slate-500">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">No {activeTab} orders found</td></tr>
              ) : filteredOrders.map((order, idx) => (
                <tr key={`${order.transactionId}-${order.productId}-${idx}`} className="hover:bg-white/[0.02] transition group">
                  <td className="px-6 py-5 font-mono text-xs text-indigo-400">{order.transactionId}</td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-white">{order.userName}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{order.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[10px] text-slate-400 max-w-[150px] leading-relaxed line-clamp-2 italic">{order.address}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-white">{order.productId}</div>
                    <div className="text-[10px] text-slate-500 uppercase">Product Code</div>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-white">{order.quantity}</td>
                  <td className="px-6 py-5 font-mono text-white font-bold whitespace-nowrap text-sm">₹{order.amount.toFixed(2)}</td>
                  <td className="px-6 py-5 text-right">
                    {order.shipped === 0 && (
                      <button 
                        onClick={() => handleShipOrder(order.transactionId, order.productId, order.userName, order.amount)}
                        className="px-6 py-2 bg-green-500 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-400 transition shadow-lg shadow-green-500/10"
                      >
                        Ship Now
                      </button>
                    )}
                    {order.shipped === 1 && (
                      <button 
                        onClick={() => handleMarkDelivered(order.transactionId, order.productId, order.userName, order.amount)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/10"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.shipped === 2 && (
                      <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Fulfilled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
