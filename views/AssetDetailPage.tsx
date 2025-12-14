
import React, { useState } from 'react';
import { AppView, UserTier, Asset } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';

interface AssetDetailPageProps {
  onNavigate: (view: AppView, assetId?: string, imageUrl?: string) => void;
  assetId: string | null;
  userTier: UserTier;
  assets: Asset[];
  onSearch?: (query: string) => void;
}

const AssetDetailPage: React.FC<AssetDetailPageProps> = ({ onNavigate, assetId, userTier, assets, onSearch }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'description' | 'comments' | 'related'>('description');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Comments State
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah Jen', avatar: 'https://picsum.photos/id/65/100/100', text: 'This asset is exactly what I needed for my architectural presentation. Great lighting!', date: '2 days ago' },
    { id: 2, user: 'Mike Ross', avatar: 'https://picsum.photos/id/66/100/100', text: 'Clean topology and high res textures. 5 stars.', date: '1 week ago' },
    { id: 3, user: 'DesignPro', avatar: 'https://picsum.photos/id/67/100/100', text: 'Could you upload a version with a transparent background?', date: '2 weeks ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  // Logic to determine image source
  let detailImage = '';
  let imageBaseUrl = '';
  let isCustomUpload = false;
  
  // 1. Check if it is a "Related" asset (special case from seed logic)
  if (assetId && assetId.startsWith('related-')) {
      const idx = assetId.split('-')[1];
      imageBaseUrl = `https://picsum.photos/seed/related${idx}`;
      detailImage = `${imageBaseUrl}/1200/900`;
  } 
  // 2. Check if it is in the main assets list (Includes uploaded assets)
  else {
      const foundAsset = assets.find(a => a.id === assetId);
      if (foundAsset) {
          if (foundAsset.imageUrl.startsWith('blob:') || foundAsset.imageUrl.startsWith('data:')) {
             // It's a custom uploaded asset
             isCustomUpload = true;
             detailImage = foundAsset.imageUrl;
          } else {
             // It's a dummy asset from Picsum
             // Restore high-res logic if it was a thumbnail
             if (foundAsset.imageUrl.includes('/400/400')) {
                detailImage = foundAsset.imageUrl.replace('/400/400', '/1200/900');
                imageBaseUrl = detailImage.split('/').slice(0, -2).join('/'); // Remove dimensions
             } else {
                detailImage = foundAsset.imageUrl;
                imageBaseUrl = detailImage;
             }
          }
      } else {
          // Fallback if not found (shouldn't happen often)
          detailImage = 'https://picsum.photos/1200/900';
      }
  }

  // Dummy Related Assets
  const relatedAssets = Array.from({ length: 4 }).map((_, i) => ({
    id: `related-${i}`,
    title: `Related Asset ${i + 1}`,
    image: `https://picsum.photos/seed/related${i}/400/300`
  }));

  const handleDownload = async () => {
    setIsDownloading(true);

    // Resolution Logic based on Tier
    let width = 640;
    let height = 480;
    let qualityLabel = 'SD (480p)';

    if (userTier === UserTier.PRO_CREATOR) {
        width = 1920;
        height = 1080;
        qualityLabel = 'HD (1080p)';
    } else if (userTier === UserTier.ULTRA_BUSINESS) {
        width = 3840;
        height = 2160;
        qualityLabel = '4K (Original)';
    }

    // Simulate Network Request
    try {
        let downloadUrl = '';
        
        if (isCustomUpload) {
            // For custom uploads, we just download the blob directly
            // (In a real app, we might request a specific variant from server)
            downloadUrl = detailImage; 
        } else {
            // Construct URL for the specific resolution using the consistent seed
            downloadUrl = `${imageBaseUrl}/${width}/${height}`;
        }
        
        const response = await fetch(downloadUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // Name the file
        a.download = `MODIVIS_Asset_${assetId || '001'}_${qualityLabel.replace(/[\s()]/g, '_')}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Download failed', error);
        alert('Download failed. Please try again.');
    } finally {
        setIsDownloading(false);
    }
  };

  const getTierLabel = () => {
      if (userTier === UserTier.FREE) return 'Free Plan (480p)';
      if (userTier === UserTier.PRO_CREATOR) return 'Pro Plan (1080p)';
      return 'Business Plan (4K)';
  };

  const handleFollowToggle = () => {
      setIsFollowing(!isFollowing);
  };

  const handlePostComment = () => {
      if (!newComment.trim()) return;

      const newCommentObj = {
          id: Date.now(),
          user: 'You',
          avatar: 'https://picsum.photos/id/68/100/100', // Placeholder for user avatar
          text: newComment,
          date: 'Just now'
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <TopNav onNavigate={onNavigate} activeView={AppView.ASSET_DETAIL} onSearch={onSearch} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-6 items-center">
          <button onClick={() => onNavigate(AppView.LANDING)} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium">{t('detail.home')}</button>
          <span className="text-slate-400 dark:text-slate-600 text-sm">/</span>
          <button onClick={() => onNavigate(AppView.MARKETPLACE)} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white text-sm font-medium">{t('nav.assets')}</button>
          <span className="text-slate-400 dark:text-slate-600 text-sm">/</span>
          <span className="text-slate-900 dark:text-white text-sm font-medium">Modern Office Space</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-[4/3] bg-slate-200 dark:bg-dark-surface rounded-2xl flex items-center justify-center overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
              <img className="w-full h-full object-contain bg-black/50" src={detailImage} alt="Office" />
              <button className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors">
                <span className="material-symbols-outlined">fullscreen</span>
              </button>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                {assets.find(a => a.id === assetId)?.title || "Modern Office Space"}
              </h1>
              <div className="flex items-center gap-2">
                 <div className="flex text-amber-500 text-sm">
                    <span className="material-symbols-outlined !text-lg fill-current">star</span>
                    <span className="material-symbols-outlined !text-lg fill-current">star</span>
                    <span className="material-symbols-outlined !text-lg fill-current">star</span>
                    <span className="material-symbols-outlined !text-lg fill-current">star</span>
                    <span className="material-symbols-outlined !text-lg fill-current">star_half</span>
                 </div>
                 <span className="text-slate-500 dark:text-slate-400 text-sm">(4.8) • 1.2k Downloads</span>
              </div>
            </div>

            {/* Creator Profile */}
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex-1 flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700" style={{backgroundImage: 'url("https://picsum.photos/id/64/100/100")'}}></div>
                <div>
                    <p className="text-slate-900 dark:text-white text-base font-bold leading-none">{assets.find(a => a.id === assetId)?.creator || "Alex Johnson"}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t('detail.pro_contributor')}</p>
                </div>
              </div>
              <button 
                onClick={handleFollowToggle}
                className={`flex items-center justify-center gap-2 rounded-lg h-9 px-4 text-sm font-medium border transition-colors ${
                  isFollowing 
                    ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {isFollowing && <span className="material-symbols-outlined !text-base">check</span>}
                {isFollowing ? t('detail.following') : t('detail.follow')}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => onNavigate(AppView.EDITOR, assetId || 'detail', detailImage)} 
                className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-14 px-6 bg-primary text-white text-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">edit_document</span>
                <span className="truncate">{t('detail.open_editor')}</span>
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex flex-col w-full cursor-pointer items-center justify-center gap-0.5 rounded-xl h-14 px-4 bg-slate-200 dark:bg-dark-surface text-slate-700 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                      <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                          Processing...
                      </span>
                  ) : (
                      <>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">download</span>
                            <span>{t('detail.download')}</span>
                        </div>
                        <span className="text-[10px] font-normal opacity-70 uppercase tracking-wide">{getTierLabel()}</span>
                      </>
                  )}
                </button>
                <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl h-14 px-4 bg-slate-200 dark:bg-dark-surface text-slate-700 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined">bookmark</span>
                  <span>{t('detail.save')}</span>
                </button>
              </div>
            </div>

            {/* Spec Info */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">info</span> {t('detail.specs')}
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm bg-slate-50 dark:bg-dark-surface/50 p-4 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400">{t('detail.max_res')}</p>
                <p className="text-slate-900 dark:text-white font-medium text-right">8000×6000px</p>
                <p className="text-slate-500 dark:text-slate-400">{t('detail.license_type')}</p>
                <p className="text-slate-900 dark:text-white font-medium text-right">Commercial</p>
                <p className="text-slate-500 dark:text-slate-400">{t('detail.file_type')}</p>
                <p className="text-slate-900 dark:text-white font-medium text-right">JPG, RAW</p>
                <p className="text-slate-500 dark:text-slate-400">{t('detail.upload_date')}</p>
                <p className="text-slate-900 dark:text-white font-medium text-right">{assets.find(a => a.id === assetId)?.uploadDate || "12 Dec 2023"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button 
                onClick={() => setActiveTab('description')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'description' 
                    ? 'text-primary border-primary' 
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
                }`}
              >
                {t('detail.desc')}
              </button>
              <button 
                onClick={() => setActiveTab('comments')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'comments' 
                    ? 'text-primary border-primary' 
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
                }`}
              >
                {t('detail.comments')} ({comments.length})
              </button>
              <button 
                onClick={() => setActiveTab('related')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'related' 
                    ? 'text-primary border-primary' 
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
                }`}
              >
                {t('detail.related')}
              </button>
            </nav>
          </div>
          
          <div className="py-8 min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-300">
                <p>{t('detail.asset_desc_1')}</p>
                <p className="mt-4">{t('detail.asset_desc_2')}</p>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-dark-surface rounded-xl border border-slate-100 dark:border-slate-800">
                    <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{comment.user}</h4>
                        <span className="text-slate-400 text-xs">• {comment.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))}
                
                {/* Add Comment Input */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-slate-500">person</span>
                    </div>
                    <div className="flex-1">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-primary text-slate-900 dark:text-white placeholder-slate-400" 
                            rows={3} 
                            placeholder="Add a comment..."
                        ></textarea>
                        <button 
                            onClick={handlePostComment}
                            className="mt-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'related' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-300">
                {relatedAssets.map((item) => (
                   <div key={item.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer" onClick={() => onNavigate(AppView.ASSET_DETAIL, item.id)}>
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <p className="text-white font-bold text-sm truncate">{item.title}</p>
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssetDetailPage;
