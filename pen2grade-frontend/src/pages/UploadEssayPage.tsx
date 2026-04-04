import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload, FileText, Image as ImageIcon, File, Check, Sparkles, AlertCircle, Camera } from 'lucide-react';

interface Rubric { _id: string; title: string; }

export default function UploadEssayPage() {
  const navigate = useNavigate();
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [rubricId, setRubricId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingUses, setRemainingUses] = useState<number | null>(null);
  const [remainingCameraUses, setRemainingCameraUses] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    api.get('/rubrics').then(res => setRubrics(res.data));
    api.get('/auth/me').then(res => {
      if (res.data?.usage?.remaining !== undefined) setRemainingUses(res.data.usage.remaining);
      if (res.data?.cameraScanUsage?.remaining !== undefined) setRemainingCameraUses(res.data.cameraScanUsage.remaining);
    }).catch(() => { });

    const checkMobile = () => {
      const ua = navigator.userAgent;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTouchDevice = navigator.maxTouchPoints > 1;
      const isNarrow = window.innerWidth <= 768;
      setIsMobile(isMobileUA || (isTouchDevice && isNarrow));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setFile(f);
    setError('');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const fileIcon = () => {
    if (!file) return <Upload size={48} className="text-indigo-500/50" />;
    if (file.type.startsWith('image/')) return <ImageIcon size={48} className="text-indigo-400" />;
    if (file.type === 'application/pdf') return <File size={48} className="text-red-400" />;
    return <FileText size={48} className="text-blue-400" />;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let submissionFile = file;

    if (uploadMode === 'text') {
      if (!pastedText.trim()) { setError('Please paste some text to evaluate.'); return; }
      // Create a virtual file from pasted text
      const blob = new Blob([pastedText], { type: 'text/plain' });
      submissionFile = new (window as any).File([blob], 'pasted-essay.txt', { type: 'text/plain' });
    } else {
      if (!submissionFile) { setError('Please provide the essay file.'); return; }
    }

    if (!rubricId) { setError('A rubric must be selected for evaluation.'); return; }
    if (!submissionFile) { setError('Please provide an essay document or text.'); return; }

    setLoading(true); setError('');

    try {
      const formData = new FormData();
      formData.append('document', submissionFile);
      formData.append('rubricId', rubricId);
      formData.append('studentName', studentName);
      
      if (uploadMode === 'file' && isMobile) {
        formData.append('isCameraScan', 'true');
      }

      const res = await api.post('/essays', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/essays/${res.data.essay._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'The upload pipeline failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="px-6 md:px-10 py-6 shrink-0">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Evaluate Essay</h1>
      </header>

      <div className="px-6 md:px-10 pb-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="glass-card overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-indigo-600/10 to-transparent border-b border-white/5 relative overflow-hidden">
              <Sparkles className="absolute top-8 right-8 text-indigo-500/20" size={120} />
              <div className="relative z-10 space-y-2">
                <h1 className="text-3xl font-black text-white tracking-tight">Ready to Grade?</h1>
                <p className="text-gray-400 font-medium text-sm">Upload images, PDFs, or paste text. Gemini AI handles the rest.</p>
              </div>
            </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3 fade-in">
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Student Identity</label>
                <input
                  required value={studentName} onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g., Maria Santos"
                  className="input-field py-4 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Evaluation Rubric</label>
                <select required value={rubricId} onChange={e => setRubricId(e.target.value)} className="input-field py-4 font-bold appearance-none bg-black/40">
                  <option value="" disabled>Select target rubric</option>
                  {rubrics.map(r => <option key={r._id} value={r._id} className="bg-surface">{r.title}</option>)}
                </select>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="p-1 bg-black/40 rounded-2xl flex border border-white/5">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${uploadMode === 'file' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <Upload size={18} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${uploadMode === 'text' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                <FileText size={18} /> Paste Text
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Document Upload</label>



                <div
                  className={`relative rounded-3xl p-12 text-center transition-all cursor-pointer border-2 border-dashed group ${dragOver ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]' : 'border-white/10 bg-black/20 hover:border-white/20'
                    }`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input id="file-input" type="file" accept=".jpg,.jpeg,.png,.pdf,.txt" capture={isMobile ? "environment" : undefined} className="hidden" onChange={onFileChange} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      {isMobile && !file ? <Camera size={48} className="text-indigo-400" /> : fileIcon()}
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="font-black text-white text-lg">{file.name}</p>
                        <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                          <Check size={14} /> Ready for analysis ({(file.size / 1024).toFixed(1)} KB)
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-bold text-gray-300 text-lg">{isMobile ? "Tap to open Camera" : "Drop your essay here"}</p>
                        <p className="text-sm text-gray-500">{isMobile ? "Scan your handwritten essay instantly" : "JPG, PNG, PDF, or Plain Text (Max 10MB)"}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 fade-in">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Paste Essay Text</label>
                <textarea
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  placeholder="Paste the student's essay or any text content here..."
                  className="input-field min-h-[300px] resize-none font-medium leading-relaxed"
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit" disabled={loading || (uploadMode === 'file' ? !file : !pastedText.trim())}
                className={`btn-primary w-full justify-center py-5 text-lg group ${((uploadMode === 'file' ? !file : !pastedText.trim()) || loading) ? 'grayscale opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={24} className={loading ? 'animate-spin' : 'group-hover:scale-125 transition-transform'} />
                  <span className="font-extrabold tracking-tight">
                    {loading ? 'AI Analyzing Essay...' : 'Start Evaluation Pipeline'}
                  </span>
                </div>
              </button>
              <div className="text-center mt-6 space-y-1">
                <p className="text-[12px] text-gray-400 font-bold tracking-wide">
                  {remainingUses !== null ? `Free Version: You have ${remainingUses} AI uses left today.` : 'Free Version: 10 AI uses per day.'}
                </p>
                {isMobile && uploadMode === 'file' && (
                  <p className="text-[12px] text-indigo-400 font-bold tracking-wide fade-in mt-1">
                    {remainingCameraUses !== null ? `Camera Scanner: ${remainingCameraUses} scans remaining today.` : 'Camera Scanner: 3 scans per day.'}
                  </p>
                )}
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-black pt-3">Powered by Google Gemini 2.5 Flash</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
