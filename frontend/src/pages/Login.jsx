import { useState } from 'react';
import { login } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password, userType);
      if (response.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass-card w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-slate-400 mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com or your email"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-slate-400 mb-2">User Type</label>
            <select 
              className="input-field appearance-none cursor-pointer"
              value={userType} 
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full mt-6">
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
