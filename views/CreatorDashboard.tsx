
import React, { useEffect, useRef, useState } from 'react';
import { AppView } from '../types';
import Chart from 'chart.js/auto';
import { useLanguage } from '../context/LanguageContext';

interface CreatorDashboardProps {
  onNavigate: (view: AppView) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Helper to format IDR
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Data configurations
        const data7d = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            downloads: [120, 190, 150, 250, 220, 300, 280],
            views: [800, 1200, 1000, 1500, 1300, 1800, 1700]
        };

        const data30d = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            downloads: [850, 920, 1100, 1250],
            views: [4500, 5200, 6100, 7800]
        };

        const currentData = timeRange === '7d' ? data7d : data30d;

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: currentData.labels,
            datasets: [
              {
                label: 'Downloads',
                data: currentData.downloads,
                backgroundColor: 'rgba(43, 108, 238, 0.8)',
                borderRadius: 4,
                order: 2
              },
              {
                label: 'Views',
                data: currentData.views,
                type: 'line',
                borderColor: 'rgba(148, 163, 184, 0.5)',
                backgroundColor: 'rgba(148, 163, 184, 0.1)',
                tension: 0.4,
                order: 1,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: '#94a3b8' }
              },
              tooltip: {
                  mode: 'index',
                  intersect: false,
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
              }
            }
          }
        });
      }
    }
    return () => {
        if(chartInstance.current) chartInstance.current.destroy();
    }
  }, [timeRange]); // Re-run effect when timeRange changes

  return (
    <div className="min-h-screen w-full bg-[#101622] text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#101622]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(AppView.LANDING)}>
             <div className="text-primary"><svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg></div>
             <span className="font-bold tracking-tight">MODIVIS</span>
        </div>
        <div className="flex gap-6 text-sm font-medium">
             <button onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)} className="text-primary">{t('user.dashboard')}</button>
             <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="text-slate-400 hover:text-white transition-colors">{t('creator.marketplace')}</button>
        </div>
        <div className="flex items-center gap-4">
             <button className="h-9 w-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"><span className="material-symbols-outlined text-lg">notifications</span></button>
             <div className="h-8 w-8 rounded-full bg-slate-700 bg-cover bg-center" style={{backgroundImage: 'url("https://picsum.photos/100/100")'}}></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
             <div>
                 <h1 className="text-3xl font-bold mb-2">{t('creator.dashboard')}</h1>
                 <p className="text-slate-400">Overview of your asset performance and revenue.</p>
             </div>
             <button onClick={() => onNavigate(AppView.UPLOAD_ASSET)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold transition-colors">
                 <span className="material-symbols-outlined">upload</span> {t('creator.upload_new')}
             </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#181e2b] border border-slate-800 p-6 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-slate-400">
                     <span className="material-symbols-outlined text-lg">download</span>
                     <span className="text-sm font-medium">{t('creator.total_downloads')}</span>
                 </div>
                 <p className="text-3xl font-bold text-white mb-2">12,405</p>
                 <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+5.2% {t('creator.month_compare')}</span>
             </div>
             <div className="bg-[#181e2b] border border-slate-800 p-6 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-slate-400">
                     <span className="material-symbols-outlined text-lg">visibility</span>
                     <span className="text-sm font-medium">{t('creator.total_views')}</span>
                 </div>
                 <p className="text-3xl font-bold text-white mb-2">89,123</p>
                 <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+8.1% {t('creator.month_compare')}</span>
             </div>
             <div className="bg-[#181e2b] border border-slate-800 p-6 rounded-xl">
                 <div className="flex items-center gap-2 mb-2 text-slate-400">
                     <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                     <span className="text-sm font-medium">{t('creator.revenue')}</span>
                 </div>
                 <p className="text-3xl font-bold text-white mb-2">{formatRupiah(51750000)}</p>
                 <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+12.5% {t('creator.month_compare')}</span>
             </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#181e2b] border border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">{t('creator.performance')}</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setTimeRange('7d')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '7d' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        7 Days
                    </button>
                    <button 
                        onClick={() => setTimeRange('30d')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeRange === '30d' ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        30 Days
                    </button>
                </div>
            </div>
            <div className="h-72 w-full">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>

        {/* Top Assets Table */}
        <div className="space-y-4">
            <h2 className="text-lg font-bold">{t('creator.top_assets')}</h2>
            <div className="bg-[#181e2b] border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#111620] border-b border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('creator.asset')}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('creator.date')}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('creator.downloads')}</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t('creator.revenue_table')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                         <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://picsum.photos/seed/gradient/100/100" className="h-10 w-10 rounded bg-slate-700 object-cover" alt="thumb" />
                                    <span className="font-medium text-white text-sm">Neon Fluid Animation</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">Oct 15, 2023</td>
                            <td className="px-6 py-4 text-white text-sm">2,104</td>
                            <td className="px-6 py-4 text-white font-bold text-sm">{formatRupiah(12630000)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://picsum.photos/seed/mountains/100/100" className="h-10 w-10 rounded bg-slate-700 object-cover" alt="thumb" />
                                    <span className="font-medium text-white text-sm">Mountain Landscape Pack</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">Sep 22, 2023</td>
                            <td className="px-6 py-4 text-white text-sm">1,890</td>
                            <td className="px-6 py-4 text-white font-bold text-sm">{formatRupiah(11340000)}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://picsum.photos/seed/geo/100/100" className="h-10 w-10 rounded bg-slate-700 object-cover" alt="thumb" />
                                    <span className="font-medium text-white text-sm">3D Geometric Shapes</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 text-sm">Nov 01, 2023</td>
                            <td className="px-6 py-4 text-white text-sm">1,523</td>
                            <td className="px-6 py-4 text-white font-bold text-sm">{formatRupiah(9138000)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

      </main>
    </div>
  );
};

export default CreatorDashboard;
