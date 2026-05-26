import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalDemands: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetAdminStatsSrv`, { withCredentials: true });
      if (response.data.status === 'success') {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} className="glass-card p-6 hover:scale-[1.02] transition-transform cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          {icon}
        </div>
        <span className="text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity">
          {value}
        </span>
      </div>
      <h3 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </Link>
  );

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">
            Admin <span className="text-gradient">Control</span>
          </h1>
          <p className="text-slate-400 uppercase tracking-widest text-[10px] font-black">System Performance & Operations</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-40 animate-pulse bg-slate-800/50"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              title="Total Products" 
              value={stats.totalProducts} 
              color="bg-indigo-500" 
              link="/admin-dashboard"
              icon={<svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
            />
            <StatCard 
              title="Pending Orders" 
              value={stats.pendingOrders} 
              color="bg-yellow-500" 
              link="/admin-orders"
              icon={<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              title="Shipped Items" 
              value={stats.shippedOrders} 
              color="bg-green-500" 
              link="/admin-orders"
              icon={<svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
            />
            <StatCard 
              title="Product Demands" 
              value={stats.totalDemands} 
              color="bg-pink-500" 
              link="/admin-demands"
              icon={<svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            <StatCard 
              title="Delivered Items" 
              value={stats.deliveredOrders} 
              color="bg-blue-500" 
              link="/admin-orders"
              icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              title="Total Transactions" 
              value={stats.totalOrders} 
              color="bg-slate-500" 
              link="/admin-orders"
              icon={<svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
            />
          </div>
        )}

        <div className="mt-12 glass-card p-12 text-center bg-gradient-to-br from-indigo-500/10 to-pink-500/10">
          <h2 className="text-3xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
             <Link to="/admin-dashboard" className="btn-primary px-8">Add Product</Link>
             <Link to="/admin-orders" className="btn bg-slate-800 hover:bg-slate-700 px-8 border border-white/10">Process Shipments</Link>
             <Link to="/admin-demands" className="btn bg-slate-800 hover:bg-slate-700 px-8 border border-white/10">View Demands</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
