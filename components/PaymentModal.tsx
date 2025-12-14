
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  price: string;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, planName, price, onConfirm }) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Payment Processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
      if (isSuccess) {
          onConfirm(); // Trigger actual upgrade only after success modal close
      }
      // Reset state
      setIsSuccess(false);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setName('');
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2533] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Success State */}
        {isSuccess ? (
             <div className="p-8 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
                     <span className="material-symbols-outlined text-4xl">check_circle</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('payment.success_title')}</h2>
                 <p className="text-slate-500 dark:text-slate-400 mb-8">{t('payment.success_desc')}</p>
                 <button 
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all"
                 >
                     {t('payment.close')}
                 </button>
             </div>
        ) : (
            /* Payment Form */
            <>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('payment.title')}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{planName} - <span className="text-primary font-bold">{price}</span></p>
                    </div>
                    <button onClick={onClose} disabled={isProcessing} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('payment.card_holder')}</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('payment.card_number')}</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400"
                                placeholder="0000 0000 0000 0000"
                            />
                            <div className="absolute right-3 top-2.5 text-slate-400">
                                <span className="material-symbols-outlined">credit_card</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('payment.expiry')}</label>
                            <input 
                                type="text" 
                                required
                                maxLength={5}
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('payment.cvv')}</label>
                            <input 
                                type="text" 
                                required
                                maxLength={3}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-slate-400"
                                placeholder="123"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className="w-full mt-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {t('payment.processing')}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">lock</span>
                                {t('payment.pay_now')}
                            </>
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                        <span className="material-symbols-outlined text-sm">encrypted</span>
                        {t('payment.subtitle')}
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
