import React, { useState } from 'react';
import { X, Phone, ShieldCheck, Check, Sparkles, Send } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+7 (999) 450-88-22');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('otp');
      sound.playNotification();
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sound.playOrderSuccess();
      const demoUser: UserProfile = {
        id: 'usr-demo-1',
        name: 'Александр Волков',
        phone: phoneNumber,
        email: 'alex.volkov@sushi-rolls.ru',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        provider: 'phone',
        bonusPoints: 350,
        tier: 'silver',
        totalOrdersCount: 5,
        totalSpent: 4850,
        referralCode: 'SAKURA-7792',
        addresses: [
          {
            id: 'addr-1',
            title: 'Дом',
            city: 'г. Москва',
            street: 'ул. Тверская',
            house: '14',
            apartment: '42',
            entrance: '2',
            floor: '5',
            intercom: '42К',
            isDefault: true,
          },
          {
            id: 'addr-2',
            title: 'Офис',
            city: 'г. Москва',
            street: 'Пресненская наб.',
            house: '6 стр 2',
            apartment: '34 этаж',
            isDefault: false,
          },
        ],
        savedCards: [
          {
            id: 'card-1',
            numberMasked: '•••• 4242',
            expiryDate: '10/28',
            brand: 'mir',
            holderName: 'ALEXANDER VOLKOV',
            isDefault: true,
            colorScheme: 'onyx',
          },
        ],
      };
      onLoginSuccess(demoUser);
      onClose();
    }, 800);
  };

  const handleSocialLogin = (provider: 'google' | 'telegram' | 'vk' | 'apple') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      sound.playOrderSuccess();
      const socialUser: UserProfile = {
        id: `usr-${provider}`,
        name: provider === 'google' ? 'Kenji Sato' : provider === 'telegram' ? 'Артём @sushichef' : 'Елена Волкова',
        phone: '+7 (912) 345-67-89',
        email: `guest.${provider}@sushi-rolls.ru`,
        avatar: provider === 'google'
          ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
        provider,
        bonusPoints: 500,
        tier: 'gold',
        totalOrdersCount: 12,
        totalSpent: 14200,
        referralCode: 'TOKYO-VIP88',
        addresses: [
          {
            id: 'addr-soc-1',
            title: 'Дом',
            city: 'г. Москва',
            street: 'Кутузовский проспект',
            house: '24',
            apartment: '88',
            entrance: '1',
            floor: '8',
            intercom: '88',
            isDefault: true,
          },
        ],
        savedCards: [
          {
            id: 'card-soc-1',
            numberMasked: '•••• 8899',
            expiryDate: '12/29',
            brand: 'mastercard',
            holderName: 'KENJI SATO',
            isDefault: true,
            colorScheme: 'ruby',
          },
        ],
      };
      onLoginSuccess(socialUser);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D12F2F] text-white flex items-center justify-center font-japanese-serif font-bold text-base shadow-sm">
              門
            </div>
            <div>
              <h2 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                {t('authTitle', language)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Клуб любителей японской кухни
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 dark:text-[#888888] hover:text-neutral-900 dark:hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          <div className="text-center space-y-1">
            <p className="text-xs text-neutral-600 dark:text-[#888888]">
              {t('authSubtitle', language)}
            </p>
          </div>

          {/* Phone Form */}
          {authMode === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888] block mb-1.5">
                  {t('phoneAuthLabel', language)}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 dark:text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    placeholder="+7 (___) ___-__-__"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#161616] border border-neutral-300 dark:border-[#262626] text-sm font-semibold text-neutral-900 dark:text-white focus:border-[#D12F2F] focus:outline-none"
                  />
                </div>
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'Отправка...' : t('sendCodeBtn', language)}</span>
              </button>
            </form>
          ) : (
            /* OTP Code Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {t('enterOtpCode', language)}
                </span>
                <p className="text-[11px] text-neutral-500 dark:text-[#888888]">
                  Код отправлен на {phoneNumber} (введите 7788)
                </p>
              </div>

              <div>
                <input
                  id="auth-otp-input"
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="7788"
                  className="w-full py-3 text-center text-2xl font-mono font-bold tracking-widest rounded-xl bg-white dark:bg-[#161616] border border-neutral-300 dark:border-[#262626] text-neutral-900 dark:text-white focus:border-[#D12F2F] focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('phone')}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-xs font-semibold text-neutral-700 dark:text-[#CCCCCC]"
                >
                  Изменить номер
                </button>
                <button
                  id="verify-otp-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  {isLoading ? 'Проверка...' : 'Подтвердить'}
                </button>
              </div>
            </form>
          )}

          {/* Social Logins Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 dark:border-[#222222] w-full" />
            <span className="bg-white dark:bg-[#121212] px-3 text-[11px] uppercase tracking-wider text-neutral-400 dark:text-[#666666] font-semibold absolute">
              {t('orSocialAuth', language)}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="login-telegram-btn"
              onClick={() => handleSocialLogin('telegram')}
              className="py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] text-neutral-800 dark:text-[#E0E0E0] text-xs font-medium flex items-center justify-center gap-2 border border-neutral-200 dark:border-[#262626] transition-colors"
            >
              <span>✈️ Telegram</span>
            </button>

            <button
              id="login-google-btn"
              onClick={() => handleSocialLogin('google')}
              className="py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] text-neutral-800 dark:text-[#E0E0E0] text-xs font-medium flex items-center justify-center gap-2 border border-neutral-200 dark:border-[#262626] transition-colors"
            >
              <span>🌐 Google</span>
            </button>

            <button
              id="login-vk-btn"
              onClick={() => handleSocialLogin('vk')}
              className="py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] text-neutral-800 dark:text-[#E0E0E0] text-xs font-medium flex items-center justify-center gap-2 border border-neutral-200 dark:border-[#262626] transition-colors"
            >
              <span>🔷 VK ID</span>
            </button>

            <button
              id="login-apple-btn"
              onClick={() => handleSocialLogin('apple')}
              className="py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#1E1E1E] text-neutral-800 dark:text-[#E0E0E0] text-xs font-medium flex items-center justify-center gap-2 border border-neutral-200 dark:border-[#262626] transition-colors"
            >
              <span> Apple ID</span>
            </button>
          </div>

          {/* 1-Click Demo Quick Login Button */}
          <button
            id="quick-demo-login-btn"
            onClick={() => handleSocialLogin('google')}
            className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-[#181818] text-neutral-800 dark:text-[#CCCCCC] hover:bg-neutral-200 dark:hover:bg-[#222222] border border-neutral-200 dark:border-[#262626] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('demoQuickLogin', language)} (Войти в 1 клик)</span>
          </button>

        </div>

      </div>
    </div>
  );
};
