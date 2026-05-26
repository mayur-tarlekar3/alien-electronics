import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/GetProductsSrv`, { withCredentials: true });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pid) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/RemoveProductSrv`, { params: { prodid: pid }, withCredentials: true });
      if (response.data.status === 'success') {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.prodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.prodId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12 bg-slate-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Stock <span className="text-indigo-500">Inventory</span>
            </h1>
            <p className="text-slate-400">Manage products, pricing, and stock levels</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-8 py-3 shadow-xl shadow-indigo-500/20"
          >
            + Add New Product
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-card overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead className="bg-slate-800/80 text-white text-[10px] uppercase tracking-[0.2em] font-black">
              <tr>
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Product ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5 text-center">Sold Qty</th>
                <th className="px-6 py-5 text-center">Stock Qty</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-900/40">
              {loading ? (
                <tr><td colSpan="8" className="text-center py-20 text-slate-500">Scanning inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">No matching items</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.prodId} className="hover:bg-white/[0.02] transition group">
                  <td className="px-6 py-4">
                    <img 
                      src={`${API_BASE_URL}/ShowImage?pid=${product.prodId}`} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                    />
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-bold">{product.prodId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white line-clamp-1 max-w-[200px]">{product.prodName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded uppercase tracking-widest text-slate-400">
                      {product.prodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">₹{product.prodPrice.toFixed(1)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full font-bold text-xs">
                      {product.soldQty || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                      product.prodQuantity < 10 ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {product.prodQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditProduct(product)}
                        className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition"
                      >
                        Update
                      </button>
                      <button 
                        onClick={() => handleDelete(product.prodId)}
                        className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchProducts} 
      />
      
      {editProduct && (
        <EditProductModal 
          isOpen={!!editProduct} 
          product={editProduct} 
          onClose={() => setEditProduct(null)} 
          onSuccess={fetchProducts} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;
