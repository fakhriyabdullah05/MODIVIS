
import React, { useState } from 'react';
import { AppView } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
  onSearch?: (query: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSearch }) => {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState('');

  const handleHeroSearch = () => {
    if (onSearch) onSearch(searchValue);
    onNavigate(AppView.MARKETPLACE);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleHeroSearch();
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full flex-1">
            <TopNav onNavigate={onNavigate} activeView={AppView.LANDING} isLanding={true} />
            
            <main className="flex-1">
              {/* Hero Section */}
              <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-10">
                <div className="@container">
                  <div className="@[480px]:p-4">
                    <div 
                      className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-2xl items-center justify-center p-4 text-center relative overflow-hidden group" 
                      style={{backgroundImage: 'linear-gradient(rgba(16, 22, 34, 0.6) 0%, rgba(16, 22, 34, 0.9) 100%), url("https://picsum.photos/1600/900")'}}
                    >
                      {/* Animated gradient accent */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-60"></div>

                      <div className="flex flex-col gap-4 text-center max-w-4xl z-10">
                        <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] @[480px]:text-7xl">
                          {t('landing.hero_title_1')} <br/><span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-300">{t('landing.hero_title_2')}</span>
                        </h1>
                        <p className="text-white/80 text-lg font-normal leading-relaxed @[480px]:text-xl max-w-2xl mx-auto">
                          {t('landing.hero_desc')}
                        </p>
                      </div>

                      <div className="w-full max-w-[640px] flex flex-col gap-4 items-center z-10 mt-8">
                        <div className="flex flex-col min-w-40 h-14 w-full @[480px]:h-16">
                          <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-2xl shadow-primary/10">
                            <div className="text-white/60 flex border border-white/10 bg-[#192233]/80 backdrop-blur-md items-center justify-center pl-[20px] rounded-l-xl border-r-0">
                              <span className="material-symbols-outlined text-2xl">search</span>
                            </div>
                            <input 
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-white focus:outline-0 focus:ring-0 border border-white/10 bg-[#192233]/80 backdrop-blur-md focus:border-white/20 h-full placeholder:text-white/40 px-[15px] border-r-0 border-l-0 text-base font-normal leading-normal" 
                              placeholder={t('landing.search_placeholder_long')} 
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                              onKeyDown={handleKeyDown}
                            />
                            <button 
                              onClick={handleHeroSearch}
                              className="bg-primary hover:bg-primary/90 text-white rounded-r-xl px-8 font-bold text-lg transition-all"
                            >
                              {t('landing.search_btn')}
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-4">
                            <p className="text-white/50 text-sm">{t('landing.trending')}</p>
                            <span className="text-white/70 text-sm hover:text-white cursor-pointer underline decoration-white/30 underline-offset-4">{t('cat.business')}</span>
                            <span className="text-white/70 text-sm hover:text-white cursor-pointer underline decoration-white/30 underline-offset-4">{t('cat.nature')}</span>
                            <span className="text-white/70 text-sm hover:text-white cursor-pointer underline decoration-white/30 underline-offset-4">{t('cat.3d')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Teaser Section */}
              <section className="mt-8 px-4 md:px-10">
                <div className="flex flex-col lg:flex-row gap-10 p-8 md:p-12 bg-white/5 border border-white/5 rounded-2xl @container backdrop-blur-sm">
                  <div className="flex flex-col gap-6 lg:w-1/3 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">{t('landing.powerful_tools')}</span>
                    </div>
                    <h2 className="text-white text-4xl font-bold leading-tight tracking-[-0.015em]">{t('landing.try_editor')}</h2>
                    <p className="text-white/70 text-lg font-normal leading-relaxed">
                      {t('landing.editor_desc')}
                    </p>
                    <button onClick={() => onNavigate(AppView.EDITOR)} className="flex w-fit items-center gap-2 bg-white text-dark-surface px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                        {t('landing.launch_editor')} <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8 bg-black/20 rounded-xl border border-white/5">
                    <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                      <img alt="Parrot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://picsum.photos/id/237/800/600" />
                      
                      {/* Fake UI Overlay */}
                      <div className="absolute inset-0 border-[3px] border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute top-0 left-0 w-3 h-3 bg-primary border border-white -translate-x-1.5 -translate-y-1.5"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 bg-primary border border-white translate-x-1.5 -translate-y-1.5"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 bg-primary border border-white -translate-x-1.5 translate-y-1.5"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border border-white translate-x-1.5 translate-y-1.5"></div>
                      </div>
                    </div>
                    <div className="w-full max-w-[500px] grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors border border-white/5">
                        <span className="material-symbols-outlined">crop</span>
                        <span>{t('landing.crop')}</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-4 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors border border-white/5">
                        <span className="material-symbols-outlined">rotate_right</span>
                        <span>{t('landing.rotate')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trending Categories */}
              <section className="mt-16 md:mt-24 px-4 md:px-10">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">{t('landing.trending_cats')}</h2>
                    <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">{t('landing.view_all')} <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {name: 'cat.business', key: 'Business'}, 
                    {name: 'cat.nature', key: 'Nature'}, 
                    {name: 'cat.technology', key: 'Technology'}, 
                    {name: 'cat.medical', key: 'Medical'}
                  ].map((cat, idx) => (
                    <div key={idx} onClick={() => onNavigate(AppView.MARKETPLACE)} className="cursor-pointer relative bg-cover bg-center flex items-center justify-center rounded-xl aspect-video group overflow-hidden border border-white/10" 
                        style={{backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%), url("https://picsum.photos/seed/${cat.key}/600/400")`}}>
                      <p className="text-white text-xl font-bold leading-tight z-10 group-hover:-translate-y-2 transition-transform duration-300">{t(cat.name)}</p>
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                        <span className="text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">{t('landing.explore')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Section */}
              <section className="mt-16 md:mt-24 px-4 md:px-10 pb-20">
                <div 
                    className="relative flex flex-col items-center justify-center text-center gap-6 p-10 md:p-20 bg-cover bg-center rounded-2xl overflow-hidden" 
                    style={{backgroundImage: 'linear-gradient(rgba(16, 22, 34, 0.85) 0%, rgba(16, 22, 34, 0.95) 100%), url("https://picsum.photos/1600/600?grayscale")'}}
                >
                    {/* Decorative circles */}
                  <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

                  <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight max-w-2xl relative z-10">
                    {t('landing.sell_work')} <br/><span className="text-primary">{t('landing.earn_royalties')}</span>
                  </h2>
                  <p className="text-white/70 text-lg max-w-2xl relative z-10">
                    {t('landing.contributor_desc')}
                  </p>
                  <button onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)} className="relative z-10 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-white text-dark-surface text-lg font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform">
                    <span className="truncate">{t('landing.become_contributor')}</span>
                  </button>
                </div>
              </section>
            </main>

            <footer className="border-t border-white/10 bg-[#0d121c] px-4 md:px-10 py-12">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-4 text-white">
                    <div className="text-primary">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
                    </div>
                    <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">MODIVIS</h2>
                  </div>
                  <p className="text-white/60 mt-4 text-sm max-w-sm">{t('footer.desc')}</p>
                </div>
                <div className="col-span-1">
                  <h4 className="text-white font-semibold mb-4">{t('footer.legal')}</h4>
                  <ul className="space-y-3">
                    <li><a className="text-white/60 hover:text-white text-sm transition-colors" href="#">{t('footer.terms')}</a></li>
                    <li><a className="text-white/60 hover:text-white text-sm transition-colors" href="#">{t('footer.privacy')}</a></li>
                    <li><a className="text-white/60 hover:text-white text-sm transition-colors" href="#">{t('footer.cookie')}</a></li>
                  </ul>
                </div>
                <div className="col-span-1">
                  <h4 className="text-white font-semibold mb-4">{t('footer.social')}</h4>
                  <div className="flex gap-4">
                    <span className="text-white/60 hover:text-white cursor-pointer"><i className="material-symbols-outlined">public</i></span>
                    <span className="text-white/60 hover:text-white cursor-pointer"><i className="material-symbols-outlined">thumb_up</i></span>
                    <span className="text-white/60 hover:text-white cursor-pointer"><i className="material-symbols-outlined">share</i></span>
                  </div>
                </div>
                <div className="col-span-1">
                  <h4 className="text-white font-semibold mb-4">{t('footer.newsletter')}</h4>
                   <div className="flex flex-col gap-2">
                      <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary" placeholder={t('footer.enter_email')} />
                      <button className="bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 rounded-lg text-sm transition-colors">{t('footer.subscribe')}</button>
                   </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-white/40">{t('footer.rights')}</p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
