import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, ArrowLeft, Save, Info, AlertCircle, Loader2 } from 'lucide-react';

interface Criterion { name: string; weight: number; description: string; }

export default function NewRubricPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { name: 'Content', weight: 40, description: 'Depth and relevance of ideas' },
    { name: 'Grammar', weight: 20, description: 'Spelling, punctuation, and sentence structure' },
    { name: 'Organization', weight: 20, description: 'Logical flow and structure' },
    { name: 'Originality', weight: 20, description: 'Unique perspective and creativity' },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchRubric = async () => {
        try {
          const res = await api.get(`/rubrics/${id}`);
          setTitle(res.data.title);
          setCriteria(res.data.criteria);
        } catch (err: any) {
          setError('Failed to load rubric details.');
        } finally {
          setFetching(false);
        }
      };
      fetchRubric();
    }
  }, [id, isEdit]);

  const totalWeight = criteria.reduce((acc, c) => acc + Number(c.weight), 0);

  const addCriterion = () => setCriteria([...criteria, { name: '', weight: 0, description: '' }]);
  const removeCriterion = (i: number) => setCriteria(criteria.filter((_, idx) => idx !== i));
  const updateCriterion = (i: number, field: keyof Criterion, value: string | number) => {
    const updated = [...criteria];
    (updated[i] as any)[field] = value;
    setCriteria(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) { 
      setError('The sum of all criteria weights must equal 100% strictly.'); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; 
    }
    setLoading(true); setError('');
    try {
      if (isEdit) {
        await api.put(`/rubrics/${id}`, { title, criteria });
      } else {
        await api.post('/rubrics', { title, criteria });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to preserve the rubric. Check your connection.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 bg-[#0b0f1a]">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {fetching ? (
          <div className="glass-card p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Rubric Details...</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="p-6 md:p-8 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {isEdit ? 'Refine Rubric' : 'Design Rubric'}
                </h1>
                <p className="text-sm text-gray-400 font-medium">Define how the AI should evaluate your students' work</p>
              </div>
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${totalWeight === 100 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${totalWeight === 100 ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-sm font-black">Total: {totalWeight}%</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {error && (
              <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3 fade-in">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                Rubric Title
                <Info size={14} className="text-gray-600" />
              </label>
              <input 
                required value={title} onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Q1 Argumentative Essay Rubric" 
                className="input-field py-4 text-lg font-bold" 
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Criteria Breakdown</label>
              </div>

              <div className="grid gap-4">
                {criteria.map((c, i) => (
                  <div key={i} className="glass-card bg-white/5 p-5 md:p-6 border-white/5 space-y-4 relative group hover:border-white/10">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Criterion Name</label>
                        <input
                          required value={c.name} placeholder="e.g., Critical Thinking"
                          onChange={e => updateCriterion(i, 'name', e.target.value)}
                          className="input-field bg-black/20"
                        />
                      </div>
                      <div className="w-full md:w-32 space-y-1.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase">Weight (%)</label>
                        <div className="relative">
                          <input
                            required type="number" min="1" max="100" value={c.weight}
                            onChange={e => updateCriterion(i, 'weight', Number(e.target.value))}
                            className="input-field bg-black/20 pr-10"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 uppercase">Aspiration / Description</label>
                      <textarea
                        rows={2}
                        value={c.description} placeholder="Define what excellence looks like for this criterion..."
                        onChange={e => updateCriterion(i, 'description', e.target.value)}
                        className="input-field bg-black/20 resize-none"
                      />
                    </div>
                    {criteria.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCriterion(i)} 
                        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button 
                type="button" onClick={addCriterion} 
                className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-all font-bold flex items-center justify-center gap-2 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Add New Criterion
              </button>
            </div>

            <div className="pt-8 space-y-4">
               <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-lg">
                <Save size={20} />
                {loading ? 'Finalizing Rubric...' : isEdit ? 'Update Rubric Changes' : 'Save & Active Rubric'}
              </button>
              <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">You can edit this rubric anytime after saving</p>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}
