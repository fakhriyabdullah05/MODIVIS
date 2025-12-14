
import React from 'react';
import { AppView } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface UserDashboardProps {
  onNavigate: (view: AppView, assetId?: string, imageUrl?: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen w-full bg-background-dark">
      {/* Side Nav (Dashboard Variant) */}
      <aside className="w-64 border-r border-slate-800 bg-[#0d121c] hidden md:flex flex-col">
         <div className="p-6 flex items-center gap-3">
             <div className="bg-primary h-8 w-8 rounded flex items-center justify-center text-white"><span className="material-symbols-outlined">diamond</span></div>
             <span className="text-white font-bold text-lg">MODIVIS</span>
         </div>
         <nav className="flex-1 px-4 space-y-1">
             <button onClick={() => onNavigate(AppView.USER_DASHBOARD)} className="w-full flex items-center gap-3 px-3 py-2.5 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                <span className="material-symbols-outlined">dashboard</span> {t('user.dashboard')}
             </button>
             <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                <span className="material-symbols-outlined">folder</span> {t('user.my_assets')}
             </button>
             <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
                <span className="material-symbols-outlined">explore</span> {t('user.explore')}
             </button>
             <button onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors mt-8">
                <span className="material-symbols-outlined">palette</span> {t('user.creator_mode')}
             </button>
         </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Simple Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0d121c] flex items-center justify-between px-8">
            <h2 className="text-white font-medium">{t('user.dashboard')}</h2>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1">
                    <span className="text-amber-500 material-symbols-outlined text-sm">token</span>
                    <span className="text-white text-sm font-bold">1,250</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://picsum.photos/100/100")'}}></div>
            </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Token Balance */}
                    <div className="bg-[#1c212c] border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">token</span>
                            </div>
                            <span className="text-slate-300 font-medium">{t('user.token_balance')}</span>
                        </div>
                        <p className="text-4xl font-bold text-white mb-4">1,250</p>
                        <button 
                            onClick={() => onNavigate(AppView.PRICING)} 
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                        >
                            {t('user.top_up')}
                        </button>
                    </div>

                    {/* Download Quota */}
                     <div className="bg-[#1c212c] border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                                <span className="material-symbols-outlined">download</span>
                            </div>
                            <span className="text-slate-300 font-medium">{t('user.download_quota')}</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                             <p className="text-4xl font-bold text-white">42</p>
                             <span className="text-slate-500 font-medium text-lg">/50</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[84%]"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shortcut / Recent Project */}
                    <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">{t('user.recent_projects')}</h3>
                        <div className="bg-[#1c212c] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
                            <img src="https://picsum.photos/seed/gradient/400/250" alt="Recent" className="w-full sm:w-64 h-40 object-cover rounded-xl shadow-lg" />
                            <div className="flex flex-col justify-between h-full py-1">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">{t('user.continue_editing')}</p>
                                    <h4 className="text-white text-xl font-bold mb-2">Abstract Gradient vol. 3</h4>
                                    <p className="text-slate-500 text-xs">Last edited 2 hours ago</p>
                                </div>
                                <button 
                                    onClick={() => onNavigate(AppView.EDITOR, 'recent-1', 'https://picsum.photos/seed/gradient/1200/800')} 
                                    className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm w-fit transition-colors"
                                >
                                    {t('detail.open_editor')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-[#1c212c] border border-slate-800 rounded-2xl p-6 h-full">
                        <h3 className="text-xl font-bold text-white mb-6">{t('user.activity')}</h3>
                        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                            {[
                                {icon: 'download_done', color: 'text-emerald-500 bg-emerald-500/20', text: "Downloaded 'Summer Landscape.jpg'", time: '2 hours ago'},
                                {icon: 'edit', color: 'text-sky-500 bg-sky-500/20', text: "Edited 'Urban Exploration'", time: '5 hours ago'},
                                {icon: 'favorite', color: 'text-rose-500 bg-rose-500/20', text: "Favorited 'Futuristic UI Kit'", time: '1 day ago'},
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${item.color} ring-4 ring-[#1c212c]`}>
                                        <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-200 text-sm font-medium">{item.text}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
