import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  FileText, ArrowLeft, Loader2, 
  ChevronRight, Search, Filter,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';

interface Essay { 
  _id: string; 
  studentName: string; 
  status: string; 
  totalScore: number; 
  createdAt: string; 
  rubric: { title: string }; 
}

export default function AllEssaysPage() {
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEssays = async () => {
      try {
        const res = await api.get('/essays');
        setEssays(res.data);
      } catch (err) {
        console.error("Fetch essays error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEssays();
  }, []);

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

  const filteredEssays = essays.filter(e => 
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.rubric?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#0b0f1a]">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
               <FileText className="text-indigo-500" size={32} />
               All Submissions
            </h1>
            <p className="text-gray-400 font-medium">History of all evaluated essays and reports</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                placeholder="Search students or rubrics..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm w-full" 
              />
            </div>
          </div>
        </header>

        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between flex-wrap gap-4 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold">Finalized Reports</h2>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {filteredEssays.length} Total
              </span>
            </div>
            <button className="p-2 text-gray-500 hover:text-white transition-colors"><Filter size={18} /></button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[700px] text-left">
              <thead className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Rubric</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-8"><div className="h-4 skeleton w-full" /></td>
                    </tr>
                  ))
                ) : filteredEssays.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={40} className="text-gray-700" />
                        <p className="text-gray-500 font-medium">{searchTerm ? 'No matches found.' : 'No submissions found.'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEssays.map((e) => (
                    <tr key={e._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                            {e.studentName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold">{e.studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                        {e.rubric?.title}
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
                      <td className="px-6 py-5 text-xs text-gray-500 font-bold uppercase">
                        {new Date(e.createdAt).toLocaleDateString()}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
