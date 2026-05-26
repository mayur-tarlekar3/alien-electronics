import { useState } from 'react';
import { sendContactMessage } from '../api';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await sendContactMessage(formData.name, formData.email, formData.comments);
      if (response.data.status === 'success') {
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
        setFormData({ name: '', email: '', comments: '' });
      } else {
        setStatus({ type: 'error', message: response.data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="glass-card overflow-hidden grid md:grid-cols-2 shadow-2xl">
          <div className="p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-black mb-6">Get in <span className="text-pink-300">Touch</span></h1>
              <p className="text-indigo-100 text-lg mb-8">
                Have questions about our products or your order? Our team is here to help you 24/7.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-indigo-200">Email Us</p>
                    <p className="font-bold">pdorganization199@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-indigo-200">Visit Us</p>
                    <p className="font-bold">123 Tech Lane, Silicon Valley, CA</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/10">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center justify-center">
                  <span className="font-bold">f</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center justify-center">
                  <span className="font-bold">t</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center justify-center">
                  <span className="font-bold">i</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-12">
            <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
            
            {status.message && (
              <div className={`p-4 rounded-xl mb-6 border ${
                status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
              }`}>
                {status.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Your Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  required 
                />
              </div>
              
              <div className="input-group">
                <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea 
                  className="input-field h-32 resize-none" 
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="How can we help you?" 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full shadow-xl shadow-indigo-500/20 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
