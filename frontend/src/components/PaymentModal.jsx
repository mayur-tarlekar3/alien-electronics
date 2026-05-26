import { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    const { cardNumber, expiry, cvv, name } = formData;
    if (cardNumber.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return 'Expiry must be in MM/YY format';
    if (cvv.length < 3) return 'CVV must be at least 3 digits';
    if (name.trim().length < 3) return 'Please enter a valid cardholder name';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onPaymentSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass-card p-8 shadow-2xl border border-white/10">
        <h2 className="text-2xl font-black mb-2">Secure <span className="text-indigo-400">Payment</span></h2>
        <p className="text-slate-400 text-sm mb-6">Amount to pay: <span className="text-white font-bold text-lg">₹{amount.toFixed(2)}</span></p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Card Number</label>
            <input 
              name="card-number"
              type="text" 
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              className="input-field tracking-widest font-mono"
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Expiry Date</label>
              <input 
                name="expiry-date"
                type="text" 
                autoComplete="cc-exp"
                placeholder="MM/YY"
                className="input-field font-mono"
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">CVV</label>
              <input 
                name="cvv-code"
                type="text" 
                autoComplete="cc-csc"
                maxLength={4}
                placeholder="***"
                className="input-field font-mono"
                value={formData.cvv}
                onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cardholder Name</label>
            <input 
              name="cardholder-name"
              type="text" 
              autoComplete="cc-name"
              placeholder="FULL NAME"
              className="input-field uppercase"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="btn flex-1 bg-slate-800 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary flex-[2] relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : `Pay ₹${amount.toFixed(2)}`}
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-6 uppercase tracking-widest font-bold">
          🔒 Secure SSL Encrypted Connection
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
