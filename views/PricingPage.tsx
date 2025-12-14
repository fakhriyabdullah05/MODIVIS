
import React, { useState } from 'react';
import { AppView, UserTier } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';
import PaymentModal from '../components/PaymentModal';

interface PricingPageProps {
  onNavigate: (view: AppView) => void;
  userTier?: UserTier; // Optional because initially it might not be passed if types aren't strictly updated everywhere yet, but effectively required for logic
  onUpgrade?: (tier: UserTier) => void;
  onSearch?: (query: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, userTier = UserTier.FREE, onUpgrade, onSearch }) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{name: string, price: string, tier: UserTier} | null>(null);

  const handlePlanSelect = (tier: UserTier, name: string, price: string) => {
    // If selecting current plan, do nothing
    if (userTier === tier) return;

    // If switching to FREE, just do it (downgrade simulation)
    if (tier === UserTier.FREE) {
        if (confirm('Are you sure you want to downgrade to the Free plan?')) {
            onUpgrade?.(tier);
        }
        return;
    }

    // For paid plans, open payment modal
    setSelectedPlanDetails({ name, price, tier });
    setIsModalOpen(true);
  };

  const handlePaymentConfirm = () => {
      if (selectedPlanDetails) {
          onUpgrade?.(selectedPlanDetails.tier);
      }
      setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <TopNav onNavigate={onNavigate} activeView={AppView.PRICING} onSearch={onSearch} />

      <main className="flex-1 px-4 sm:px-6 md:px-10 py-12 md:py-20 flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4">
            {t('pricing.title')} <br className="hidden md:block"/> {t('pricing.subtitle')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          {/* FREE USER */}
          <div className={`flex flex-col bg-white dark:bg-[#111722] rounded-2xl border transition-all duration-300 ${userTier === UserTier.FREE ? 'border-primary shadow-xl ring-1 ring-primary' : 'border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl'}`}>
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold tracking-wider uppercase mb-2">{t('pricing.free_user')}</h3>
            </div>
            
            <div className="flex flex-col flex-1 p-8">
              <div className="text-center mb-6">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{t('pricing.cost')}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('pricing.free_price')}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 text-center mb-8">
                 <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">{t('pricing.quota')}</p>
                 <p className="text-lg font-bold text-primary">{t('pricing.free_quota')}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-slate-900 dark:text-white font-bold text-sm mb-2">{t('pricing.key_features')}</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                    {t('pricing.feat_limited')}
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-amber-500 text-lg">smart_display</span>
                    <span>{t('pricing.feat_ads')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-slate-400 text-lg">sd</span>
                    {t('pricing.feat_sd')}
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => handlePlanSelect(UserTier.FREE, t('pricing.free_user'), t('pricing.free_price'))}
                disabled={userTier === UserTier.FREE}
                className={`w-full py-3 rounded-xl border font-bold transition-colors ${
                    userTier === UserTier.FREE 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-default' 
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {userTier === UserTier.FREE ? t('pricing.current_plan') : t('pricing.choose_plan')}
              </button>
            </div>
          </div>

          {/* PRO CREATOR - Highlighted */}
          <div className={`flex flex-col bg-white dark:bg-[#111722] rounded-2xl border-2 transition-all duration-300 relative transform lg:-translate-y-4 ${userTier === UserTier.PRO_CREATOR ? 'border-primary ring-2 ring-primary/20 shadow-2xl' : 'border-primary shadow-2xl shadow-primary/10'}`}>
             <div className="absolute top-0 inset-x-0 h-1 bg-primary"></div>
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50 bg-primary/5">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold tracking-wider uppercase mb-2">{t('pricing.pro_creator')}</h3>
            </div>
            
            <div className="flex flex-col flex-1 p-8">
              <div className="text-center mb-6">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{t('pricing.cost')}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('pricing.pro_price')}</p>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 text-center mb-8 border border-primary/20">
                 <p className="text-primary/70 text-xs uppercase tracking-wider font-bold mb-1">{t('pricing.quota')}</p>
                 <p className="text-lg font-bold text-primary">{t('pricing.pro_quota')}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-slate-900 dark:text-white font-bold text-sm mb-2">{t('pricing.key_features')}</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                    {t('pricing.feat_no_ads')}
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">hd</span>
                    {t('pricing.feat_hd')}
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">all_inclusive</span>
                    {t('pricing.feat_unlimited')}
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => handlePlanSelect(UserTier.PRO_CREATOR, t('pricing.pro_creator'), t('pricing.pro_price'))}
                disabled={userTier === UserTier.PRO_CREATOR}
                className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all ${
                    userTier === UserTier.PRO_CREATOR 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 shadow-none cursor-default' 
                    : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:scale-[1.02]'
                }`}
              >
                 {userTier === UserTier.PRO_CREATOR ? t('pricing.current_plan') : t('pricing.choose_plan')}
              </button>
            </div>
          </div>

          {/* ULTRA BUSINESS */}
          <div className={`flex flex-col bg-white dark:bg-[#111722] rounded-2xl border transition-all duration-300 ${userTier === UserTier.ULTRA_BUSINESS ? 'border-primary ring-1 ring-primary shadow-xl' : 'border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl'}`}>
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
              <h3 className="text-slate-900 dark:text-white text-xl font-bold tracking-wider uppercase mb-2">{t('pricing.ultra_business')}</h3>
            </div>
            
            <div className="flex flex-col flex-1 p-8">
              <div className="text-center mb-6">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{t('pricing.cost')}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{t('pricing.ultra_price')}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 text-center mb-8">
                 <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">{t('pricing.quota')}</p>
                 <p className="text-lg font-bold text-primary">{t('pricing.ultra_quota')}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <p className="text-slate-900 dark:text-white font-bold text-sm mb-2">{t('pricing.key_features')}</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-amber-500 text-lg">autorenew</span>
                    <span>{t('pricing.feat_rollover')}</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">4k</span>
                    {t('pricing.feat_4k')}
                  </li>
                  <li className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <span className="material-symbols-outlined text-primary text-lg">rocket_launch</span>
                    {t('pricing.feat_priority')}
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => handlePlanSelect(UserTier.ULTRA_BUSINESS, t('pricing.ultra_business'), t('pricing.ultra_price'))}
                disabled={userTier === UserTier.ULTRA_BUSINESS}
                className={`w-full py-3 rounded-xl border font-bold transition-colors ${
                     userTier === UserTier.ULTRA_BUSINESS 
                     ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-default' 
                     : 'border-primary text-primary hover:bg-primary/5'
                }`}
              >
                {userTier === UserTier.ULTRA_BUSINESS ? t('pricing.current_plan') : t('pricing.choose_plan')}
              </button>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        planName={selectedPlanDetails?.name || ''}
        price={selectedPlanDetails?.price || ''}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
};

export default PricingPage;
