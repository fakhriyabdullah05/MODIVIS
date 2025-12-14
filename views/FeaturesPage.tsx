
import React from 'react';
import { AppView } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';

interface FeaturesPageProps {
  onNavigate: (view: AppView) => void;
  onSearch?: (query: string) => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate, onSearch }) => {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <TopNav onNavigate={onNavigate} activeView={AppView.FEATURES} onSearch={onSearch} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 md:px-10 text-center bg-slate-50 dark:bg-[#101622] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(#2b6cee 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <span className="text-primary font-bold tracking-wider uppercase text-sm">MODIVIS ECOSYSTEM</span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              {t('features.title')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('features.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105">
                {t('landing.search_btn')}
              </button>
              <button onClick={() => onNavigate(AppView.EDITOR)} className="bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/20 transition-all">
                {t('landing.launch_editor')}
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-4 md:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">auto_fix_high</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.ai_editor')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('features.ai_editor_desc')}</p>
            </div>
            <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow group">
               <div className="h-14 w-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.marketplace')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('features.marketplace_desc')}</p>
            </div>
            <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow group">
               <div className="h-14 w-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">bar_chart</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.analytics')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('features.analytics_desc')}</p>
            </div>
             <div className="bg-white dark:bg-dark-surface p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow group">
               <div className="h-14 w-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-3xl">monetization_on</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('features.monetization')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t('features.monetization_desc')}</p>
            </div>
          </div>
        </section>

        {/* Detailed Section 1 */}
        <section className="py-16 px-4 md:px-10 bg-slate-100 dark:bg-[#0b0f17]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">Web-Based Editor</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('features.ai_editor')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Forget heavy software installations. Our editor runs smoothly in your browser, powered by advanced AI models that handle complex tasks in seconds.
              </p>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Smart background removal
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    AI Upscaling (2x, 4x)
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Magic Eraser for unwanted objects
                 </li>
              </ul>
              <button onClick={() => onNavigate(AppView.EDITOR)} className="mt-4 text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                {t('landing.try_editor')} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="flex-1 w-full">
              <img src="https://picsum.photos/id/20/800/600" alt="Editor Interface" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full" />
            </div>
          </div>
        </section>

         {/* Detailed Section 2 */}
        <section className="py-16 px-4 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                 <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold uppercase">Marketplace</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t('features.marketplace')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Source the perfect assets for your project without worrying about complicated licensing. Our marketplace is curated for quality and diversity.
              </p>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Commercial use ready
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Diverse categories (3D, Vector, Photo)
                 </li>
                 <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Direct support for creators
                 </li>
              </ul>
              <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="mt-4 text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
                {t('landing.explore')} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="flex-1 w-full">
              <img src="https://picsum.photos/id/180/800/600" alt="Marketplace Interface" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 md:px-10 bg-primary text-white text-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('features.cta_title')}</h2>
             <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
               Join thousands of creators who are building their portfolio and business with MODIVIS.
             </p>
             <button onClick={() => onNavigate(AppView.SIGNUP)} className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl">
               {t('features.cta_btn')}
             </button>
        </section>
      </main>
    </div>
  );
};

export default FeaturesPage;
