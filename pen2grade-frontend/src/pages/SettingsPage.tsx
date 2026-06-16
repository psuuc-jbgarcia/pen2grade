import { useState } from 'react';
import { User, Shield, Bell, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'billing', label: 'Plan & Billing', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full">
      <header className="px-6 md:px-10 py-6 shrink-0 border-b border-white/5 bg-[#0b0f1a] z-10 sticky top-0 md:static">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <SettingsIcon className="text-indigo-400" size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Account Settings</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0b0f1a]">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0 border-r border-white/5 bg-[#0e1320]/50 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <p className="px-4 text-xs font-black text-gray-500 uppercase tracking-widest mb-4 mt-2">Configuration</p>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                  activeTab === t.id
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
          <div className="max-w-2xl fade-in pb-20">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Profile Information</h2>
                  <p className="text-sm text-gray-400 mt-1">Update your account details and public visibility.</p>
                </div>
                
                <div className="glass-card p-6 md:p-8 border border-white/5 rounded-2xl space-y-8 bg-black/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-indigo-600/20 border-4 border-indigo-400/30">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{user?.role === 'teacher' ? 'Educator Account' : 'Standard User'}</p>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-lg transition-colors">
                        Upload Avatar
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-5 pt-6 border-t border-white/5">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">Display Name</label>
                      <input type="text" defaultValue={user?.name || ''} className="input-field py-3.5 px-4 font-bold text-white w-full rounded-xl bg-black/40 border-white/10 focus:border-indigo-500 focus:bg-black/60 transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">Email Address</label>
                      <input type="email" disabled value={user?.email || ''} className="input-field py-3.5 px-4 font-bold text-gray-400 opacity-70 bg-[#0b0f1a] cursor-not-allowed w-full rounded-xl border-white/5" />
                      <p className="text-xs text-gray-500 mt-2 ml-1">Your email address cannot be changed. Contact support for assistance.</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button className="btn-primary px-6 py-2.5 text-sm">Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Security Settings</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your password and account protection.</p>
                </div>
                
                <div className="glass-card p-6 md:p-8 border border-white/5 rounded-2xl space-y-6 bg-black/20">
                  <h3 className="font-bold text-white mb-4">Change Password</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="input-field py-3.5 px-4 w-full rounded-xl bg-black/40 border-white/10 focus:border-indigo-500 focus:bg-black/60" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="input-field py-3.5 px-4 w-full rounded-xl bg-black/40 border-white/10 focus:border-indigo-500 focus:bg-black/60" />
                      <p className="text-xs text-gray-500 mt-2 font-medium ml-1">Must be at least 8 characters and contain 1 uppercase letter.</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="input-field py-3.5 px-4 w-full rounded-xl bg-black/40 border-white/10 focus:border-indigo-500 focus:bg-black/60" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold transition-all border border-white/10">Update Password</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Email Notifications</h2>
                  <p className="text-sm text-gray-400 mt-1">Choose what we email you about.</p>
                </div>
                
                <div className="glass-card p-4 border border-white/5 rounded-2xl bg-black/20 divide-y divide-white/5">
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Essay Grading Completed</h4>
                      <p className="text-xs text-gray-400 mt-1">Receive an email when the AI finishes grading a long essay.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-500 cursor-pointer rounded bg-black/50 border-white/20" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Weekly Usage Summary</h4>
                      <p className="text-xs text-gray-400 mt-1">A weekly digest of your AI credit consumption and student stats.</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 accent-indigo-500 cursor-pointer rounded bg-black/50 border-white/20" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Marketing & Product Updates</h4>
                      <p className="text-xs text-gray-400 mt-1">News about the latest Pen2Grade AI features and promotions.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-500 cursor-pointer rounded bg-black/50 border-white/20" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Plan & Usage</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your subscription and view quota.</p>
                </div>
                
                <div className="glass-card p-6 md:p-8 border border-indigo-500/30 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/5 relative overflow-hidden">
                  {/* Decorative blob */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
                        Current Plan
                      </div>
                      <h3 className="text-3xl font-extrabold text-white mb-2">Free Educator</h3>
                      <p className="text-sm text-gray-400 max-w-sm">You are currently using the default free tier, giving you access to AI grading and rubrics.</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-400 font-medium">Monthly Cost</p>
                      <p className="text-3xl font-black text-white">$0<span className="text-lg text-gray-500 font-bold">/mo</span></p>
                    </div>
                  </div>
                  
                  <div className="mt-10 p-6 rounded-xl bg-black/40 border border-white/5 relative z-10">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">Daily AI Limit</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Resets at midnight</p>
                      </div>
                      <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-3 py-1 rounded-lg">10 maximum</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[#0b0f1a] overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[10%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex justify-end">
                    <button disabled className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-500 font-bold text-sm cursor-not-allowed">
                      Upgrade to Premium (Coming Soon)
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
