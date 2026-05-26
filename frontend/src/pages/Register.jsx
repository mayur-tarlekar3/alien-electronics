import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.address.trim() || !formData.pincode.trim() || !formData.password.trim()) {
      setError('All fields are required');
      return;
    }

    if (formData.mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    if (formData.pincode.length !== 6) {
      setError('Pincode must be exactly 6 digits');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.get('/RegisterSrv', { params: formData });
      if (response.data.status === 'success') {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-12">
      <div className="glass-card w-full max-w-lg p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-slate-400 mb-8">Join our shopping community</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
            <input className="input-field" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number</label>
            <input className="input-field" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required />
          </div>
          <div className="input-group md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input className="input-field" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Address</label>
            <input className="input-field" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Pincode</label>
            <input className="input-field" name="pincode" type="number" value={formData.pincode} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input className="input-field" name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="input-group md:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Confirm Password</label>
            <input className="input-field" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary w-full md:col-span-2 mt-6">
            Register Now
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
