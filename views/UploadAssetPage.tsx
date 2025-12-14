
import React, { useState, useRef } from 'react';
import { AppView, Asset } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';

interface UploadAssetPageProps {
  onNavigate: (view: AppView) => void;
  onUpload: (asset: Asset) => void;
  onSearch?: (query: string) => void;
}

const UploadAssetPage: React.FC<UploadAssetPageProps> = ({ onNavigate, onUpload, onSearch }) => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Business');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    // Create preview URL for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
        setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !previewUrl) return;

    setIsUploading(true);

    // Simulate API call and construct new Asset object
    setTimeout(() => {
        const newAsset: Asset = {
            id: `custom-${Date.now()}`,
            title: title || file.name,
            creator: 'You (Creator)',
            imageUrl: previewUrl, // Use the data URL created by FileReader
            downloads: 0,
            views: 0,
            price: parseFloat(price) || 0,
            uploadDate: new Date().toLocaleDateString(),
            category: category,
            format: file.type.split('/')[1]?.toUpperCase() || 'UNK'
        };

        onUpload(newAsset);
        setIsUploading(false);
        alert(t('upload.success'));
        // Navigate to Marketplace to see the new asset
        onNavigate(AppView.MARKETPLACE);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <TopNav onNavigate={onNavigate} activeView={AppView.CREATOR_DASHBOARD} onSearch={onSearch} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-10 py-12">
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)} className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('upload.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('upload.subtitle')}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - File Upload */}
            <div className="lg:col-span-1">
                <div 
                    className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-surface hover:border-primary/50'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/jpg, .webp"
                    />
                    
                    {previewUrl ? (
                        <div className="relative w-full h-full group">
                             <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                 <p className="text-white font-bold">Change File</p>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            {file ? (
                                <div>
                                    <p className="text-slate-900 dark:text-white font-medium break-all">{file.name}</p>
                                    <p className="text-slate-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-900 dark:text-white font-bold mb-1">{t('upload.drag_drop')}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{t('upload.browse')}</p>
                                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-4">{t('upload.supported')}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">description</span>
                        {t('upload.asset_details')}
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('upload.asset_title')}</label>
                            <input 
                                type="text" 
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="e.g., Abstract 3D Geometric Shapes"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('upload.description')}</label>
                            <textarea 
                                rows={4}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                placeholder="Describe your asset, including key features and potential use cases..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('upload.category')}</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="Business">Business</option>
                                    <option value="Nature">Nature</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Medical">Medical</option>
                                    <option value="3D">3D Renders</option>
                                    <option value="Abstract">Abstract</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('upload.price')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-slate-500">$</span>
                                    </div>
                                    <input 
                                        type="number" 
                                        min="0"
                                        step="0.01"
                                        required
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 pl-8 pr-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('upload.tags')}</label>
                            <input 
                                type="text" 
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black/20 px-4 py-2.5 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="modern, clean, dark mode, ui kit"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        type="button" 
                        onClick={() => onNavigate(AppView.CREATOR_DASHBOARD)}
                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        {t('upload.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        disabled={isUploading || !file}
                        className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {t('upload.uploading')}
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">publish</span>
                                {t('upload.publish')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
      </main>
    </div>
  );
};

export default UploadAssetPage;
