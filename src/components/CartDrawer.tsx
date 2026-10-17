import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  language: Language;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const freeThreshold = 1500;
  const progressToFree = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const amountToFree = Math.max(0, freeThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#121212] shadow-2xl border-l border-neutral-200 dark:border-[#222222] flex flex-col">
          
          {/* Cart Header */}
          <div className="p-5 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D12F2F] flex items-center justify-center font-bold text-white shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                  {t('cartTitle', language)}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-[#888888]">
                  {items.length} {t('piecesCount', language)} блюд
                </p>
              </div>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-[#888888] hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery meter */}
          <div className="p-4 bg-neutral-50 dark:bg-[#181818] border-b border-neutral-200 dark:border-[#222222]">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-[#E0E0E0] mb-1.5">
              <span>{amountToFree === 0 ? '✨ Доставка БЕСПЛАТНАЯ!' : `До бесплатной доставки: ${amountToFree} ₽`}</span>
              <span className="font-bold text-[#D12F2F] dark:text-[#FF6B6B]">{progressToFree}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-[#262626] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#D12F2F] transition-all duration-300"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-5xl">🍣</div>
                <h3 className="font-bold text-base text-neutral-950 dark:text-white font-japanese-serif">
                  {t('cartEmpty', language)}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#888888] max-w-xs mx-auto">
                  {t('cartEmptyDesc', language)}
                </p>
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={it.id}
                  className="bg-white dark:bg-[#161616] rounded-xl p-3.5 border border-neutral-200 dark:border-[#262626] flex items-center justify-between gap-3 shadow-sm"
                >
                  <img
                    src={it.menuItem.image}
                    alt={it.menuItem.name[language]}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-950 dark:text-white truncate">
                      {it.menuItem.name[language]}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-[#888888]">
                      {it.menuItem.weight} {it.menuItem.pieces ? `• ${it.menuItem.pieces} шт` : ''}
                    </p>
                    <span className="font-display-zen font-bold text-xs sm:text-sm text-[#D12F2F] dark:text-[#FF6B6B]">
                      {it.menuItem.price * it.quantity} ₽
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-[#1E1E1E] p-1 rounded-lg border border-neutral-200 dark:border-[#2A2A2A]">
                    <button
                      onClick={() => {
                        sound.playAddToCart();
                        if (it.quantity > 1) {
                          onUpdateQuantity(it.id, it.quantity - 1);
                        } else {
                          onRemoveItem(it.id);
                        }
                      }}
                      className="w-6 h-6 rounded-md bg-white dark:bg-[#262626] hover:bg-neutral-200 dark:hover:bg-[#333333] text-neutral-700 dark:text-[#E0E0E0] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="text-xs font-bold text-neutral-900 dark:text-white min-w-[18px] text-center">
                      {it.quantity}
                    </span>

                    <button
                      onClick={() => {
                        sound.playAddToCart();
                        onUpdateQuantity(it.id, it.quantity + 1);
                      }}
                      className="w-6 h-6 rounded-md bg-white dark:bg-[#262626] hover:bg-neutral-200 dark:hover:bg-[#333333] text-neutral-700 dark:text-[#E0E0E0] flex items-center justify-center text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 bg-white dark:bg-[#121212] border-t border-neutral-200 dark:border-[#222222] space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-neutral-700 dark:text-[#AAAAAA]">
                <span>{t('subtotal', language)}</span>
                <span className="font-display-zen font-bold text-neutral-950 dark:text-white text-base">
                  {subtotal} ₽
                </span>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('checkoutBtn', language)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
