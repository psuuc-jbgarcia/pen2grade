import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  ArrowLeft, CheckCircle, AlertCircle, Loader2, 
  FileText, Sparkles, Target, BarChart3, MessageSquare, 
  History, Download, Share2
} from 'lucide-react';

interface Essay {
  _id: string; studentName: string; status: string; totalScore: number;
  createdAt: string; fileType: string; extractedText: string;
  rubric: { title: string; criteria: { name: string; weight: number }[] };
  aiFeedback: {
    total_score: number; mock_mode: boolean; general_feedback: string;
    grammar_suggestions: string[];
    breakdown: Record<string, { score: number; max: number; feedback: string }>;
  };
}

export default function EssayResultPage() {
  const { id } = useParams();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEssay = async () => {
    try {
      const res = await api.get(`/essays/${id}`);
      setEssay(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEssay();
    // Poll if processing
    const interval = setInterval(() => {
      if (essay?.status === 'processing' || essay?.status === 'pending') {
        fetchEssay();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [id, essay?.status]);

  if (loading && !essay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a] gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
        <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs">Retrieving Report...</p>
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a] text-red-400 p-6 text-center">
        <AlertCircle size={64} className="mb-4" />
        <h1 className="text-2xl font-black">Report Not Found</h1>
        <p className="text-gray-500 mt-2">The essay you're looking for doesn't exist or you don't have access.</p>
        <Link to="/dashboard" className="btn-primary mt-6">Return to Dashboard</Link>
      </div>
    );
  }

  const isCompleted = essay.status === 'completed';
  const isProcessing = essay.status === 'processing' || essay.status === 'pending';

  return (
    <div className="min-h-screen bg-[#0b0f1a] pb-20">
      {/* Dynamic Header */}
      <div className="bg-[#0e1320] border-b border-white/5 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
               <h2 className="text-sm font-black text-white truncate">{essay.studentName}</h2>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  <History size={10} />
                  {new Date(essay.createdAt).toLocaleDateString()}
               </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold hover:bg-white/10 transition-all border border-white/5">
                <Download size={14} /> Export PDF
             </button>
             <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/5">
                <Share2 size={16} />
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary & Breakdown */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Hero Score Card */}
          <div className="glass-card p-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <Sparkles size={160} />
             </div>
             
             <div className="flex flex-col md:flex-row items-center gap-8 p-8 relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                   {/* Circular Score Bar */}
                   <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                      <circle 
                        cx="80" cy="80" r="72" fill="none" stroke="url(#scoreGradient)" strokeWidth="12" 
                        strokeDasharray={452.4} 
                        strokeDashoffset={isCompleted ? 452.4 - (452.4 * (essay.totalScore || 0) / 100) : 452.4}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                   </svg>
                   <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black text-white">{isCompleted ? `${Math.round(essay.totalScore)}` : '?'}</span>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Score / 100</span>
                   </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                   <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20`}>
                        {essay.rubric?.title}
                      </span>
                      {essay.aiFeedback?.mock_mode && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                           DEMO MODE
                        </span>
                      )}
                   </div>
                   <h1 className="text-3xl font-black text-white tracking-tight">Evaluation Report</h1>
                   <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 font-medium">
                      {isProcessing ? (
                        <div className="flex items-center gap-2 text-indigo-400 font-bold animate-pulse">
                          <Loader2 size={16} className="animate-spin" />
                          <span>AI Processing...</span>
                        </div>
                      ) : isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                           <CheckCircle size={16} />
                           <span>Analysis Finalized</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 font-bold">
                           <AlertCircle size={16} />
                           <span>Failed</span>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Criteria Breakdown */}
          {isCompleted && essay.aiFeedback?.breakdown && (
            <div className="glass-card overflow-hidden">
               <div className="p-6 border-b border-white/5 flex items-center gap-3">
                  <BarChart3 className="text-indigo-500" size={20} />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Performance Metrics</h3>
               </div>
               <div className="divide-y divide-white/5">
                  {Object.entries(essay.aiFeedback.breakdown).map(([name, data], idx) => {
                    const pct = data.max > 0 ? (data.score / data.max) * 100 : 0;
                    return (
                      <div key={idx} className="p-6 space-y-4 hover:bg-white/[0.02] transition-colors">
                         <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                               <p className="font-extrabold text-white text-base">{name}</p>
                               <p className="text-xs text-gray-500 font-medium leading-relaxed">{data.feedback}</p>
                            </div>
                            <div className="text-right">
                               <span className="text-lg font-black text-white">{data.score.toFixed(1)}</span>
                               <span className="text-[10px] font-black text-gray-500 block">/ {data.max}</span>
                            </div>
                         </div>
                         <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%` }}
                            />
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Feedback & OCR */}
        <div className="lg:col-span-5 space-y-8">
           {/* Feedback Summary */}
           {isCompleted && essay.aiFeedback?.general_feedback && (
             <div className="glass-card p-6 bg-indigo-600/5 border-indigo-600/20 relative">
                <MessageSquare className="absolute top-6 right-6 text-indigo-500/20" size={40} />
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                   <Target size={14} /> Teacher's Summary
                </h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                   {essay.aiFeedback.general_feedback}
                </p>
             </div>
           )}

           {/* Grammar Box */}
           {isCompleted && essay.aiFeedback?.grammar_suggestions?.length > 0 && (
             <div className="glass-card p-6 bg-pink-600/5 border-pink-600/20 relative">
                <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.2em] mb-4">Writing Suggestions</h3>
                <div className="space-y-3">
                   {essay.aiFeedback.grammar_suggestions.map((s, i) => (
                     <div key={i} className="flex gap-3 text-sm font-medium text-gray-400">
                        <span className="text-pink-500 mt-1">•</span>
                        <span>{s}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Text Content */}
           <div className="glass-card flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-gray-500" /> Essay Content
                 </h3>
                 <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    {essay.fileType} Source
                 </span>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                 {essay.extractedText ? (
                   <pre className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed font-['Inter']">
                     {essay.extractedText}
                   </pre>
                 ) : isProcessing ? (
                   <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                      <Loader2 className="animate-spin mb-3" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Extracting Manuscript...</p>
                   </div>
                 ) : (
                   <p className="text-sm text-gray-600 italic">No text content available.</p>
                 )}
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
