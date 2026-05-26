import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getProducts, API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import EditProductModal from '../components/EditProductModal';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const location = useLocation();

  const categories = ['all', 'mobile', 'tv', 'laptop', 'camera', 'speaker', 'tablet'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setFilter(category.toLowerCase());
    } else {
      setFilter('all');
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const response = await getProducts({ type: filter, search: query });
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (pid) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/RemoveProductSrv`, { 
        params: { prodid: pid }, 
        withCredentials: true 
      });
      if (response.data.status === 'success') {
        fetchProducts();
      } else {
        alert(response.data.message || 'Failed to remove product');
      }
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="relative rounded-3xl overflow-hidden h-[400px] flex items-center bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2070" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            alt="Hero"
          />
          <div className="relative z-20 px-6 md:px-12 max-w-2xl py-10 md:py-16">
            <h1 className="text-5xl md:text-7xl font-black mb-4 md:mb-6 leading-tight pb-2 uppercase italic">
              Future of <span className="text-gradient pr-4">Tech</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 md:mb-10 leading-relaxed font-medium">
              Discover the next generation of premium electronics. Curated for performance, designed for life.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="flex-grow p-4 bg-black/60 backdrop-blur border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500 transition caret-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary px-8 rounded-2xl">Search</button>
            </form>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="max-w-7xl mx-auto px-4 mt-12 overflow-x-auto">
        <div className="flex gap-3 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full border transition-all capitalize whitespace-nowrap ${
                filter === cat 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card aspect-[3/4] animate-pulse bg-slate-800/50"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.prodId} 
                product={product} 
                onEdit={(p) => setEditProduct(p)}
                onDelete={(id) => handleDelete(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-card">
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

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

export default Home;
