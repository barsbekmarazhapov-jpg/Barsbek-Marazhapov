import React, { useState } from 'react';
import { X, Star, Sparkles, Check, Image, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderReview, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  language: Language;
  onSubmitReview: (review: OrderReview) => void;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  language,
  onSubmitReview,
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '🐟 Свежайшая рыба',
    '⚡ Быстрее 30 мин',
  ]);
  const [comment, setComment] = useState('');
  const [photoAdded, setPhotoAdded] = useState(false);

  if (!isOpen) return null;

  const availableTags = [
    t('tagFreshFish', language),
    t('tagPerfectRice', language),
    t('tagFastDelivery', language),
    t('tagWarmPackaging', language),
    t('tagGenerousFilling', language),
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f43f5e', '#ffffff'],
      });
    } catch {
      // Fallback
    }

    sound.playOrderSuccess();

    const review: OrderReview = {
      id: `rev-${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      rating: overallRating,
      foodRating,
      deliveryRating,
      tags: selectedTags,
      comment,
      userName: 'Александр В.',
      date: new Date().toLocaleDateString(),
      replyFromChef: overallRating >= 4 ? 'Большое спасибо за отзыв! Мы рады готовить для вас!' : undefined,
    };

    onSubmitReview(review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-base shadow-sm">
              ★
            </div>
            <div>
              <h2 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                {t('reviewModalTitle', language)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-[#888888]">
                Заказ {order.orderNumber} • +50 бонусов за отзыв
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-[#1E1E1E] text-neutral-600 dark:text-[#888888] hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Review Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Main Star Selector */}
          <div className="text-center space-y-2 py-2 bg-neutral-50 dark:bg-[#161616] rounded-xl p-4 border border-neutral-200 dark:border-[#262626]">
            <div className="text-xs font-bold uppercase text-neutral-700 dark:text-[#CCCCCC]">
              Общая оценка заказа
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="p-1 text-2xl sm:text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span className={star <= overallRating ? 'text-amber-400' : 'text-neutral-300 dark:text-[#333333]'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-ratings: Food & Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#181818] p-3 rounded-xl border border-neutral-200 dark:border-[#262626] space-y-1 text-center">
              <span className="text-[11px] font-bold text-neutral-700 dark:text-[#CCCCCC] block">
                {t('rateFoodQuality', language)}
              </span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setFoodRating(s)}>
                    <span className={`text-base ${s <= foodRating ? 'text-amber-400' : 'text-neutral-300 dark:text-[#333333]'}`}>★</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#181818] p-3 rounded-xl border border-neutral-200 dark:border-[#262626] space-y-1 text-center">
              <span className="text-[11px] font-bold text-neutral-700 dark:text-[#CCCCCC] block">
                {t('rateDeliverySpeed', language)}
              </span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setDeliveryRating(s)}>
                    <span className={`text-base ${s <= deliveryRating ? 'text-amber-400' : 'text-neutral-300 dark:text-[#333333]'}`}>★</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888]">
              {t('reviewTagsTitle', language)}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#D12F2F] text-white font-bold shadow-sm'
                        : 'bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-[#CCCCCC] hover:bg-neutral-200 dark:hover:bg-[#262626] border border-neutral-200 dark:border-[#262626]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888]">
              Ваш комментарий
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('reviewCommentPlaceholder', language)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 text-xs focus:border-[#D12F2F] focus:outline-none"
            />
          </div>

          {/* Photo attachment simulation */}
          <div>
            <button
              type="button"
              onClick={() => setPhotoAdded(!photoAdded)}
              className={`w-full py-2.5 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                photoAdded
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
                  : 'border-neutral-300 dark:border-[#333333] text-neutral-600 dark:text-[#888888] hover:border-neutral-400'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>{photoAdded ? '✓ Фото блюда прикреплено' : '+ Прикрепить фото сета (по желанию)'}</span>
            </button>
          </div>

          {/* Submit */}
          <button
            id="submit-review-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('submitReviewBtn', language)}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
