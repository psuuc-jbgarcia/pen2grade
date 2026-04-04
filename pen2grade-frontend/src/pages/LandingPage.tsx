import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Zap, ShieldCheck, BarChart3, ChevronRight,
  CheckCircle2, ArrowRight, Sparkles, Clock,
  FileText, Brain, GraduationCap, Menu, X, Star, Edit3, Camera
} from 'lucide-react';

// ─── Feature Card ─────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, gradient, delay }: {
  icon: React.ReactNode; title: string; desc: string; gradient: string; delay: number
}) {
  return (
    <div
      className="feature-card group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="icon-wrap"
        style={{ background: gradient }}
      >
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

// ─── Step Card ────────────────────────────────────────────────────
function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="step-card">
      <div className="step-num">{num}</div>
      <h3 className="step-title">{title}</h3>
      <p className="step-desc">{desc}</p>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gradedCount, setGradedCount] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // VITE_API_URL is e.g. "http://localhost:3000/api"
    // Strip trailing /api so we can build the full /api/stats path correctly.
    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
    const base = apiUrl.replace(/\/api\/?$/, '');
    fetch(`${base}/api/stats`)
      .then(r => r.json())
      .then(d => setGradedCount(d.gradedEssays ?? 0))
      .catch(() => setGradedCount(0));
  }, []);

  return (
    <>
      <style>{`
        /* ── Reset & Base ── */
        .lp-root { font-family: 'Inter', system-ui, sans-serif; color: #f9fafb; overflow-x: hidden; }

        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 1rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          background: rgba(11,15,26,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .nav-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
        .nav-logo-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }
        .nav-logo-text { font-size: 1.15rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .nav-logo-text span { color: #818cf8; }
        .nav-links { display: flex; align-items: center; gap: 0.25rem; }
        .nav-link {
          padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.9rem; font-weight: 500;
          color: #94a3b8; text-decoration: none; transition: all 0.2s;
        }
        .nav-link:hover { color: #f9fafb; background: rgba(255,255,255,0.06); }
        .nav-actions { display: flex; align-items: center; gap: 0.75rem; }
        .btn-nav-login {
          padding: 0.5rem 1.25rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
          color: #a5b4fc; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
          text-decoration: none; transition: all 0.2s;
        }
        .btn-nav-login:hover { background: rgba(99,102,241,0.2); color: #c7d2fe; }
        .btn-nav-cta {
          padding: 0.5rem 1.25rem; border-radius: 10px; font-size: 0.9rem; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; text-decoration: none; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }
        .btn-nav-cta:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.45); }
        .hamburger { display: none; background: none; border: none; cursor: pointer; color: #94a3b8; }
        .mobile-menu {
          display: none; flex-direction: column; gap: 0.5rem;
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(11,15,26,0.97); backdrop-filter: blur(20px);
          padding: 1.25rem 2rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          padding: 0.65rem 1rem; border-radius: 10px; font-weight: 600;
          color: #94a3b8; text-decoration: none; transition: all 0.2s;
        }
        .mobile-link:hover { color: #f9fafb; background: rgba(255,255,255,0.07); }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 7rem 1.5rem 5rem;
          position: relative; overflow: hidden;
        }
        .hero-blob-1 {
          position: absolute; width: 60%; height: 60%; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          top: -10%; left: -15%; filter: blur(60px); animation: blobFloat 10s ease-in-out infinite alternate;
        }
        .hero-blob-2 {
          position: absolute; width: 50%; height: 50%; border-radius: 50%;
          background: radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%);
          bottom: -15%; right: -10%; filter: blur(60px); animation: blobFloat 12s ease-in-out infinite alternate-reverse;
        }
        .hero-blob-3 {
          position: absolute; width: 35%; height: 35%; border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%);
          top: 30%; right: 5%; filter: blur(80px); animation: blobFloat 8s ease-in-out infinite alternate;
        }
        @keyframes blobFloat {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(30px, -20px) scale(1.05); }
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.4rem 1rem; border-radius: 100px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          color: #a5b4fc; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em;
          text-transform: uppercase; margin-bottom: 1.75rem;
          animation: fadeUp 0.6s ease-out both;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; line-height: 1.08;
          letter-spacing: -0.03em; margin-bottom: 1.5rem; max-width: 820px;
          animation: fadeUp 0.6s 0.1s ease-out both;
        }
        .hero-title-gradient {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem); color: #94a3b8; max-width: 580px;
          line-height: 1.7; margin-bottom: 2.75rem;
          animation: fadeUp 0.6s 0.2s ease-out both;
        }
        .hero-actions {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
          animation: fadeUp 0.6s 0.3s ease-out both; margin-bottom: 4rem;
        }
        .btn-hero-primary {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 2rem; border-radius: 14px; font-size: 1rem; font-weight: 700;
          color: #fff; background: linear-gradient(135deg, #6366f1, #8b5cf6);
          text-decoration: none; border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 8px 20px -4px rgba(99,102,241,0.5);
          transition: all 0.25s cubic-bezier(.4,0,.2,1);
        }
        .btn-hero-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -4px rgba(99,102,241,0.55); filter: brightness(1.1); }
        .btn-hero-secondary {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 2rem; border-radius: 14px; font-size: 1rem; font-weight: 600;
          color: #e2e8f0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          text-decoration: none; transition: all 0.2s ease;
        }
        .btn-hero-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

        /* ── Stats ── */
        .stats-band {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 0;
          animation: fadeUp 0.6s 0.4s ease-out both;
        }
        .stat-item {
          display: flex; flex-direction: column; align-items: center;
          padding: 1.25rem 2.5rem; position: relative;
        }
        .stat-item:not(:last-child)::after {
          content:''; position: absolute; right: 0; top: 20%; height: 60%;
          width: 1px; background: rgba(255,255,255,0.08);
        }
        .stat-num { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; background: linear-gradient(135deg, #fff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 0.78rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.25rem; }

        /* ── Section Shared ── */
        .section { padding: 6rem 1.5rem; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: #818cf8; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 1rem;
        }
        .section-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 1rem; line-height: 1.15; }
        .section-sub { color: #64748b; font-size: 1.05rem; max-width: 540px; line-height: 1.7; }

        /* ── Features ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem; margin-top: 3.5rem;
        }
        .feature-card {
          background: rgba(22,30,46,0.7); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 2rem;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          animation: fadeUp 0.5s ease-out both;
        }
        .feature-card:hover { transform: translateY(-6px); border-color: rgba(99,102,241,0.3); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.1); }
        .icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }
        .feature-title { font-size: 1.05rem; font-weight: 800; margin-bottom: 0.6rem; }
        .feature-desc { font-size: 0.88rem; color: #64748b; line-height: 1.65; }

        /* ── How It Works ── */
        .hiw-section { background: rgba(16,22,36,0.5); }
        .steps-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem; margin-top: 3.5rem; position: relative;
        }
        .steps-grid::before {
          content: ''; position: absolute; top: 36px; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
        }
        .step-card {
          background: rgba(22,30,46,0.6); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 2rem 1.5rem; text-align: center;
          transition: transform 0.3s ease;
        }
        .step-card:hover { transform: translateY(-4px); }
        .step-num {
          width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 1.25rem;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.9rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }
        .step-title { font-size: 1rem; font-weight: 800; margin-bottom: 0.5rem; }
        .step-desc { font-size: 0.85rem; color: #64748b; line-height: 1.6; }

        /* ── Benefits / Checklist ── */
        .benefits-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem 3rem;
          margin-top: 3.5rem; align-items: start;
        }
        .benefit-list { display: flex; flex-direction: column; gap: 1rem; }
        .benefit-item { display: flex; align-items: flex-start; gap: 0.85rem; }
        .benefit-icon { color: #6366f1; flex-shrink: 0; margin-top: 1px; }
        .benefit-text h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
        .benefit-text p { font-size: 0.85rem; color: #64748b; line-height: 1.55; }
        .benefit-visual {
          background: rgba(22,30,46,0.8); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 20px; padding: 2rem; position: relative; overflow: hidden;
        }
        .benefit-visual::before {
          content: ''; position: absolute; top: -50%; right: -30%;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
        }
        .score-circle {
          width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 1.5rem;
          background: conic-gradient(#6366f1 0% 88%, rgba(255,255,255,0.05) 88% 100%);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 10px rgba(99,102,241,0.08), 0 0 40px rgba(99,102,241,0.2);
          position: relative;
        }
        .score-circle-inner {
          width: 90px; height: 90px; border-radius: 50%;
          background: #0b0f1a; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .score-val { font-size: 1.6rem; font-weight: 900; color: #818cf8; }
        .score-lbl { font-size: 0.6rem; color: #64748b; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
        .result-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
        .pill {
          padding: 0.35rem 0.85rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600;
          border: 1px solid;
        }
        .pill.green { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.3); color: #34d399; }
        .pill.blue  { background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.3); color: #60a5fa; }
        .pill.purple{ background: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.3); color: #a78bfa; }
        .pill.pink  { background: rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.3); color: #f472b6; }

        /* ── Testimonials ── */
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 3.5rem; }
        .testi-card {
          background: rgba(22,30,46,0.7); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px; padding: 1.75rem; transition: transform 0.3s ease;
        }
        .testi-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.2); }
        .testi-stars { display: flex; gap: 2px; margin-bottom: 1rem; }
        .testi-text { font-size: 0.9rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1.25rem; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 0.75rem; }
        .testi-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; flex-shrink: 0;
        }
        .testi-name { font-size: 0.875rem; font-weight: 700; }
        .testi-role { font-size: 0.75rem; color: #64748b; }

        /* ── CTA Banner ── */
        .cta-section {
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1));
          border-top: 1px solid rgba(99,102,241,0.15);
          border-bottom: 1px solid rgba(99,102,241,0.15);
        }
        .cta-inner {
          max-width: 700px; margin: 0 auto; text-align: center; padding: 5rem 1.5rem;
        }
        .cta-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 1rem; }
        .cta-sub { color: #94a3b8; font-size: 1.05rem; margin-bottom: 2.5rem; line-height: 1.6; }
        .cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

        /* ── Footer ── */
        .footer-wrap {
          border-top: 1px solid rgba(255,255,255,0.06);
          margin-top: 0;
        }
        .footer-top {
          max-width: 1100px; margin: 0 auto;
          padding: 3.5rem 1.5rem 2.5rem;
          display: grid; grid-template-columns: 1.6fr 1fr 1fr;
          gap: 2.5rem;
        }
        .footer-brand { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; margin-bottom: 0.85rem; }
        .footer-brand-text { font-size: 1.05rem; font-weight: 800; color: #fff; }
        .footer-brand-text span { color: #818cf8; }
        .footer-tagline { font-size: 0.85rem; color: #475569; line-height: 1.65; max-width: 260px; }
        .footer-col-title { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 1rem; }
        .footer-col-links { display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-link { color: #475569; font-size: 0.875rem; text-decoration: none; transition: color 0.2s; width: fit-content; }
        .footer-link:hover { color: #94a3b8; }
        .footer-bottom {
          max-width: 1100px; margin: 0 auto;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
        }
        .footer-copy { font-size: 0.78rem; color: #1f2937; }
        .footer-dev { font-size: 0.78rem; color: #374151; }
        .footer-dev span { color: #4b5563; font-weight: 600; }
        @media (max-width: 640px) {
          .footer-top { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .hamburger { display: flex; }
          .hero { padding: 6rem 1.25rem 4rem; }
          .benefits-grid { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
          .stat-item:not(:last-child)::after { display: none; }
          .stats-band { gap: 0.5rem; }
          .stat-item { padding: 1rem 1.5rem; }
          .footer { flex-direction: column; align-items: flex-start; }
          .footer-credit { text-align: left; }
        }
      `}</style>

      <div className="lp-root" style={{ background: 'var(--color-bg)' }}>

        {/* ─── Navbar ─────────────────────────────── */}
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <BookOpen size={20} color="white" />
            </div>
            <span className="nav-logo-text">Pen2Grade <span>AI</span></span>
          </Link>

          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#benefits" className="nav-link">Benefits</a>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="btn-nav-login">Sign In</Link>
            <Link to="/register" className="btn-nav-cta">Get Started</Link>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
            <a href="#features" className="mobile-link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="mobile-link" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#benefits" className="mobile-link" onClick={() => setMenuOpen(false)}>Benefits</a>
            <Link to="/login" className="mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/register" className="btn-nav-cta" style={{ marginTop: '0.5rem', textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Get Started Free</Link>
          </div>
        </nav>

        {/* ─── Hero ─────────────────────────────────── */}
        <section className="hero">
          <div className="hero-blob-1" />
          <div className="hero-blob-2" />
          <div className="hero-blob-3" />

          <div className="hero-badge" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge-dot" />
            <Sparkles size={12} />
            AI-Powered Essay Grading — Now Available
          </div>

          <h1 className="hero-title" style={{ position: 'relative', zIndex: 1 }}>
            Grade Essays Smarter,<br />
            <span className="hero-title-gradient">Not Harder</span>
          </h1>

          <p className="hero-sub" style={{ position: 'relative', zIndex: 1 }}>
            Pen2Grade AI automates essay evaluation with intelligent rubric-based grading, AI analysis, and plagiarism detection — saving teachers hours every week.
          </p>

          <div className="hero-actions" style={{ position: 'relative', zIndex: 1 }}>
            <Link to="/register" className="btn-hero-primary">
              <GraduationCap size={20} />
              Start Grading Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              <LogIn />
              Sign In
            </Link>
          </div>

          {gradedCount !== null && (
            <div className="stats-band" style={{ position: 'relative', zIndex: 1 }}>
              <div className="stat-item">
                <span className="stat-num">{gradedCount.toLocaleString()}</span>
                <span className="stat-label">Essays Graded</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">0%</span>
                <span className="stat-label">Time Saved</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">0%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">0+</span>
                <span className="stat-label">Teachers Trust</span>
              </div>
            </div>
          )}
        </section>

        {/* ─── Features ─────────────────────────────── */}
        <section id="features" className="section">
          <div className="section-inner">
            <div style={{ textAlign: 'center' }}>
              <div className="section-tag" style={{ justifyContent: 'center' }}>
                <Zap size={14} />
                Core Features
              </div>
              <h2 className="section-title">Everything You Need to Grade<br />with Confidence</h2>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                Powerful tools built specifically for educators who want to save time without sacrificing quality.
              </p>
            </div>

            <div className="features-grid">
              <FeatureCard
                icon={<Brain size={24} color="white" />}
                title="AI-Powered Evaluation"
                desc="Gemini AI analyzes essays against your custom rubric, providing detailed scores and actionable feedback in seconds."
                gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
                delay={0}
              />
              <FeatureCard
                icon={<ShieldCheck size={24} color="white" />}
                title="Plagiarism Detection"
                desc="Advanced similarity checking flags copied content instantly, helping you maintain academic integrity."
                gradient="linear-gradient(135deg, #0ea5e9, #2563eb)"
                delay={100}
              />
              <FeatureCard
                icon={<FileText size={24} color="white" />}
                title="Custom Rubric Builder"
                desc="Create, save and reuse detailed rubrics tailored to any subject, grade level, or assignment type."
                gradient="linear-gradient(135deg, #10b981, #059669)"
                delay={200}
              />
              <FeatureCard
                icon={<BarChart3 size={24} color="white" />}
                title="Detailed Analytics"
                desc="Track student performance over time with clear score breakdowns and category-level insights."
                gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                delay={300}
              />
              <FeatureCard
                icon={<Clock size={24} color="white" />}
                title="Instant Results"
                desc="Get comprehensive evaluation reports within seconds — no more overnight grading sessions."
                gradient="linear-gradient(135deg, #ec4899, #be185d)"
                delay={400}
              />
              <FeatureCard
                icon={<Edit3 size={24} color="white" />}
                title="Teacher Score Override"
                desc="Maintain full control with the ability to manually adjust AI-generated scores and feedback as needed."
                gradient="linear-gradient(135deg, #6366f1, #4338ca)"
                delay={500}
              />
              <FeatureCard
                icon={<Camera size={24} color="white" />}
                title="In-Browser Mobile Scanning"
                desc="Easily scan handwritten essays using your smartphone camera for instant evaluation."
                gradient="linear-gradient(135deg, #6366f1, #ec4899)"
                delay={600}
              />
            </div>
          </div>
        </section>

        {/* ─── How It Works ─────────────────────────── */}
        <section id="how-it-works" className="section hiw-section">
          <div className="section-inner">
            <div style={{ textAlign: 'center' }}>
              <div className="section-tag" style={{ justifyContent: 'center' }}>
                <CheckCircle2 size={14} />
                Simple Process
              </div>
              <h2 className="section-title">Grade in 4 Simple Steps</h2>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                From upload to detailed results in under a minute.
              </p>
            </div>

            <div className="steps-grid">
              <StepCard num="01" title="Build Your Rubric" desc="Define grading criteria, weights, and scoring bands using our intuitive rubric builder." />
              <StepCard num="02" title="Upload the Essay" desc="Paste or upload any essay — handwritten scans, PDFs, or plain text all work seamlessly." />
              <StepCard num="03" title="AI Evaluates Instantly" desc="Gemini AI scores the essay against your rubric and detects potential plagiarism in real time." />
              <StepCard num="04" title="Review & Deliver" desc="Review the detailed breakdown, adjust if needed, and share results with students in one click." />
            </div>
          </div>
        </section>

        {/* ─── Benefits ─────────────────────────────── */}
        <section id="benefits" className="section">
          <div className="section-inner">
            <div className="benefits-grid">
              <div>
                <div className="section-tag">
                  <Star size={14} />
                  Why Teachers Love It
                </div>
                <h2 className="section-title">Built for Real Educators</h2>
                <p className="section-sub" style={{ marginBottom: '2rem' }}>
                  Pen2Grade AI fits seamlessly into any teacher's workflow — no tech skills required.
                </p>
                <div className="benefit-list">
                  {[
                    { title: 'Save 5+ Hours Per Week', desc: 'Automate the most tedious part of teaching and reclaim your time.' },
                    { title: 'Consistent, Bias-Free Grading', desc: 'Every essay is evaluated against the exact same criteria, every time.' },
                    { title: 'Rubric Reuse Across Classes', desc: 'Build once, reuse forever — across subjects, sections, and school years.' },
                    { title: 'Instant Student Feedback', desc: 'Students get detailed, constructive feedback minutes after submission.' },
                    { title: 'Full Data Privacy', desc: 'Your essays and rubrics are securely stored and never shared.' },
                  ].map((b) => (
                    <div className="benefit-item" key={b.title}>
                      <CheckCircle2 className="benefit-icon" size={20} />
                      <div className="benefit-text">
                        <h4>{b.title}</h4>
                        <p>{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="benefit-visual">
                <div className="score-circle">
                  <div className="score-circle-inner">
                    <span className="score-val">88</span>
                    <span className="score-lbl">/ 100</span>
                  </div>
                </div>
                <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Essay Score Breakdown</p>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Graded against your custom rubric</p>
                <div className="result-pills">
                  <span className="pill green">✓ Content — 28/30</span>
                  <span className="pill blue">✓ Organization — 22/25</span>
                  <span className="pill purple">✓ Grammar — 18/20</span>
                  <span className="pill pink">✓ Originality — 20/25</span>
                </div>
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginBottom: '0.35rem' }}>✓ No Plagiarism Detected</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                    "Strong thesis with well-structured arguments. Consider expanding the conclusion to reinforce your key points."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ─── CTA Banner ───────────────────────────── */}
        <section className="cta-section">
          <div className="cta-inner">
            <div className="section-tag" style={{ justifyContent: 'center' }}>
              <Sparkles size={14} />
              Get Started Today
            </div>
            <h2 className="cta-title">
              Ready to Transform<br />
              <span className="hero-title-gradient">Your Grading Workflow?</span>
            </h2>
            <p className="cta-sub">
              Join hundreds of educators already saving time and grading with more confidence using Pen2Grade AI.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn-hero-primary">
                <GraduationCap size={20} />
                Create Free Account
                <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Footer ───────────────────────────────── */}
        <footer className="footer-wrap">
          <div className="footer-top">
            {/* Brand col */}
            <div>
              <Link to="/" className="footer-brand">
                <div className="nav-logo-icon" style={{ width: 34, height: 34 }}>
                  <BookOpen size={17} color="white" />
                </div>
                <span className="footer-brand-text">Pen2Grade <span>AI</span></span>
              </Link>
              <p className="footer-tagline">
                Intelligent essay grading powered by Gemini AI — helping educators evaluate faster, fairer, and smarter.
              </p>
            </div>

            {/* Navigation col */}
            <div>
              <p className="footer-col-title">Navigate</p>
              <div className="footer-col-links">
                <a href="#features" className="footer-link">Features</a>
                <a href="#how-it-works" className="footer-link">How It Works</a>
                <a href="#benefits" className="footer-link">Benefits</a>
              </div>
            </div>

            {/* Account col */}
            <div>
              <p className="footer-col-title">Account</p>
              <div className="footer-col-links">
                <Link to="/login" className="footer-link">Sign In</Link>
                <Link to="/register" className="footer-link">Create Account</Link>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2025 Pen2Grade AI. All rights reserved.</span>
            <span className="footer-dev">Developed by <span>Jerico B. Garcia</span></span>
          </div>
        </footer>

      </div>
    </>
  );
}

// Re-export so nav-only import works
function LogIn({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}
