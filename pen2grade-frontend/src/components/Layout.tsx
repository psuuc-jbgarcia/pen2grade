import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, FileText, List, LogOut, 
  LayoutDashboard, Menu, X
} from 'lucide-react';
import InstallPWA from './InstallPWA';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'All Essays', path: '/essays', icon: <FileText size={20} /> },
    { label: 'My Rubrics', path: '/rubrics', icon: <List size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
          <BookOpen color="white" size={24} />
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">Pen2Grade</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsDrawerOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              isActive(item.path)
                ? 'bg-indigo-600/10 text-indigo-400'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f1a]">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-500" size={20} />
            <span className="font-bold text-white tracking-tight text-sm">Pen2Grade</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InstallPWA />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all fade-in"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside 
        className={`md:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#0e1320] z-50 p-6 flex flex-col transition-transform duration-300 ease-out shadow-2xl ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button 
          onClick={() => setIsDrawerOpen(false)}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <NavContent />
      </aside>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-[#0e1320] p-6 sticky top-0 h-screen shrink-0">
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
