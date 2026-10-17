import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Banknote, 
  MapPin, 
  Sparkles, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, UserProfile, Address, SavedCard, PaymentMethodType, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  user: UserProfile | null;
  language: Language;
  onPlaceOrder: (orderData: {
    address: Address;
    paymentMethod: PaymentMethodType;
    selectedCardId?: string;
    bonusUsed: number;
    chopsticksCount: number;
    needCall: boolean;
    orderComment: string;
    saveCardToProfile?: boolean;
    newCardData?: {
      number: string;
      expiry: string;
      brand: 'visa' | 'mastercard' | 'mir' | 'jcb';
      holder: string;
    };
  }) => void;
  onAddAddress?: (addr: Address) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  user,
  language,
  onPlaceOrder,
  onAddAddress,
}) => {
  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1500 ? 0 : 250;
  
  // User addresses & selected address
  const defaultAddr: Address = user?.addresses.find(a => a.isDefault) || user?.addresses[0] || {
    id: 'addr-default',
    title: 'Дом',
    city: 'г. Москва',
    street: 'ул. Тверская',
    house: '14',
    apartment: '42',
    entrance: '2',
    floor: '5',
    intercom: '42К',
    comment: 'Оставить у двери',
    isDefault: true,
  };

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddr);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newHouse, setNewHouse] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newEntrance, setNewEntrance] = useState('');
  const [newFloor, setNewFloor] = useState('');
  const [newIntercom, setNewIntercom] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    user?.savedCards && user.savedCards.length > 0 ? 'saved_card' : 'card'
  );
  const [selectedCardId, setSelectedCardId] = useState<string>(
    user?.savedCards[0]?.id || ''
  );

  // New card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || 'ALEXANDER VOLKOV');
  const [saveCard, setSaveCard] = useState(true);

  // Options
  const [chopsticks, setChopsticks] = useState(2);
  const [needCall, setNeedCall] = useState(false);
  const [orderComment, setOrderComment] = useState('');
  
  // Loyalty points redemption
  const maxBonusCanUse = Math.min(
    user?.bonusPoints || 0,
    Math.floor(subtotal * 0.5) // Up to 50%
  );
  const [useBonus, setUseBonus] = useState(false);
  const [bonusToSpend, setBonusToSpend] = useState(0);

  const bonusDiscount = useBonus ? bonusToSpend : 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - bonusDiscount);

  // Card formatting helper
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#fbbf24', '#ffffff'],
      });
    } catch {
      // Fallback
    }

    sound.playOrderSuccess();

    onPlaceOrder({
      address: selectedAddress,
      paymentMethod,
      selectedCardId: paymentMethod === 'saved_card' ? selectedCardId : undefined,
      bonusUsed: useBonus ? bonusToSpend : 0,
      chopsticksCount: chopsticks,
      needCall,
      orderComment,
      saveCardToProfile: paymentMethod === 'card' && saveCard,
      newCardData: paymentMethod === 'card' ? {
        number: cardNumber || '4276 3800 1234 5678',
        expiry: cardExpiry || '12/28',
        brand: 'mir',
        holder: cardHolder,
      } : undefined,
    });
  };

  const handleSaveNewAddress = () => {
    if (!newStreet || !newHouse) return;
    const addr: Address = {
      id: `addr-${Date.now()}`,
      title: 'Новый адрес',
      city: 'г. Москва',
      street: newStreet,
      house: newHouse,
      apartment: newApartment,
      entrance: newEntrance,
      floor: newFloor,
      intercom: newIntercom,
      isDefault: false,
    };
    setSelectedAddress(addr);
    if (onAddAddress) onAddAddress(addr);
    setIsAddingAddress(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D12F2F] flex items-center justify-center font-japanese-serif font-bold text-base text-white shadow-sm">
              届
            </div>
            <div>
              <h2 className="font-bold text-lg font-japanese-serif tracking-tight text-neutral-950 dark:text-white">
                {t('checkoutModalTitle', language)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Гарантия свежести • Доставка за 30-45 минут
              </p>
            </div>
          </div>
          <button
            id="close-checkout-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-[#888888] hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* 1. Delivery Address Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D12F2F]" />
                <span>{t('deliveryAddressTitle', language)}</span>
              </label>

              <button
                type="button"
                id="add-new-address-toggle-btn"
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-semibold text-[#D12F2F] dark:text-[#FF6B6B] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('newAddressBtn', language)}</span>
              </button>
            </div>

            {/* Address Select / Radio Grid */}
            {!isAddingAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedAddress.id === addr.id
                          ? 'bg-red-50/40 dark:bg-[#D12F2F]/10 border-[#D12F2F] shadow-sm'
                          : 'bg-white dark:bg-[#161616] border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white mb-1">
                        <span>{addr.title}</span>
                        {selectedAddress.id === addr.id && (
                          <span className="w-4 h-4 rounded-full bg-[#D12F2F] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-[#AAAAAA]">
                        {addr.street}, д. {addr.house} {addr.apartment ? `, кв. ${addr.apartment}` : ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-xl border border-[#D12F2F] bg-red-50/40 dark:bg-[#D12F2F]/10 sm:col-span-2">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white mb-1">
                      {selectedAddress.title} (по умолчанию)
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-[#AAAAAA]">
                      {selectedAddress.street}, д. {selectedAddress.house}, кв. {selectedAddress.apartment}, подъезд {selectedAddress.entrance}, этаж {selectedAddress.floor}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Add New Address Form Box */
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Улица</label>
                    <input
                      type="text"
                      placeholder="ул. Самурайская"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Дом / Корпус</label>
                    <input
                      type="text"
                      placeholder="12/1"
                      value={newHouse}
                      onChange={(e) => setNewHouse(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Кв / Офис</label>
                    <input
                      type="text"
                      placeholder="45"
                      value={newApartment}
                      onChange={(e) => setNewApartment(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Подъезд</label>
                    <input
                      type="text"
                      placeholder="2"
                      value={newEntrance}
                      onChange={(e) => setNewEntrance(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Этаж</label>
                    <input
                      type="text"
                      placeholder="5"
                      value={newFloor}
                      onChange={(e) => setNewFloor(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-500 dark:text-[#888888] font-bold uppercase">Домофон</label>
                    <input
                      type="text"
                      placeholder="45К"
                      value={newIntercom}
                      onChange={(e) => setNewIntercom(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white focus:outline-none focus:border-[#D12F2F]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-neutral-200 dark:bg-[#262626] text-neutral-700 dark:text-[#E0E0E0]"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewAddress}
                    className="px-3 py-1.5 text-xs rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold transition-colors"
                  >
                    Сохранить адрес
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Payment Methods Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#D12F2F]" />
              <span>{t('paymentMethodTitle', language)}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Option: Saved Card (if exists) */}
              {user?.savedCards && user.savedCards.length > 0 && (
                <div
                  onClick={() => setPaymentMethod('saved_card')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMethod === 'saved_card'
                      ? 'bg-red-50/40 dark:bg-[#D12F2F]/10 border-[#D12F2F] shadow-sm'
                      : 'bg-white dark:bg-[#161616] border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-[#222222] text-white flex items-center justify-center text-xs font-bold">
                    💳
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white">
                      {t('payWithSavedCard', language)}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-[#888888]">
                      {user.savedCards[0].brand.toUpperCase()} {user.savedCards[0].numberMasked}
                    </div>
                  </div>
                  {paymentMethod === 'saved_card' && (
                    <span className="w-4 h-4 rounded-full bg-[#D12F2F] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
              )}

              {/* Option: New Card Online */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'card'
                    ? 'bg-red-50/40 dark:bg-[#D12F2F]/10 border-[#D12F2F] shadow-sm'
                    : 'bg-white dark:bg-[#161616] border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#D12F2F] text-white flex items-center justify-center text-xs font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {t('payWithNewCard', language)}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-[#888888]">
                    Visa, MasterCard, МИР
                  </div>
                </div>
                {paymentMethod === 'card' && (
                  <span className="w-4 h-4 rounded-full bg-[#D12F2F] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>

              {/* Option: SBP Instant QR Pay */}
              <div
                onClick={() => setPaymentMethod('sbp')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'sbp'
                    ? 'bg-red-50/40 dark:bg-[#D12F2F]/10 border-[#D12F2F] shadow-sm'
                    : 'bg-white dark:bg-[#161616] border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {t('payWithSbp', language)}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-[#888888]">
                    Без комиссии 0% в приложении банка
                  </div>
                </div>
                {paymentMethod === 'sbp' && (
                  <span className="w-4 h-4 rounded-full bg-[#D12F2F] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>

              {/* Option: Cash */}
              <div
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'cash'
                    ? 'bg-red-50/40 dark:bg-[#D12F2F]/10 border-[#D12F2F] shadow-sm'
                    : 'bg-white dark:bg-[#161616] border-neutral-200 dark:border-[#262626] hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {t('payWithCash', language)}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-[#888888]">
                    Оплата при получении заказа
                  </div>
                </div>
                {paymentMethod === 'cash' && (
                  <span className="w-4 h-4 rounded-full bg-[#D12F2F] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>

            </div>

            {/* If New Card Selected, show card fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-[#E0E0E0]">
                  <span>Данные банковской карты</span>
                  <div className="flex gap-1.5 text-neutral-400 text-xs">
                    <span>МИР</span> • <span>VISA</span> • <span>MC</span>
                  </div>
                </div>

                <div>
                  <input
                    id="checkout-card-number-input"
                    type="text"
                    placeholder="2200 4500 8920 1234"
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    maxLength={19}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white tracking-widest font-mono focus:border-[#D12F2F] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="ММ/ГГ"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      maxLength={5}
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white font-mono focus:border-[#D12F2F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="CVC / CVV"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.slice(0, 3))}
                      maxLength={3}
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-white dark:bg-[#1E1E1E] border border-neutral-300 dark:border-[#333333] text-neutral-900 dark:text-white font-mono focus:border-[#D12F2F] focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="rounded text-[#D12F2F] focus:ring-[#D12F2F] w-4 h-4"
                  />
                  <span className="text-xs text-neutral-700 dark:text-[#AAAAAA] font-medium">
                    Сохранить карту для быстрой оплаты в 1 клик в личном кабинете
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Loyalty Bonus Points Redemption */}
          {user && user.bonusPoints > 0 && maxBonusCanUse > 0 && (
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D12F2F]" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    Баллы лояльности «Сакура Club»
                  </span>
                </div>
                <span className="text-xs font-bold text-[#D12F2F] dark:text-[#FF6B6B]">
                  Доступно: {user.bonusPoints} б.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useBonus}
                    onChange={(e) => {
                      setUseBonus(e.target.checked);
                      if (e.target.checked) setBonusToSpend(maxBonusCanUse);
                      else setBonusToSpend(0);
                    }}
                    className="rounded text-[#D12F2F] focus:ring-[#D12F2F] w-4 h-4"
                  />
                  <span className="text-xs text-neutral-800 dark:text-[#E0E0E0]">
                    {t('usePointsCheckbox', language)}
                  </span>
                </label>
                {useBonus && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    -{bonusToSpend} ₽
                  </span>
                )}
              </div>

              {useBonus && (
                <div className="pt-2">
                  <input
                    type="range"
                    min={10}
                    max={maxBonusCanUse}
                    step={10}
                    value={bonusToSpend}
                    onChange={(e) => setBonusToSpend(Number(e.target.value))}
                    className="w-full accent-[#D12F2F]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500 dark:text-[#888888]">
                    <span>10 б.</span>
                    <span className="font-bold text-[#D12F2F] dark:text-[#FF6B6B]">{bonusToSpend} б.</span>
                    <span>{maxBonusCanUse} б.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. Cutlery & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-[#E0E0E0] block mb-1.5">
                {t('chopsticksCountLabel', language)}
              </label>
              <div className="flex items-center gap-3 bg-neutral-100 dark:bg-[#1E1E1E] px-3 py-1.5 rounded-xl w-fit border border-neutral-200 dark:border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setChopsticks(Math.max(1, chopsticks - 1))}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-[#262626] text-neutral-900 dark:text-white font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  -
                </button>
                <span className="text-xs font-bold text-neutral-900 dark:text-white min-w-[20px] text-center">
                  {chopsticks}
                </span>
                <button
                  type="button"
                  onClick={() => setChopsticks(chopsticks + 1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-[#262626] text-neutral-900 dark:text-white font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={needCall}
                  onChange={(e) => setNeedCall(e.target.checked)}
                  className="rounded text-[#D12F2F] focus:ring-[#D12F2F] w-4 h-4"
                />
                <span className="text-xs text-neutral-700 dark:text-[#AAAAAA]">
                  Не перезванивать для подтверждения
                </span>
              </label>
            </div>
          </div>

          {/* 5. Order Comment Input */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-[#E0E0E0] block mb-1">
              Комментарий к заказу
            </label>
            <textarea
              rows={2}
              value={orderComment}
              onChange={(e) => setOrderComment(e.target.value)}
              placeholder={t('orderCommentPlaceholder', language)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:border-[#D12F2F] focus:outline-none"
            />
          </div>

          {/* 6. Pricing Breakdown */}
          <div className="pt-4 border-t border-neutral-200 dark:border-[#222222] space-y-1.5 text-xs text-neutral-600 dark:text-[#888888]">
            <div className="flex justify-between">
              <span>{t('subtotal', language)}</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{subtotal} ₽</span>
            </div>
            <div className="flex justify-between">
              <span>{t('deliveryFee', language)}</span>
              <span className={deliveryFee === 0 ? 'text-emerald-500 font-bold' : 'font-semibold text-neutral-900 dark:text-white'}>
                {deliveryFee === 0 ? t('freeDelivery', language) : `${deliveryFee} ₽`}
              </span>
            </div>
            {bonusDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>{t('bonusDiscount', language)}</span>
                <span>-{bonusDiscount} ₽</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-[#222222]">
              <span>{t('totalToPay', language)}</span>
              <span className="font-display-zen text-[#D12F2F] dark:text-[#FF6B6B] text-lg font-bold">
                {totalAmount} ₽
              </span>
            </div>
            <p className="text-[10px] text-[#D12F2F] dark:text-[#FF6B6B] font-medium">
              + Будет начислено: {Math.round(totalAmount * (user?.tier === 'platinum' ? 0.15 : user?.tier === 'gold' ? 0.1 : user?.tier === 'silver' ? 0.05 : 0.03))} баллов кешбэка
            </p>
          </div>

          {/* Submit Button */}
          <button
            id="submit-order-checkout-btn"
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm sm:text-base shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{t('confirmOrderBtn', language)} • {totalAmount} ₽</span>
          </button>

        </form>

      </div>
    </div>
  );
};
