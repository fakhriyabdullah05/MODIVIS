
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, imageSrc }) => {
  const { t } = useLanguage();
  const [method, setMethod] = useState<'tokens' | 'ads'>('tokens');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsProcessing(true);

    try {
      // Simulate Payment/Ad Processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      let downloadUrl = imageSrc;
      let shouldRevoke = false;

      // Check if it's a remote URL (not base64 data URI)
      if (imageSrc.startsWith('http')) {
        try {
          const response = await fetch(imageSrc, { mode: 'cors' });
          if (!response.ok) throw new Error('Network response was not ok');
          const blob = await response.blob();
          downloadUrl = URL.createObjectURL(blob);
          shouldRevoke = true;
        } catch (e) {
          console.warn("Could not fetch image as blob, falling back to direct link. Note: 'download' attribute might be ignored by browser for cross-origin URLs.", e);
        }
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `MODIVIS_Export_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (shouldRevoke) {
        URL.revokeObjectURL(downloadUrl);
      }

      // Allow visual completion before closing
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);

    } catch (error) {
      console.error("Download failed", error);
      setIsProcessing(false);
      alert("Failed to process download. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111722] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-xl font-bold leading-tight">{t('export.title')}</h1>
            <p className="text-[#92a4c9] text-sm">{t('export.subtitle')}</p>
          </div>
          <button onClick={onClose} disabled={isProcessing} className="text-[#92a4c9] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Cost Breakdown */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 opacity-70">{t('export.cost_breakdown')}</h3>
            <div className="flex flex-col gap-3 pb-4 border-b border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-[#92a4c9]">{t('export.base_image')}</span>
                <span className="text-white">1 of 5 {t('export.quota')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#92a4c9]">{t('export.ai_adjustments')} (3)</span>
                <span className="text-white">15 Tokens</span>
              </div>
            </div>
            <div className="flex justify-between pt-4 font-bold items-center">
              <span className="text-white">{t('export.total_cost')}</span>
              <span className="text-primary text-xl">15 Tokens</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 opacity-70">{t('export.payment_method')}</h3>
            <div className="flex flex-col gap-3">
              <label 
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${method === 'tokens' ? 'border-primary bg-primary/10' : 'border-[#324467] hover:border-slate-500'}`}
                onClick={() => !isProcessing && setMethod('tokens')}
              >
                <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${method === 'tokens' ? 'border-primary' : 'border-slate-500'}`}>
                    {method === 'tokens' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex grow flex-col">
                  <p className="text-white text-sm font-bold">{t('export.use_token')}</p>
                  <p className="text-[#92a4c9] text-xs">{t('export.available')}: 250 Tokens</p>
                </div>
                <span className="material-symbols-outlined text-green-500">check_circle</span>
              </label>

              <label 
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${method === 'ads' ? 'border-primary bg-primary/10' : 'border-[#324467] hover:border-slate-500'}`}
                onClick={() => !isProcessing && setMethod('ads')}
              >
                 <div className={`flex items-center justify-center h-5 w-5 rounded-full border-2 ${method === 'ads' ? 'border-primary' : 'border-slate-500'}`}>
                    {method === 'ads' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <div className="flex grow flex-col">
                  <p className="text-white text-sm font-bold">{t('export.watch_ad')}</p>
                  <p className="text-[#92a4c9] text-xs">{t('export.watch_ad_desc')}</p>
                </div>
                <span className="material-symbols-outlined text-amber-500">play_circle</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/5">
          <button 
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
               <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Processing...</span>
               </>
            ) : (
               <>
                <span className="material-symbols-outlined">download</span>
                {t('export.process_download')}
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
