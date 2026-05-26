import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      navigate('/home');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const categories = ['All', 'Mobile', 'TV', 'Laptop', 'Camera', 'Speaker', 'Tablet'];

  return (
    <nav className="glass-card sticky top-4 mx-2 md:mx-4 z-50 px-4 md:px-8 py-3 md:py-5 mt-4 flex items-center justify-between border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <Link to="/home" className="text-xl md:text-2xl font-black uppercase italic text-gradient pb-1">
        ALIEN ELECTRONICS
      </Link>

      <div className="hidden md:flex items-center gap-8 font-medium text-slate-300">
        {!user || user.userType !== 'admin' ? (
          <>
            <Link to="/home" className="hover:text-white transition uppercase text-xs font-black tracking-widest">Shop</Link>
            
            {/* Products Dropdown */}
            <div className="relative group" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <button className="flex items-center gap-1 hover:text-white transition uppercase text-xs font-black tracking-widest">
                Products
                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 w-48 pt-4">
                  <div className="glass-card bg-[#121212] border-white/10 overflow-hidden shadow-2xl">
                    {categories.map((cat) => (
                      <Link 
                        key={cat} 
                        to={`/home?category=${cat.toLowerCase()}`} 
                        className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-cyan-600 hover:text-white transition-all"
                        onClick={() => setShowDropdown(false)}
                      >
                        {cat === 'All' ? 'All Products' : `${cat}s`}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {user && (
              <>
                <Link to="/orders" className="hover:text-white transition">My Orders</Link>
                <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
                <Link to="/profile" className="hover:text-white transition">My Profile</Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/admin-home" className="hover:text-white transition uppercase text-xs font-black tracking-widest">Dashboard</Link>
            <Link to="/home" className="hover:text-white transition uppercase text-xs font-black tracking-widest border-b-2 border-cyan-500 pb-1">Store Front</Link>
            <Link to="/admin-dashboard" className="text-cyan-400 hover:text-cyan-300 transition font-bold uppercase text-[10px] tracking-widest">Manage Products</Link>
            <Link to="/admin-orders" className="text-blue-400 hover:text-blue-300 transition font-bold uppercase text-[10px] tracking-widest">Manage Orders</Link>
            <Link to="/admin-demands" className="text-emerald-400 hover:text-emerald-300 transition font-bold uppercase text-[10px] tracking-widest">Stock Demands</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {!user ? (
          <>
            <Link to="/login" className="btn py-2 px-3 md:px-6 bg-white/5 hover:bg-white/10 text-[10px] md:text-xs font-black tracking-widest uppercase">Login</Link>
            <Link to="/register" className="btn-primary py-2 px-3 md:px-6 text-[10px] md:text-xs font-black tracking-widest uppercase">Register</Link>
          </>
        ) : (
          <>
            {user.userType !== 'admin' && (
              <div 
                onClick={() => navigate('/cart')}
                className="group relative cursor-pointer flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-all px-4 py-2 rounded-full border border-white/5"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cart.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-pink-500/40 animate-in fade-in zoom-in">
                      {cart.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">My Cart</span>
              </div>
            )}
            <button onClick={handleLogout} className="btn py-2 px-4 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-black tracking-widest uppercase">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
