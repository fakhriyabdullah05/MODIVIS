
import React, { useState } from 'react';
import { AppView, UserTier, Asset } from './types';
import LandingPage from './views/LandingPage';
import MarketplacePage from './views/MarketplacePage';
import AssetDetailPage from './views/AssetDetailPage';
import EditorPage from './views/EditorPage';
import UserDashboard from './views/UserDashboard';
import CreatorDashboard from './views/CreatorDashboard';
import PricingPage from './views/PricingPage';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';
import FeaturesPage from './views/FeaturesPage';
import UploadAssetPage from './views/UploadAssetPage';
import { LanguageProvider } from './context/LanguageContext';

// Generate Initial Dummy Data
// Increased to 48 items to allow for 4 pages of 12 items each
const INITIAL_ASSETS: Asset[] = Array.from({ length: 48 }).map((_, i) => {
  const orientation = ['Horizontal', 'Vertical', 'Square', 'Panoramic'][i % 4];
  const color = ['Red', 'Blue', 'Green', 'Yellow', 'Black & White'][i % 5];
  const license = ['Standard', 'Extended', 'Editorial', 'Royalty-Free'][i % 4];
  
  // Adjust image dimensions based on orientation for realism
  let width = 400;
  let height = 400;
  if (orientation === 'Horizontal') { width = 600; height = 400; }
  else if (orientation === 'Vertical') { width = 400; height = 600; }
  else if (orientation === 'Panoramic') { width = 800; height = 350; }

  return {
    id: `asset-${i}`,
    title: `Creative Asset ${i + 1}`,
    creator: i % 5 === 0 ? 'Design Master' : i % 3 === 0 ? 'Pixel Studio' : 'System Creator',
    imageUrl: `https://picsum.photos/seed/${i + 50}/${width}/${height}`, 
    downloads: Math.floor(Math.random() * 5000),
    views: Math.floor(Math.random() * 10000),
    price: 10 + i,
    uploadDate: '2023-10-25',
    category: ['Business', 'Nature', 'Technology', 'Medical', '3D'][i % 5],
    format: ['JPG', 'PNG', 'AI', 'OBJ'][i % 4],
    orientation,
    color,
    license
  };
});

const Main: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssetImage, setSelectedAssetImage] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  
  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulation of user subscription tier. 
  // In a real app, this would come from an auth context or API.
  // Change this to UserTier.PRO_CREATOR or UserTier.ULTRA_BUSINESS to test different download permissions.
  const [userTier, setUserTier] = useState<UserTier>(UserTier.FREE);

  const navigateTo = (view: AppView, assetId?: string, imageUrl?: string) => {
    if (assetId) setSelectedAssetId(assetId);
    if (imageUrl) setSelectedAssetImage(imageUrl);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleAddNewAsset = (newAsset: Asset) => {
    // Prepend the new asset so it shows up first
    setAssets([newAsset, ...assets]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onNavigate={navigateTo} onSearch={handleSearch} />;
      case AppView.MARKETPLACE:
        return <MarketplacePage onNavigate={navigateTo} assets={assets} searchQuery={searchQuery} onSearch={handleSearch} />;
      case AppView.ASSET_DETAIL:
        return <AssetDetailPage onNavigate={navigateTo} assetId={selectedAssetId} userTier={userTier} assets={assets} onSearch={handleSearch} />;
      case AppView.EDITOR:
        return <EditorPage onNavigate={navigateTo} initialImage={selectedAssetImage} />;
      case AppView.USER_DASHBOARD:
        return <UserDashboard onNavigate={navigateTo} />;
      case AppView.CREATOR_DASHBOARD:
        return <CreatorDashboard onNavigate={navigateTo} />;
      case AppView.PRICING:
        return <PricingPage onNavigate={navigateTo} userTier={userTier} onUpgrade={setUserTier} onSearch={handleSearch} />;
      case AppView.LOGIN:
        return <LoginPage onNavigate={navigateTo} />;
      case AppView.SIGNUP:
        return <SignupPage onNavigate={navigateTo} />;
      case AppView.FEATURES:
        return <FeaturesPage onNavigate={navigateTo} onSearch={handleSearch} />;
      case AppView.UPLOAD_ASSET:
        return <UploadAssetPage onNavigate={navigateTo} onUpload={handleAddNewAsset} onSearch={handleSearch} />;
      default:
        return <LandingPage onNavigate={navigateTo} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">
      {renderView()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Main />
    </LanguageProvider>
  );
};

export default App;
