import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  List, Plus, Edit, Trash2, ArrowLeft, 
  Loader2, AlertTriangle, FileText, Search
} from 'lucide-react';

interface Rubric { 
  _id: string; 
  title: string; 
  criteria: { name: string; weight: number }[]; 
  createdAt: string;
}

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const res = await api.get('/rubrics');
        setRubrics(res.data);
      } catch (err) {
        console.error("Fetch rubrics error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRubrics();
  }, []);

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

  const filteredRubrics = rubrics.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
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
               <List className="text-indigo-500" size={32} />
               Manage Rubrics
            </h1>
            <p className="text-gray-400 font-medium">Create, edit, and organize your evaluation templates</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                placeholder="Search rubrics..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm w-full" 
              />
            </div>
            <Link to="/rubrics/new" className="btn-primary py-2.5 w-full sm:w-auto">
              <Plus size={18} /> New Rubric
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Fetching your templates...</p>
          </div>
        ) : filteredRubrics.length === 0 ? (
          <div className="glass-card p-20 text-center flex flex-col items-center gap-4 border-dashed border-white/5">
             <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 mb-2">
                <FileText size={32} />
             </div>
             <h2 className="text-xl font-bold text-white">No rubrics found</h2>
             <p className="text-gray-500 max-w-xs mx-auto">
                {searchTerm ? `No rubrics match "${searchTerm}"` : "You haven't created any rubrics yet. Start by creating your first template."}
             </p>
             {!searchTerm && (
                <Link to="/rubrics/new" className="text-indigo-400 font-bold hover:underline mt-2">
                   Create your first rubric →
                </Link>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRubrics.map(r => (
              <div key={r._id} className="glass-card flex flex-col group hover:translate-y-[-4px] transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">{r.title}</h3>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{r.criteria.length} Evaluation Criteria</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {r.criteria.slice(0, 3).map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-medium text-gray-400">
                        <span className="truncate pr-4">{c.name}</span>
                        <span className="font-bold text-gray-600 shrink-0">{c.weight}%</span>
                      </div>
                    ))}
                    {r.criteria.length > 3 && (
                       <p className="text-[10px] text-gray-600 font-bold italic">+{r.criteria.length - 3} more criteria...</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                    Created {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link 
                      to={`/rubrics/edit/${r._id}`}
                      className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                      title="Edit Rubric"
                    >
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => deleteRubric(r._id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
                      title="Delete Rubric"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
          <AlertTriangle className="text-amber-500 shrink-0" size={24} />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Note on Deletion</h4>
            <p className="text-xs text-amber-500/70 font-medium leading-relaxed">
              Deleting a rubric will permanently remove the template. This will not affect any essays that have already been graded using this rubric, but you won't be able to select it for future evaluations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
