import React, { useState } from 'react';
import { X, Flame, Leaf, Sparkles, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart: (item: MenuItem, quantity: number, options?: { extraWasabi?: boolean; extraGinger?: boolean }) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  language,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [extraWasabi, setExtraWasabi] = useState(false);
  const [extraGinger, setExtraGinger] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isOpen || !item) return null;

  const handleAdd = () => {
    sound.playAddToCart();
    setAddedAnimation(true);
    onAddToCart(item, quantity, { extraWasabi, extraGinger });
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Dish Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-[#0A0A0A]">
          <img
            src={item.image}
            alt={item.name[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-black/40" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-1.5">
            {item.chefPick && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950 text-xs font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>{t('badgeChefPick', language)}</span>
              </span>
            )}
            {item.spicy && (
              <span className="px-2.5 py-1 rounded-lg bg-[#D12F2F] text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3" />
                <span>{t('badgeSpicy', language)}</span>
              </span>
            )}
            {item.vegetarian && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <Leaf className="w-3 h-3" />
                <span>{t('badgeVegetarian', language)}</span>
              </span>
            )}
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-neutral-200/40 dark:border-[#2A2A2A]">
              <span className="font-display-zen font-bold text-lg text-[#D12F2F] dark:text-[#FF6B6B]">
                {item.price} ₽
              </span>
              {item.oldPrice && (
                <span className="text-xs text-neutral-400 dark:text-[#888888] line-through ml-2">
                  {item.oldPrice} ₽
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Info Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <h2 className="text-xl font-bold font-japanese-serif text-neutral-950 dark:text-white">
              {item.name[language]}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-[#888888] mt-1 font-semibold">
              <span>{item.weight}</span>
              {item.pieces && <span>• {item.pieces} {t('piecesCount', language)}</span>}
              <span>• {item.calories} {t('kcal', language)}</span>
              <span className="text-amber-500">★ {item.rating} ({item.reviewsCount})</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#AAAAAA] leading-relaxed">
            {item.description[language]}
          </p>

          {/* Ingredients list */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888]">
              Состав и ингредиенты:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(item.ingredients[language] || item.ingredients.ru).map((ing, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-[#CCCCCC] text-xs font-medium border border-neutral-200/60 dark:border-[#262626]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Add-ons checkboxes */}
          <div className="pt-2 border-t border-neutral-200 dark:border-[#222222] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888]">
              Дополнительно:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={extraWasabi}
                  onChange={(e) => setExtraWasabi(e.target.checked)}
                  className="rounded text-[#D12F2F] focus:ring-[#D12F2F]"
                />
                <span className="text-neutral-700 dark:text-[#E0E0E0] font-medium">Экстра Васаби</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={extraGinger}
                  onChange={(e) => setExtraGinger(e.target.checked)}
                  className="rounded text-[#D12F2F] focus:ring-[#D12F2F]"
                />
                <span className="text-neutral-700 dark:text-[#E0E0E0] font-medium">Розовый имбирь</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-white dark:bg-[#121212] border-t border-neutral-200 dark:border-[#222222] flex items-center justify-between gap-4">
          
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-[#1A1A1A] p-1.5 rounded-xl border border-neutral-200 dark:border-[#262626]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white dark:bg-[#262626] hover:bg-neutral-200 dark:hover:bg-[#333333] text-neutral-900 dark:text-white font-bold flex items-center justify-center shadow-sm transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-bold text-sm text-neutral-900 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white dark:bg-[#262626] hover:bg-neutral-200 dark:hover:bg-[#333333] text-neutral-900 dark:text-white font-bold flex items-center justify-center shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="modal-add-to-cart-btn"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors"
          >
            {addedAnimation ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            <span>{addedAnimation ? t('added', language) : `${t('addToCart', language)} • ${item.price * quantity} ₽`}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
