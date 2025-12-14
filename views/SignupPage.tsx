import React from 'react';
import { AppView } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SignupPageProps {
  onNavigate: (view: AppView) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup success
    onNavigate(AppView.USER_DASHBOARD);
  };

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
         {/* Right Side - Visual (Swapped for Signup) */}
         <div className="hidden md:flex flex-col items-center justify-center bg-cover bg-center relative p-12 text-center order-last" 
            style={{backgroundImage: 'linear-gradient(rgba(43, 108, 238, 0.6) 0%, rgba(16, 22, 34, 0.9) 100%), url("https://picsum.photos/1200/1601")'}}>
            <div className="relative z-10 flex flex-col items-center">
                 <div className="text-white mb-6">
                    <svg className="w-16 h-16" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
                </div>
                <h2 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-4">{t('landing.sell_work')}</h2>
                <p className="text-white/80 text-lg max-w-md">{t('landing.contributor_desc')}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent"></div>
        </div>

        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 bg-white dark:bg-background-dark">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center md:text-left">
                    <div className="md:hidden flex justify-center text-primary mb-4 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
                         <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t('auth.signup_title')}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('auth.signup_subtitle')}</p>
                </div>

                <form className="space-y-6" onSubmit={handleSignup}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('auth.full_name')}</label>
                        <div className="mt-1">
                            <input id="name" name="name" type="text" required className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" placeholder="John Doe" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('auth.email')}</label>
                        <div className="mt-1">
                            <input id="email" name="email" type="email" required className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" placeholder="you@example.com" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('auth.password')}</label>
                        <div className="mt-1">
                            <input id="password" name="password" type="password" required className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" placeholder="••••••••" />
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('auth.terms')}</p>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all">
                            {t('auth.create_account')}
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white dark:bg-background-dark px-2 text-slate-500">{t('auth.continue_google')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-surface px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24"><path d="M12.0003 20.45C16.6666 20.45 20.5836 17.0666 21.9336 12.75H12.0003V9.75H22.3836C22.4836 10.5 22.5336 11.2666 22.5336 12.0833C22.5336 17.8833 18.6336 21.95 12.0003 21.95C6.50033 21.95 2.05033 17.5 2.05033 12C2.05033 6.5 6.50033 2.05 12.0003 2.05C14.6836 2.05 16.9669 3.03333 18.6669 4.63333L16.5003 6.8C15.6836 6.03333 14.2836 5.11667 12.0003 5.11667C8.28366 5.11667 5.18366 8.18333 5.18366 12C5.18366 15.8167 8.28366 18.8833 12.0003 18.8833Z" fill="#EA4335" /><path d="M3.15039 7.35L5.43372 9.03333C6.03372 7.21667 7.83372 5.86667 9.95039 5.86667C11.5337 5.86667 12.9171 6.46667 13.9671 7.43333L16.1337 5.26667C14.5337 3.76667 12.4171 2.8 9.95039 2.8C6.60039 2.8 3.71706 4.66667 2.30039 7.35H3.15039Z" fill="#EA4335" /></svg>
                        <span>Google</span>
                    </button>
                </div>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    {t('auth.already_have_account')}{' '}
                    <button onClick={() => onNavigate(AppView.LOGIN)} className="font-bold text-primary hover:text-primary/80 transition-colors">
                        {t('auth.sign_in')}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;