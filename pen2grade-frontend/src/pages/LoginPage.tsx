import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { BookOpen, LogIn, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[120px]" />

      <div className="glass-card w-full max-w-[440px] p-8 md:p-10 fade-in relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, var(--color-primary), #8b5cf6)', boxShadow: '0 12px 24px -6px rgba(99, 102, 241, 0.5)' }}>
            <BookOpen size={40} color="white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Pen2Grade <span className="text-indigo-400">AI</span></h1>
          <p className="text-gray-400 text-center text-sm md:text-base font-medium">Empowering teachers with intelligent evaluation</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-red-500/20 bg-red-500/10 text-red-400">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-gray-300 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="input-field pl-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1 text-gray-300 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-4"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5 mt-2 group">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In to Dashboard</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-gray-400 text-sm">
            New to the platform?{' '}
            <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors decoration-2 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
