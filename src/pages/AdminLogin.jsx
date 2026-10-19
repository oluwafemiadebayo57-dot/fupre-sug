import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard'); 
    } catch (err) {
      // THIS IS THE CRUCIAL CHANGE:
      // We are now showing the REAL Firebase error code.
      console.error("Firebase Error:", err.code);
      setError(`Error: ${err.code}`); 
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-fupre-navy w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-fupre-gold" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-fupre-navy">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Restricted to SUG Executives</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center font-mono font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy outline-none"
              placeholder="welfare@fupresug.org"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fupre-navy outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-fupre-navy text-white py-3 rounded-lg font-semibold hover:bg-fupre-light transition flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}