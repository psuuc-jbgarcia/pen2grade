import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  BookOpen, FileText, List, LogOut, Plus, 
  CheckCircle, Clock, AlertCircle, Loader2, 
  ChevronRight, LayoutDashboard,
  Filter, Edit, Trash2, AlertTriangle
} from 'lucide-react';
import InstallPWA from '../components/InstallPWA';

interface Essay { 
  _id: string; 
  studentName: string; 
  status: string; 
  totalScore: number; 
  createdAt: string; 
  rubric: { title: string }; 
}

interface Rubric { 
  _id: string; 
  title: string; 
  criteria: { name: string; weight: number }[]; 
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [essayRes, rubricRes] = await Promise.all([
          api.get('/essays'),
          api.get('/rubrics')
        ]);
        setEssays(essayRes.data);
        setRubrics(rubricRes.data);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Essays',   value: essays.length, icon: <FileText size={22} />, color: 'from-blue-600 to-indigo-600' },
    { label: 'Graded',         value: essays.filter(e => e.status === 'completed').length, icon: <CheckCircle size={22} />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Processing',     value: essays.filter(e => e.status === 'processing').length, icon: <Loader2 size={22} />, color: 'from-purple-500 to-indigo-600' },
    { label: 'Active Rubrics', value: rubrics.length, icon: <List size={22} />, color: 'from-amber-400 to-orange-600' },
  ];

  const statusBadge = (s: string) => {
    const configs: any = {
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: <CheckCircle size={12} /> },
      processing: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', icon: <Loader2 size={12} className="animate-spin" /> },
      failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: <AlertCircle size={12} /> },
      pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: <Clock size={12} /> },
    };
    const c = configs[s] || configs.pending;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
        {c.icon} {s}
      </div>
    );
  };

  const deleteRubric = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this rubric? This action cannot be undone.')) return;
    try {
      await api.delete(`/rubrics/${id}`);
      setRubrics(rubrics.filter(r => r._id !== id));
    } catch (err) {
      console.error("Delete error", err);
      alert('Failed to delete rubric.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f1a]">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-surface/50 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-500" />
          <span className="font-bold text-white tracking-tight">Pen2Grade</span>
        </div>
        <button onClick={() => logout()} className="p-2 text-gray-400"><LogOut size={18} /></button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0e1320] p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BookOpen color="white" size={24} />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">Pen2Grade</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-semibold transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="hidden md:flex items-center justify-between px-10 py-6 shrink-0">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Overview</h1>
            <div className="flex items-center gap-4">
              <InstallPWA />
              <div className="relative">
                <input placeholder="Search essays..." className="bg-white/5 border border-white/5 rounded-full py-2 pl-4 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 w-64 transition-all" />
              </div>
              <Link to="/essays/upload" className="btn-primary py-2.5">
                <Plus size={18} /> Upload Essay
              </Link>
            </div>
        </header>

        <section className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 space-y-10 pt-6 md:pt-0 custom-scrollbar">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-5 md:p-6 group hover:translate-y-[-4px] transition-all cursor-default">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {s.icon}
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{loading ? '...' : s.value}</div>
                <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Recent Submissions Table */}
            <div className="xl:col-span-8 space-y-4">
              <div className="glass-card flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4 text-white">
                  <h2 className="text-lg font-extrabold flex items-center gap-2">
                    Recent Submissions
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Updates</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors"><Filter size={18} /></button>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[600px] text-left">
                    <thead className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Result</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        [1,2,3].map(i => (
                          <tr key={i}>
                            <td colSpan={4} className="px-6 py-8"><div className="h-4 skeleton w-full" /></td>
                          </tr>
                        ))
                      ) : essays.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <FileText size={40} className="text-gray-700" />
                              <p className="text-gray-500 font-medium">No essays found.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {essays.slice(0, 3).map((e) => (
                            <tr key={e._id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3 text-white">
                                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                                    {e.studentName.charAt(0)}
                                  </div>
                                  <span className="text-sm font-bold">{e.studentName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                {statusBadge(e.status)}
                              </td>
                              <td className="px-6 py-5">
                                {e.totalScore != null ? (
                                  <span className="text-sm font-black text-emerald-400">{e.totalScore.toFixed(0)}%</span>
                                ) : (
                                  <span className="text-gray-600">—</span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <Link 
                                  to={`/essays/${e._id}`} 
                                  className="bg-white/5 hover:bg-indigo-600 hover:text-white p-2 rounded-lg transition-all inline-flex text-gray-400"
                                >
                                  <ChevronRight size={16} />
                                </Link>
                              </td>
                            </tr>
                          ))}
                          {essays.length > 3 && (
                            <tr>
                              <td colSpan={4} className="p-0">
                                <Link 
                                  to="/essays" 
                                  className="flex items-center justify-center gap-2 py-4 px-6 w-full text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-indigo-400 hover:bg-white/[0.02] transition-all bg-white/[0.01]"
                                >
                                  View All Submissions ({essays.length})
                                  <ChevronRight size={14} />
                                </Link>
                              </td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rubrics Management Section */}
            <div className="xl:col-span-4 space-y-4">
               <div className="glass-card flex flex-col h-full">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between text-white">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                       <List size={16} className="text-indigo-500" /> My Rubrics
                    </h2>
                    <Link to="/rubrics/new" className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">
                       <Plus size={16} />
                    </Link>
                  </div>
                  <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                      <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gray-700" /></div>
                    ) : rubrics.length === 0 ? (
                      <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl">
                         <p className="text-xs text-gray-500 font-bold uppercase">No rubrics yet</p>
                      </div>
                    ) : (
                      rubrics.map(r => (
                        <div key={r._id} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                           <div className="min-w-0">
                              <p className="text-sm font-bold text-white truncate">{r.title}</p>
                              <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{r.criteria.length} Criteria</p>
                           </div>
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link to={`/rubrics/edit/${r._id}`} className="p-2 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all">
                                 <Edit size={14} />
                              </Link>
                              <button onClick={() => deleteRubric(r._id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-4 border-t border-white/5 mt-auto">
                     <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                        <p className="text-[10px] text-amber-500/80 font-medium leading-relaxed uppercase tracking-tight">Deleting a rubric will not affect existing essay reports.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
