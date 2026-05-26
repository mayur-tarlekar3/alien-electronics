import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { handleAddToCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const imageUrl = `${API_BASE_URL}/ShowImage?pid=${product.prodId}`;

  const onAddClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    handleAddToCart(product.prodId, 1);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await handleAddToCart(product.prodId, 1);
    navigate('/cart');
  };

  return (
    <div className="glass-card group overflow-hidden flex flex-col h-full border-white/5 hover:border-cyan-500/50 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
        <img 
          src={imageUrl} 
          alt={product.prodName}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540340334550-80151c0953d1?auto=format&fit=crop&q=80&w=300'; }}
        />
        <div className="absolute top-3 right-3">
          <span className="bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {product.prodType}
          </span>
        </div>
        {product.prodQuantity < 1 && (
          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
            <span className="text-red-500 font-black uppercase tracking-widest text-lg rotate-12 border-4 border-red-500 px-4 py-2">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1">
          {product.prodName}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {product.prodInfo}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-row items-end gap-3 mb-5">
            <span className="text-2xl font-black text-white tracking-tight">
              ₹{(product.prodPrice || 0).toLocaleString()}
            </span>
            <span className="text-sm text-slate-500 line-through mb-1">
              ₹{((product.prodPrice || 0) * 1.2).toLocaleString()}
            </span>
          </div>
          
          {product.prodQuantity > 0 && user?.userType !== 'admin' && (
            <div className="flex gap-2">
              <button 
                onClick={onAddClick}
                className="flex-1 btn bg-white/5 hover:bg-white/10 text-xs py-3 font-bold uppercase tracking-wider"
              >
                Add
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 btn-primary text-xs py-3 font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/20"
              >
                Buy Now
              </button>
            </div>
          )}
          {user?.userType === 'admin' && (
            <div className="flex gap-2">
               <button 
                 onClick={() => onEdit && onEdit(product)}
                 className="flex-1 btn bg-cyan-500/10 text-cyan-400 text-xs py-2 font-bold uppercase tracking-wider hover:bg-cyan-500 hover:text-white transition-all"
               >
                 Update
               </button>
               <button 
                 onClick={() => onDelete && onDelete(product.prodId)}
                 className="flex-1 btn bg-red-500/10 text-red-400 text-xs py-2 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all"
               >
                 Remove
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
