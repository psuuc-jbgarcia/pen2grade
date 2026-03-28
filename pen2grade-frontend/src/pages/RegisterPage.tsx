import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, UserPlus, ChevronRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration submit error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]" />

      <Link to="/login" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors group z-20">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Sign In
      </Link>

      <div className="glass-card w-full max-w-[480px] p-8 md:p-10 fade-in relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-5 rotate-[-3deg] hover:rotate-0 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, var(--color-primary), #c084fc)', boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4)' }}>
            <BookOpen size={30} color="white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-400 text-center text-sm font-medium">Join thousands of teachers using Pen2Grade AI</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border border-red-500/20 bg-red-500/10 text-red-400">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold ml-1 text-gray-400 uppercase tracking-widest">Full Name</label>
            <div className="relative group">
              <input
                type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Professor Maria Santos"
                className="input-field pl-4"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold ml-1 text-gray-400 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <input
                type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="m.santos@university.edu"
                className="input-field pl-4"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold ml-1 text-gray-400 uppercase tracking-widest">Secure Password</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"} required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="input-field pl-4 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5 mt-4 group">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                <span>Create Teacher Account</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-bold hover:text-indigo-300 transition-colors decoration-indigo-500/30 underline-offset-4 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
