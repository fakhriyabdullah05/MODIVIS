
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppView, Asset } from '../types';
import TopNav from '../components/TopNav';
import { useLanguage } from '../context/LanguageContext';

interface MarketplacePageProps {
  onNavigate: (view: AppView, assetId?: string, imageUrl?: string) => void;
  assets: Asset[];
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

const ITEMS_PER_PAGE = 12;

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate, assets, searchQuery = '', onSearch }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  
  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const filters = [
    { key: 'category', label: 'market.filter_type', options: ['Business', 'Nature', 'Technology', 'Medical', '3D'] }, // Mapped to Asset.category
    { key: 'orientation', label: 'market.filter_orientation', options: ['Horizontal', 'Vertical', 'Square', 'Panoramic'] },
    { key: 'color', label: 'market.filter_color', options: ['Red', 'Blue', 'Green', 'Yellow', 'Black & White'] },
    { key: 'license', label: 'market.filter_license', options: ['Standard', 'Extended', 'Editorial', 'Royalty-Free'] }, // Mapped to Asset.license
  ];

  const toggleFilter = (key: string) => {
    setActiveFilterDropdown(activeFilterDropdown === key ? null : key);
  };

  const selectOption = (filterKey: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: option
    }));
    setActiveFilterDropdown(null);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const clearFilter = (filterKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFilters = { ...selectedFilters };
    delete newFilters[filterKey];
    setSelectedFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target as Node)) {
        setActiveFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Check Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            asset.title.toLowerCase().includes(query) ||
            asset.creator.toLowerCase().includes(query) ||
            asset.category?.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Check Category
      if (selectedFilters['category'] && asset.category !== selectedFilters['category']) {
          if (!asset.category?.includes(selectedFilters['category'])) return false;
      }
      
      // Check License
      if (selectedFilters['license'] && asset.license !== selectedFilters['license']) {
          return false;
      }

      // Check Orientation
      if (selectedFilters['orientation'] && asset.orientation !== selectedFilters['orientation']) {
          return false;
      }

      // Check Color
      if (selectedFilters['color'] && asset.color !== selectedFilters['color']) {
          return false;
      }

      return true;
    });
  }, [assets, selectedFilters, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAssets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAssets, currentPage]);

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <TopNav onNavigate={onNavigate} activeView={AppView.MARKETPLACE} searchQuery={searchQuery} onSearch={onSearch} />
      
      <main className="px-4 sm:px-6 md:px-10 py-8 max-w-[1600px] mx-auto w-full min-h-[80vh]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-2">{t('market.title')}</h1>
              <p className="text-slate-500 dark:text-slate-400">{t('market.subtitle')}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md py-4 mb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div ref={filterContainerRef} className="flex flex-wrap gap-3 items-center">
            {filters.map((filter) => {
              const isSelected = !!selectedFilters[filter.key];
              return (
                <div key={filter.key} className="relative">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFilter(filter.key); }}
                    className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg border transition-all pl-4 pr-2 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-slate-200 dark:bg-dark-surface border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-white'
                    }`}
                  >
                    <p className="text-sm font-medium leading-normal whitespace-nowrap">
                      {isSelected ? selectedFilters[filter.key] : t(filter.label)}
                    </p>
                    {isSelected ? (
                      <span 
                        onClick={(e) => clearFilter(filter.key, e)}
                        className="material-symbols-outlined !text-lg hover:text-red-500 cursor-pointer"
                      >
                        close
                      </span>
                    ) : (
                      <span className="material-symbols-outlined !text-xl opacity-70">expand_more</span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {activeFilterDropdown === filter.key && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1c2533] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                      <div className="py-1">
                        {filter.options.map((option) => (
                          <button
                            key={option}
                            onClick={(e) => { e.stopPropagation(); selectOption(filter.key, option); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                              selectedFilters[filter.key] === option 
                                ? 'text-primary font-bold bg-primary/5' 
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {(Object.keys(selectedFilters).length > 0) && (
              <button 
                onClick={() => setSelectedFilters({})}
                className="text-xs text-slate-500 hover:text-red-500 font-medium ml-2 whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
            <button className="p-2 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-dark-surface transition-colors" title="Filter Settings">
              <span className="material-symbols-outlined">tune</span>
            </button>
            <div className="flex bg-slate-200 dark:bg-dark-surface rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded shadow-sm transition-all ${viewMode === 'grid' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <span className="material-symbols-outlined !text-xl">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded shadow-sm transition-all ${viewMode === 'list' ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  <span className="material-symbols-outlined !text-xl">view_list</span>
                </button>
            </div>
          </div>
        </div>

        <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal leading-normal pb-6">
          {t('market.displaying').replace('120', filteredAssets.length.toString())} 
          {searchQuery && ` • Search: "${searchQuery}"`}
          {Object.keys(selectedFilters).length > 0 && ` • Filters: ${Object.values(selectedFilters).join(', ')}`}
        </p>

        {/* Content Area */}
        {filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
                <p className="text-lg font-medium">No assets found matching your criteria.</p>
                <button onClick={() => { setSelectedFilters({}); onNavigate(AppView.MARKETPLACE); if (onSearch) onSearch(''); /* Clear search too */ }} className="mt-4 text-primary font-bold hover:underline">Clear filters</button>
            </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedAssets.map((asset) => (
              <div key={asset.id} className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-dark-surface shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                   onClick={() => onNavigate(AppView.ASSET_DETAIL, asset.id)}>
                <img 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={asset.title} 
                  src={asset.imageUrl} 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Overlay Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                  <h3 className="text-white font-bold truncate">{asset.title}</h3>
                  <div className="flex gap-2">
                      <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            // Pass the original full res image URL
                            const editUrl = asset.imageUrl.includes('picsum') ? asset.imageUrl.replace(/\/\d+\/\d+$/, '/1200/900') : asset.imageUrl;
                            onNavigate(AppView.EDITOR, asset.id, editUrl); 
                          }}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 bg-white/90 hover:bg-white text-slate-900 text-xs font-bold backdrop-blur-sm transition-colors"
                      >
                          <span className="material-symbols-outlined !text-base">edit</span>
                          {t('market.edit')}
                      </button>
                      <button className="size-9 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                          <span className="material-symbols-outlined !text-base">favorite</span>
                      </button>
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                  {t('market.premium')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="flex flex-col gap-4">
             {paginatedAssets.map((asset) => (
              <div key={asset.id} className="group flex flex-col sm:flex-row bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
                   onClick={() => onNavigate(AppView.ASSET_DETAIL, asset.id)}>
                <div className="sm:w-64 aspect-video sm:aspect-square md:aspect-[4/3] relative overflow-hidden shrink-0">
                  <img 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={asset.title} 
                    src={asset.imageUrl} 
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {t('market.premium')}
                  </div>
                </div>
                
                <div className="flex-1 p-4 sm:p-6 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{asset.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">By {asset.creator} • {asset.category} • {asset.license} • {asset.orientation}</p>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                       <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    High quality digital asset ready for your creative projects. Includes commercial license and high resolution files suitable for print and web.
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-3">
                     <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const editUrl = asset.imageUrl.includes('picsum') ? asset.imageUrl.replace(/\/\d+\/\d+$/, '/1200/900') : asset.imageUrl;
                            onNavigate(AppView.EDITOR, asset.id, editUrl); 
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-bold transition-all"
                      >
                          <span className="material-symbols-outlined !text-lg">edit</span>
                          {t('market.edit')}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-all">
                          <span className="material-symbols-outlined !text-lg">download</span>
                          {t('detail.download')}
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 p-8 mt-8">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200 dark:bg-dark-surface text-slate-600 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {/* Generate Page Numbers */}
              {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show limited pages logic if needed, for now show all since max is around 4-5
                  return (
                    <button 
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`flex h-10 min-w-[2.5rem] cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors ${
                            currentPage === pageNum 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-slate-200 dark:bg-dark-surface text-slate-600 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-800'
                        }`}
                    >
                        {pageNum}
                    </button>
                  );
              })}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-200 dark:bg-dark-surface text-slate-600 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
        )}
      </main>
    </div>
  );
};

export default MarketplacePage;
