import React, { useState, useRef, useEffect } from 'react';
import { AppView } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface TopNavProps {
  onNavigate: (view: AppView) => void;
  activeView: AppView;
  isLanding?: boolean;
  onSearch?: (query: string) => void; // Optional for Landing page mode
  searchQuery?: string;
}

const TopNav: React.FC<TopNavProps> = ({ onNavigate, activeView, isLanding = false, onSearch, searchQuery }) => {
  const { t, language, setLanguage } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Local state for input value to control it. Initialize with prop if available.
  const [inputValue, setInputValue] = useState(searchQuery || '');

  // Sync with prop changes if they occur externally (e.g. from Landing page search)
  useEffect(() => {
    if (searchQuery !== undefined) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]);

  // Dummy Notifications Data
  const notifications = [
    { id: 1, title: 'Asset Approved', message: 'Your "Modern Office" asset has been approved.', time: '2 min ago', unread: true, type: 'success' },
    { id: 2, title: 'New Sale!', message: 'You earned $15.00 from "Abstract 3D".', time: '1 hour ago', unread: true, type: 'monetization' },
    { id: 3, title: 'System Update', message: 'Maintenance scheduled for tonight at 02:00 AM.', time: '5 hours ago', unread: false, type: 'info' },
    { id: 4, title: 'New Comment', message: 'Sarah commented on your "Nature Pack".', time: '1 day ago', unread: false, type: 'comment' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(AppView.MARKETPLACE);
    }
  };

  const LanguageSwitcher = () => (
    <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 py-1 border border-white/10">
      <button 
        onClick={() => setLanguage('en')} 
        className={`text-xs font-bold px-1 rounded ${language === 'en' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
      >
        EN
      </button>
      <span className="text-slate-600">|</span>
      <button 
        onClick={() => setLanguage('id')} 
        className={`text-xs font-bold px-1 rounded ${language === 'id' ? 'text-primary' : 'text-slate-400 hover:text-white'}`}
      >
        ID
      </button>
    </div>
  );

  const LanguageSwitcherDark = () => (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-dark-surface rounded-full px-2 py-1 border border-slate-200 dark:border-slate-800">
       <button 
        onClick={() => setLanguage('en')} 
        className={`text-xs font-bold px-1 rounded ${language === 'en' ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
      >
        EN
      </button>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <button 
        onClick={() => setLanguage('id')} 
        className={`text-xs font-bold px-1 rounded ${language === 'id' ? 'text-primary' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
      >
        ID
      </button>
    </div>
  );

  if (isLanding) {
    return (
      <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-4 md:px-10 py-4 absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="text-primary">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">MODIVIS</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-9">
            <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal">{t('nav.assets')}</button>
            <button onClick={() => onNavigate(AppView.FEATURES)} className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal">{t('nav.features')}</button>
            <button onClick={() => onNavigate(AppView.PRICING)} className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal">{t('nav.pricing')}</button>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <button onClick={() => onNavigate(AppView.SIGNUP)} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <span className="truncate">{t('nav.signup')}</span>
            </button>
            <button onClick={() => onNavigate(AppView.LOGIN)} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors">
              <span className="truncate">{t('nav.login')}</span>
            </button>
          </div>
        </div>
        <button className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 bg-white/10 text-white hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-4 sm:px-6 md:px-10 py-3 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">MODIVIS</h2>
        </div>
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-slate-400 dark:text-slate-500 flex border border-r-0 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-surface items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              value={inputValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-dark-surface h-full placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pl-2 text-base font-normal leading-normal" 
              placeholder={t('nav.search_placeholder')} 
            />
          </div>
        </label>
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        <div className="hidden md:flex items-center gap-9">
          <button onClick={() => onNavigate(AppView.MARKETPLACE)} className={`text-sm font-medium leading-normal hover:text-primary ${activeView === AppView.MARKETPLACE ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{t('nav.assets')}</button>
          <button onClick={() => onNavigate(AppView.FEATURES)} className={`text-sm font-medium leading-normal hover:text-primary ${activeView === AppView.FEATURES ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{t('nav.features')}</button>
          <button onClick={() => onNavigate(AppView.PRICING)} className={`text-sm font-medium leading-normal hover:text-primary ${activeView === AppView.PRICING ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{t('nav.pricing')}</button>
          <button onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)} className={`text-sm font-medium leading-normal hover:text-primary ${activeView === AppView.CREATOR_DASHBOARD ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{t('nav.creator_hub')}</button>
          <button onClick={() => onNavigate(AppView.USER_DASHBOARD)} className={`text-sm font-medium leading-normal hover:text-primary ${activeView === AppView.USER_DASHBOARD ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>{t('nav.dashboard')}</button>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcherDark />
          
          <button onClick={() => onNavigate(AppView.EDITOR)} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            <span className="truncate">{t('nav.editor')}</span>
          </button>
          
          {/* Notification Button & Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex relative max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-slate-100 dark:bg-dark-surface text-slate-600 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors ${showNotifications ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            >
              <span className="material-symbols-outlined text-lg">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-dark-surface"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1c2533] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                  <button className="text-xs text-primary hover:underline font-medium">Mark all as read</button>
                </div>
                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`mt-1 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                          notif.type === 'success' ? 'bg-green-100 text-green-600' :
                          notif.type === 'monetization' ? 'bg-amber-100 text-amber-600' :
                          notif.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {notif.type === 'success' ? 'check_circle' :
                             notif.type === 'monetization' ? 'attach_money' :
                             notif.type === 'comment' ? 'chat' : 'info'}
                          </span>
                        </div>
                        <div>
                          <p className={`text-sm ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2">{notif.time}</p>
                        </div>
                        {notif.unread && (
                           <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary ml-auto"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-dark-surface text-center">
                  <button onClick={() => onNavigate(AppView.USER_DASHBOARD)} className="text-xs font-bold text-slate-500 hover:text-primary transition-colors py-1">View all activity</button>
                </div>
              </div>
            )}
          </div>

          <div onClick={() => onNavigate(AppView.USER_DASHBOARD)} className="cursor-pointer bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-transparent hover:ring-primary transition-all" style={{backgroundImage: 'url("https://picsum.photos/100/100")'}}></div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;