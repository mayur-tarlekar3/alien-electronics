import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DemandDashboard = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemands();
  }, []);

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/GetDemandSrv`, { withCredentials: true });
      if (response.data.status === 'success') {
        setDemands(response.data.demands);
      }
    } catch (err) {
      console.error('Failed to fetch demands', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Product <span className="text-indigo-500">Demands</span>
          </h1>
          <p className="text-slate-400">Products requested by customers that were out of stock</p>
        </div>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User Email</th>
                <th className="px-6 py-4 font-semibold">Product ID</th>
                <th className="px-6 py-4 font-semibold">Quantity Demanded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="3" className="text-center py-12">Loading demands...</td></tr>
              ) : demands.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-12 text-slate-500">No demands found.</td></tr>
              ) : demands.map((demand, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-indigo-300">{demand.userName}</td>
                  <td className="px-6 py-4 font-mono">{demand.prodId}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full font-bold">
                      {demand.demandQty}
                    </span>
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

export default DemandDashboard;
