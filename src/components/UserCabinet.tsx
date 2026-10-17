import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  MapPin, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  QrCode, 
  ShieldCheck, 
  RotateCcw, 
  Star,
  ChevronRight,
  ExternalLink,
  Phone,
  Gift,
  X
} from 'lucide-react';
import { UserProfile, SavedCard, Address, Order, Language, LoyaltyTier } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface UserCabinetProps {
  user: UserProfile;
  orders: Order[];
  language: Language;
  onUpdateUser: (user: UserProfile) => void;
  onRepeatOrder: (order: Order) => void;
  onOpenReview: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
}

export const UserCabinet: React.FC<UserCabinetProps> = ({
  user,
  orders,
  language,
  onUpdateUser,
  onRepeatOrder,
  onOpenReview,
  onTrackOrder,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'loyalty' | 'cards' | 'addresses' | 'history'>('loyalty');
  
  // Card form modal state
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardHolder, setNewCardHolder] = useState(user.name.toUpperCase());
  const [newCardScheme, setNewCardScheme] = useState<'onyx' | 'ruby' | 'emerald' | 'gold'>('onyx');

  // Address form modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Дом');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrApartment, setAddrApartment] = useState('');
  const [addrEntrance, setAddrEntrance] = useState('');
  const [addrFloor, setAddrFloor] = useState('');
  const [addrIntercom, setAddrIntercom] = useState('');

  const [copiedReferral, setCopiedReferral] = useState(false);

  const tierColors: Record<LoyaltyTier, { bg: string; text: string; nextPoints: number; percent: number; kanji: string }> = {
    bronze: { bg: 'from-amber-700 to-amber-900', text: 'text-amber-300', nextPoints: 1000, percent: 3, kanji: '銅' },
    silver: { bg: 'from-slate-400 to-slate-700', text: 'text-slate-200', nextPoints: 3000, percent: 5, kanji: '銀' },
    gold: { bg: 'from-amber-500 via-yellow-600 to-amber-700', text: 'text-amber-100', nextPoints: 10000, percent: 10, kanji: '金' },
    platinum: { bg: 'from-rose-900 via-neutral-900 to-black', text: 'text-rose-300', nextPoints: 25000, percent: 15, kanji: '白金' },
  };

  const currentTierInfo = tierColors[user.tier];
  const progressPercent = Math.min(100, Math.round((user.totalSpent / currentTierInfo.nextPoints) * 100));

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(user.referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    const masked = `•••• ${cleanNum.slice(-4) || '8842'}`;
    const card: SavedCard = {
      id: `card-${Date.now()}`,
      numberMasked: masked,
      expiryDate: newCardExpiry || '08/29',
      brand: cleanNum.startsWith('2') ? 'mir' : cleanNum.startsWith('5') ? 'mastercard' : 'visa',
      holderName: newCardHolder || 'SUSHI LOVER',
      isDefault: user.savedCards.length === 0,
      colorScheme: newCardScheme,
    };

    onUpdateUser({
      ...user,
      savedCards: [...user.savedCards, card],
    });
    setIsAddCardOpen(false);
    setNewCardNumber('');
    setNewCardExpiry('');
    sound.playAddToCart();
  };

  const handleRemoveCard = (cardId: string) => {
    onUpdateUser({
      ...user,
      savedCards: user.savedCards.filter(c => c.id !== cardId),
    });
  };

  const handleSetDefaultCard = (cardId: string) => {
    onUpdateUser({
      ...user,
      savedCards: user.savedCards.map(c => ({
        ...c,
        isDefault: c.id === cardId,
      })),
    });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrHouse) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      title: addrTitle,
      city: 'г. Москва',
      street: addrStreet,
      house: addrHouse,
      apartment: addrApartment,
      entrance: addrEntrance,
      floor: addrFloor,
      intercom: addrIntercom,
      isDefault: user.addresses.length === 0,
    };

    onUpdateUser({
      ...user,
      addresses: [...user.addresses, newAddr],
    });
    setIsAddAddressOpen(false);
    setAddrStreet('');
    setAddrHouse('');
    setAddrApartment('');
  };

  const handleRemoveAddress = (addrId: string) => {
    onUpdateUser({
      ...user,
      addresses: user.addresses.filter(a => a.id !== addrId),
    });
  };

  return (
    <div id="user-cabinet-container" className="space-y-6">
      
      {/* Profile Top Banner Card */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-neutral-200 dark:border-[#222222] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-amber-400/80 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-bold shadow-sm">
              {currentTierInfo.kanji}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-japanese-serif text-neutral-950 dark:text-white">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 text-xs rounded-md bg-neutral-100 dark:bg-[#1A1A1A] text-[#D12F2F] dark:text-[#FF6B6B] font-semibold border border-neutral-200 dark:border-[#2A2A2A]">
                Сакура Club
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#888888] mt-0.5">
              {user.phone} • {user.email}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {user.bonusPoints} баллов
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-neutral-600 dark:text-[#AAAAAA]">
                Заказов: {user.totalOrdersCount}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-neutral-600 dark:text-[#AAAAAA]">
                Кешбэк {currentTierInfo.percent}%
              </span>
            </div>
          </div>
        </div>

        {/* Quick QR code for in-restaurant scanning */}
        <div className="flex items-center gap-3 bg-neutral-50 dark:bg-[#181818] p-3 rounded-xl border border-neutral-200 dark:border-[#262626] self-start md:self-auto">
          <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm">
            <QrCode className="w-10 h-10 text-neutral-900" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-neutral-900 dark:text-white">
              QR карты лояльности
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-[#888888]">
              Покажите официанту в кафе
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="cabinet-subtab-loyalty"
          onClick={() => setActiveSubTab('loyalty')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'loyalty'
              ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-white dark:border dark:border-[#3A3A3A] shadow-sm'
              : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#888888] hover:bg-neutral-50 dark:hover:bg-[#181818] dark:hover:text-[#E0E0E0] border border-neutral-200 dark:border-[#222222]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('loyaltyProgram', language)}</span>
        </button>

        <button
          id="cabinet-subtab-cards"
          onClick={() => setActiveSubTab('cards')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'cards'
              ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-white dark:border dark:border-[#3A3A3A] shadow-sm'
              : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#888888] hover:bg-neutral-50 dark:hover:bg-[#181818] dark:hover:text-[#E0E0E0] border border-neutral-200 dark:border-[#222222]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#D12F2F]" />
          <span>{t('savedCardsTitle', language)} ({user.savedCards.length})</span>
        </button>

        <button
          id="cabinet-subtab-addresses"
          onClick={() => setActiveSubTab('addresses')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'addresses'
              ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-white dark:border dark:border-[#3A3A3A] shadow-sm'
              : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#888888] hover:bg-neutral-50 dark:hover:bg-[#181818] dark:hover:text-[#E0E0E0] border border-neutral-200 dark:border-[#222222]'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>{t('savedAddressesTitle', language)} ({user.addresses.length})</span>
        </button>

        <button
          id="cabinet-subtab-history"
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-white dark:border dark:border-[#3A3A3A] shadow-sm'
              : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#888888] hover:bg-neutral-50 dark:hover:bg-[#181818] dark:hover:text-[#E0E0E0] border border-neutral-200 dark:border-[#222222]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-sky-500" />
          <span>{t('historyTitle', language)} ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: Loyalty & Sakura Club */}
      {activeSubTab === 'loyalty' && (
        <div className="space-y-6">
          
          {/* VIP Metal Loyalty Card */}
          <div className="rounded-2xl p-6 sm:p-8 bg-[#121212] dark:bg-[#161616] text-white shadow-xl relative overflow-hidden border border-neutral-800 dark:border-[#2A2A2A]">
            <div className="absolute right-6 -bottom-10 text-9xl font-japanese-serif text-white/[0.04] select-none">
              桜
            </div>

            <div className="relative z-10 flex flex-col justify-between h-52">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#D12F2F] flex items-center justify-center font-bold text-white font-japanese-serif">
                    鮨
                  </div>
                  <span className="font-display-zen font-bold tracking-widest text-sm text-neutral-200">
                    SAKURA VIP CLUB
                  </span>
                </div>
                <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10">
                  {user.tier.toUpperCase()} TIER
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-neutral-400 uppercase tracking-wider">
                  {t('bonusBalance', language)}
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display-zen text-amber-400 flex items-baseline gap-2">
                  <span>{user.bonusPoints}</span>
                  <span className="text-sm font-sans font-normal text-neutral-300">
                    {t('pointsUnit', language)}
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between text-xs text-neutral-300">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Держатель карты</div>
                  <div className="font-bold tracking-wider text-white">{user.name.toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 uppercase">Кешбэк на всё меню</div>
                  <div className="font-bold text-amber-400 text-sm">+{currentTierInfo.percent}% на счёт</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Progression Progress Bar */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-neutral-200 dark:border-[#222222] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-neutral-950 dark:text-white">
                  Прогресс до статуса «{user.tier === 'bronze' ? 'Серебро' : user.tier === 'silver' ? 'Золото' : 'Платина VIP'}»
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#888888]">
                  Потрачено: {user.totalSpent} ₽ из {currentTierInfo.nextPoints} ₽
                </p>
              </div>
              <span className="font-display-zen text-sm font-bold text-[#D12F2F] dark:text-[#FF6B6B]">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-neutral-100 dark:bg-[#1E1E1E] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#D12F2F] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* All Tiers List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className={`p-3 rounded-xl border text-center ${user.tier === 'bronze' ? 'border-[#D12F2F] bg-neutral-50 dark:bg-[#1A1A1A]' : 'border-neutral-200 dark:border-[#222222]'}`}>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Бронза (3%)</div>
                <div className="text-[10px] text-neutral-500">От 0 ₽</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${user.tier === 'silver' ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-[#1A1A1A]' : 'border-neutral-200 dark:border-[#222222]'}`}>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Серебро (5%)</div>
                <div className="text-[10px] text-neutral-500">От 3 000 ₽</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${user.tier === 'gold' ? 'border-amber-500 bg-neutral-50 dark:bg-[#1A1A1A]' : 'border-neutral-200 dark:border-[#222222]'}`}>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Золото (10%)</div>
                <div className="text-[10px] text-neutral-500">От 10 000 ₽</div>
              </div>
              <div className={`p-3 rounded-xl border text-center ${user.tier === 'platinum' ? 'border-[#D12F2F] bg-neutral-50 dark:bg-[#1A1A1A]' : 'border-neutral-200 dark:border-[#222222]'}`}>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Платина (15%)</div>
                <div className="text-[10px] text-neutral-500">От 25 000 ₽</div>
              </div>
            </div>
          </div>

          {/* Referral Link Box */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-neutral-200 dark:border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#D12F2F] dark:text-[#FF6B6B] font-bold text-sm">
                <Gift className="w-4 h-4" />
                <span>Подарите другу 300 ₽ на первый заказ</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-[#888888]">
                И получите 300 бонусов на ваш счёт после доставки его заказа
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-[#181818] font-mono font-bold text-xs text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#262626]">
                {user.referralCode}
              </span>
              <button
                id="copy-referral-btn"
                onClick={handleCopyReferral}
                className="px-3.5 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReferral ? 'Скопировано!' : 'Копировать'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Saved Bank Cards */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-japanese-serif text-neutral-950 dark:text-white">
                {t('savedCardsTitle', language)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Быстрая оплата в 1 клик без повторного ввода данных
              </p>
            </div>

            <button
              id="open-add-card-modal-btn"
              onClick={() => setIsAddCardOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addCardBtn', language)}</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.savedCards.map((card) => {
              const schemeClasses = {
                onyx: 'from-neutral-900 to-neutral-800 text-white border-neutral-700',
                ruby: 'from-rose-950 to-red-950 text-white border-rose-900',
                emerald: 'from-emerald-950 to-teal-950 text-white border-emerald-900',
                gold: 'from-amber-800 to-yellow-950 text-white border-amber-700',
              }[card.colorScheme || 'onyx'];

              return (
                <div
                  key={card.id}
                  className={`rounded-2xl p-6 bg-gradient-to-br ${schemeClasses} shadow-md border relative overflow-hidden flex flex-col justify-between h-44`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display-zen font-bold text-xs uppercase tracking-widest text-neutral-300">
                        {card.brand.toUpperCase()}
                      </span>
                      {card.isDefault && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          Основная
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="p-1.5 rounded-lg bg-black/30 hover:bg-[#D12F2F] text-white/70 hover:text-white transition-colors"
                      title="Удалить карту"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="font-mono text-xl tracking-widest font-semibold text-white">
                    {card.numberMasked}
                  </div>

                  <div className="flex items-end justify-between text-xs text-neutral-300">
                    <div>
                      <div className="text-[9px] uppercase text-neutral-400">Card Holder</div>
                      <div className="font-bold">{card.holderName}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-[9px] uppercase text-neutral-400">Expires</div>
                        <div className="font-bold">{card.expiryDate}</div>
                      </div>
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefaultCard(card.id)}
                          className="text-[10px] text-amber-400 hover:underline font-semibold"
                        >
                          Сделать главной
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Card Modal */}
          {isAddCardOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-[#262626] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                    Привязка банковской карты
                  </h3>
                  <button onClick={() => setIsAddCardOpen(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCard} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Номер карты</label>
                    <input
                      type="text"
                      placeholder="2200 7000 8920 4422"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Срок (ММ/ГГ)</label>
                      <input
                        type="text"
                        placeholder="08/29"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm font-mono text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Имя владельца</label>
                    <input
                      type="text"
                      value={newCardHolder}
                      onChange={(e) => setNewCardHolder(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase block mb-1">Стиль оформления</label>
                    <div className="flex gap-2">
                      {(['onyx', 'ruby', 'emerald', 'gold'] as const).map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setNewCardScheme(col)}
                          className={`w-7 h-7 rounded-full border-2 ${newCardScheme === col ? 'border-white ring-2 ring-[#D12F2F]' : 'border-transparent'} ${
                            col === 'onyx' ? 'bg-neutral-900' : col === 'ruby' ? 'bg-rose-900' : col === 'emerald' ? 'bg-emerald-900' : 'bg-amber-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddCardOpen(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-xs font-semibold text-neutral-700 dark:text-[#888888] hover:bg-neutral-200 dark:hover:bg-[#282828]"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold transition-colors"
                    >
                      Привязать карту
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: Saved Delivery Addresses */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-japanese-serif text-neutral-950 dark:text-white">
                {t('savedAddressesTitle', language)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Адреса для быстрой доставки любимых сетов
              </p>
            </div>

            <button
              id="open-add-address-modal-btn"
              onClick={() => setIsAddAddressOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить адрес</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-neutral-200 dark:border-[#222222] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-[#1A1A1A] text-[#D12F2F] flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-neutral-950 dark:text-white">
                        {addr.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="text-neutral-400 hover:text-[#D12F2F] p-1 transition-colors"
                      title="Удалить адрес"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-neutral-800 dark:text-[#E0E0E0]">
                    {addr.city}, {addr.street}, д. {addr.house}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-[#888888]">
                    Кв. {addr.apartment || '-'}, подъезд {addr.entrance || '-'}, этаж {addr.floor || '-'}, домофон {addr.intercom || '-'}
                  </p>
                </div>

                {addr.comment && (
                  <div className="text-[11px] bg-neutral-50 dark:bg-[#181818] p-2 rounded-xl text-neutral-600 dark:text-[#888888]">
                    💬 {addr.comment}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {isAddAddressOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl p-6 shadow-xl border border-neutral-200 dark:border-[#262626] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                    Добавление адреса доставки
                  </h3>
                  <button onClick={() => setIsAddAddressOpen(false)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Название (Дом, Офис)</label>
                    <input
                      type="text"
                      value={addrTitle}
                      onChange={(e) => setAddrTitle(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Улица</label>
                      <input
                        type="text"
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Дом</label>
                      <input
                        type="text"
                        value={addrHouse}
                        onChange={(e) => setAddrHouse(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Кв / Офис</label>
                      <input
                        type="text"
                        value={addrApartment}
                        onChange={(e) => setAddrApartment(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Подъезд</label>
                      <input
                        type="text"
                        value={addrEntrance}
                        onChange={(e) => setAddrEntrance(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-[#888888] uppercase">Этаж</label>
                      <input
                        type="text"
                        value={addrFloor}
                        onChange={(e) => setAddrFloor(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-sm text-neutral-900 dark:text-[#E0E0E0] focus:outline-none focus:border-[#D12F2F]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-xs font-semibold text-neutral-700 dark:text-[#888888] hover:bg-neutral-200 dark:hover:bg-[#282828]"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold transition-colors"
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: Order History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-japanese-serif text-neutral-950 dark:text-white">
            {t('historyTitle', language)}
          </h2>

          {orders.length === 0 ? (
            <div className="bg-white dark:bg-[#121212] rounded-2xl p-12 text-center border border-neutral-200 dark:border-[#222222] space-y-3">
              <span className="text-4xl">🍣</span>
              <p className="text-sm font-semibold text-neutral-700 dark:text-[#888888]">
                У вас пока нет оформленных заказов
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-[#121212] rounded-2xl p-5 sm:p-6 border border-neutral-200 dark:border-[#222222] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 dark:border-[#222222]">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm sm:text-base text-neutral-950 dark:text-white font-japanese-serif">
                        Заказ {ord.orderNumber}
                      </span>
                      <span className="text-xs text-neutral-500 dark:text-[#888888]">
                        {new Date(ord.createdAt).toLocaleDateString()} в {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-neutral-100 dark:bg-[#1E1E1E] text-[#D12F2F] dark:text-[#FF6B6B]'
                      }`}>
                        {ord.status === 'delivered' ? '✓ Доставлен' : '🛵 Доставляется...'}
                      </span>
                      <span className="font-display-zen font-bold text-sm sm:text-base text-neutral-950 dark:text-white">
                        {ord.total} ₽
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {ord.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-2.5 bg-neutral-50 dark:bg-[#181818] p-2 rounded-xl border border-neutral-100 dark:border-[#222222]">
                        <img
                          src={it.menuItem.image}
                          alt={it.menuItem.name[language]}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                            {it.menuItem.name[language]}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-[#888888]">
                            {it.quantity} шт • {it.menuItem.price * it.quantity} ₽
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-neutral-500 dark:text-[#888888]">
                      📍 {ord.deliveryAddress.street}, д. {ord.deliveryAddress.house}
                    </div>

                    <div className="flex items-center gap-2">
                      {ord.status !== 'delivered' && (
                        <button
                          onClick={() => onTrackOrder(ord)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <span>Отследить на карте</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onRepeatOrder(ord)}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#181818] hover:bg-neutral-200 dark:hover:bg-[#222222] text-neutral-800 dark:text-[#E0E0E0] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-200 dark:border-[#262626]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{t('repeatOrder', language)}</span>
                      </button>

                      {ord.status === 'delivered' && (
                        <button
                          onClick={() => onOpenReview(ord)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-amber-500/20 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{t('leaveReview', language)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
