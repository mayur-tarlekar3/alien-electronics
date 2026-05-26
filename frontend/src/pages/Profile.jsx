import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))?.user || {});
  const [formData, setFormData] = useState({
    name: user.name || '',
    mobile: user.mobile || '',
    email: user.email || '',
    address: user.address || '',
    pincode: user.pinCode || '',
    password: user.password || ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.get(`${API_BASE_URL}/UpdateProfileSrv`, {
        params: formData,
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), user: response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setStatus({ type: 'error', message: response.data.message });
      }
    } catch (err) {
      console.error('Update failed', err);
      setStatus({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 mt-12">
        <div className="glass-card p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              User <span className="text-pink-500">Profile</span>
            </h1>
            <p className="text-slate-400">View and update your personal information</p>
          </div>

          {status.message && (
            <div className={`p-4 rounded-xl mb-6 border ${
              status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
            }`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address (Cannot be changed)</label>
              <input 
                type="email" 
                className="input-field opacity-50 cursor-not-allowed" 
                value={formData.email}
                readOnly 
              />
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
              <textarea 
                className="input-field h-24 resize-none" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Pin Code</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg mt-4 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
