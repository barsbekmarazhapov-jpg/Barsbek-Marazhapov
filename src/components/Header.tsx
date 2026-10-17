import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Volume2, 
  VolumeX,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Language, Theme, UserProfile, PushNotificationItem } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onToggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  user: UserProfile | null;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: PushNotificationItem[];
  onOpenNotifications: () => void;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  cartCount,
  onOpenCart,
  user,
  onOpenProfile,
  onOpenAuth,
  activeTab,
  onTabChange,
  notifications,
  onOpenNotifications,
  activeOrderCount,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sound.setMuted(nextMute);
    if (!nextMute) {
      sound.playAddToCart();
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'kk', label: 'Қазақша', flag: '🇰🇿' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-[#0A0A0A]/95 border-b border-neutral-200 dark:border-[#222222] transition-colors">
      {/* Top micro bar with Japanese philosophy and delivery info */}
      <div className="bg-neutral-900 text-neutral-300 dark:bg-[#0F0F0F] dark:text-neutral-400 text-xs py-1.5 px-4 text-center hidden sm:flex justify-between items-center tracking-wide border-b border-neutral-800 dark:border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-japanese-serif text-neutral-300 dark:text-neutral-300">旬 (Shun) — сезонная свежесть премиального качества</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-neutral-300 dark:text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#D12F2F]" />
            <span>Доставка по городу: 30-45 мин • Бесплатно от 1 500 ₽</span>
          </div>
          <div className="text-amber-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Кешбэк до 15% баллами Сакура Club</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with Japanese Seal */}
          <div 
            id="brand-logo-btn"
            onClick={() => onTabChange('menu')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#D12F2F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-japanese-serif font-bold text-lg">鮨</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                ★
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display-zen text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-[#E0E0E0]">
                  {t('brandName', language)}
                </span>
                <span className="hidden md:inline-block text-xs font-japanese-serif px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#1A1A1A] text-[#D12F2F] dark:text-[#E57373] border border-neutral-200 dark:border-[#2A2A2A]">
                  純粋和食
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-[#888888] line-clamp-1 font-sans">
                {t('brandTagline', language)}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-menu-tab"
              onClick={() => onTabChange('menu')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'menu'
                  ? 'bg-neutral-900 text-white dark:bg-[#1A1A1A] dark:text-white dark:border dark:border-[#333333] shadow-sm'
                  : 'text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#141414] dark:hover:text-[#E0E0E0]'
              }`}
            >
              {t('navMenu', language)}
            </button>

            <button
              id="nav-track-tab"
              onClick={() => onTabChange('track')}
              className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'track'
                  ? 'bg-neutral-900 text-white dark:bg-[#1A1A1A] dark:text-white dark:border dark:border-[#333333] shadow-sm'
                  : 'text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#141414] dark:hover:text-[#E0E0E0]'
              }`}
            >
              <span>{t('navTrack', language)}</span>
              {activeOrderCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D12F2F] animate-ping" />
              )}
            </button>

            <button
              id="nav-loyalty-tab"
              onClick={() => onTabChange('loyalty')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'loyalty'
                  ? 'bg-neutral-900 text-white dark:bg-[#1A1A1A] dark:text-white dark:border dark:border-[#333333] shadow-sm'
                  : 'text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#141414] dark:hover:text-[#E0E0E0]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('navLoyalty', language)}</span>
            </button>

            <button
              id="nav-reviews-tab"
              onClick={() => onTabChange('reviews')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'bg-neutral-900 text-white dark:bg-[#1A1A1A] dark:text-white dark:border dark:border-[#333333] shadow-sm'
                  : 'text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#141414] dark:hover:text-[#E0E0E0]'
              }`}
            >
              {t('navReviews', language)}
            </button>

            <button
              id="nav-orders-tab"
              onClick={() => onTabChange('orders')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-neutral-900 text-white dark:bg-[#1A1A1A] dark:text-white dark:border dark:border-[#333333] shadow-sm'
                  : 'text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#141414] dark:hover:text-[#E0E0E0]'
              }`}
            >
              {t('navOrders', language)}
            </button>
          </nav>

          {/* Action Tools & Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Audio Toggle */}
            <button
              id="header-sound-btn"
              onClick={toggleMute}
              title={isMuted ? 'Включить звук' : 'Выключить звук'}
              className="p-2 sm:p-2.5 rounded-xl text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#181818] transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-neutral-400 dark:text-neutral-600" /> : <Volume2 className="w-5 h-5 text-[#D12F2F]" />}
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                id="header-lang-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-[#CCCCCC] hover:bg-neutral-100 dark:hover:bg-[#181818] border border-neutral-200 dark:border-[#222222] transition-colors"
              >
                <Globe className="w-4 h-4 text-neutral-500 dark:text-[#888888]" />
                <span className="uppercase">{language}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#121212] shadow-xl border border-neutral-200 dark:border-[#222222] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      id={`lang-select-${l.code}`}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                        language === l.code
                          ? 'bg-neutral-100 dark:bg-[#1E1E1E] text-[#D12F2F] dark:text-[#FF6B6B] font-semibold'
                          : 'text-neutral-700 dark:text-[#CCCCCC] hover:bg-neutral-50 dark:hover:bg-[#181818]'
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              id="header-theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === 'dark' ? t('lightMode', language) : t('darkMode', language)}
              className="p-2 sm:p-2.5 rounded-xl text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#181818] transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-700" />}
            </button>

            {/* Notification Bell */}
            <button
              id="header-notifications-btn"
              onClick={onOpenNotifications}
              title={t('notificationsTitle', language)}
              className="relative p-2 sm:p-2.5 rounded-xl text-neutral-600 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#181818] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D12F2F] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <button
                id="header-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-neutral-100 dark:bg-[#161616] hover:bg-neutral-200 dark:hover:bg-[#202020] transition-colors border border-neutral-200 dark:border-[#262626]"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-400/80"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-[#E0E0E0] leading-tight">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                    ★ {user.bonusPoints} б.
                  </span>
                </div>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-900 text-white dark:bg-[#EDEDED] dark:text-neutral-950 hover:opacity-90 transition-opacity shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Войти</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white shadow-sm font-semibold text-sm transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">{cartCount > 0 ? `${cartCount}` : '0'}</span>
              {cartCount > 0 && (
                <span className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 text-xs font-black flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-neutral-200 dark:border-[#222222] shadow-2xl rounded-2xl px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'menu' ? 'text-[#D12F2F] dark:text-[#E57373] font-bold' : 'text-neutral-500 dark:text-[#888888]'
          }`}
        >
          <span className="text-lg">🍣</span>
          <span>{t('navMenu', language)}</span>
        </button>

        <button
          onClick={() => onTabChange('track')}
          className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'track' ? 'text-[#D12F2F] dark:text-[#E57373] font-bold' : 'text-neutral-500 dark:text-[#888888]'
          }`}
        >
          <span className="text-lg">🛵</span>
          <span>{t('navTrack', language)}</span>
          {activeOrderCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#D12F2F]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('loyalty')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'loyalty' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-neutral-500 dark:text-[#888888]'
          }`}
        >
          <span className="text-lg">🌸</span>
          <span>{t('navLoyalty', language)}</span>
        </button>

        <button
          onClick={() => onTabChange('reviews')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'reviews' ? 'text-[#D12F2F] dark:text-[#E57373] font-bold' : 'text-neutral-500 dark:text-[#888888]'
          }`}
        >
          <span className="text-lg">⭐</span>
          <span>{t('navReviews', language)}</span>
        </button>

        <button
          onClick={user ? onOpenProfile : onOpenAuth}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeTab === 'orders' || activeTab === 'profile' ? 'text-[#D12F2F] dark:text-[#E57373] font-bold' : 'text-neutral-500 dark:text-[#888888]'
          }`}
        >
          <span className="text-lg">👤</span>
          <span>{user ? user.name.split(' ')[0] : 'Профиль'}</span>
        </button>
      </div>
    </header>
  );
};
