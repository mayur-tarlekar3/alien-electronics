import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const AddProductModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'MOBILE',
    info: '',
    price: '',
    quantity: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('type', formData.type);
    data.append('info', formData.info);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    if (image) data.append('image', image);

    try {
      const response = await axios.post(`${API_BASE_URL}/AddProductSrv`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (response.data.status === 'success') {
        onSuccess();
        onClose();
        setFormData({ name: '', type: 'MOBILE', info: '', price: '', quantity: '' });
        setImage(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg p-8 shadow-2xl border-white/10">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-6">
          Add <span className="text-indigo-500">Product</span>
        </h2>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Product Name</label>
            <input 
              className="input-field" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Type</label>
              <select 
                className="input-field" 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="MOBILE">Mobile</option>
                <option value="TV">TV</option>
                <option value="LAPTOP">Laptop</option>
                <option value="CAMERA">Camera</option>
                <option value="SPEAKER">Speaker</option>
                <option value="TABLET">Tablet</option>
              </select>
            </div>
            <div className="input-group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Price (₹)</label>
              <input 
                className="input-field" 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Stock Quantity</label>
            <input 
              className="input-field" 
              type="number" 
              value={formData.quantity} 
              onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Description</label>
            <textarea 
              className="input-field h-24 resize-none" 
              value={formData.info} 
              onChange={(e) => setFormData({...formData, info: e.target.value})} 
              required 
            />
          </div>

          <div className="input-group">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Product Image</label>
            <input 
              type="file" 
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary py-3"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
