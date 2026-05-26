import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import DemandDashboard from './pages/DemandDashboard';
import Profile from './pages/Profile';
import AdminHome from './pages/AdminHome';
import CartPage from './pages/CartPage';
// Other pages will be imported here as they are created

function App() {
  const basename = '/';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-[#080808] text-slate-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-demands" element={<DemandDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Add more routes here */}
        </Routes>

      </div>
    </Router>
  );
}

export default App;
