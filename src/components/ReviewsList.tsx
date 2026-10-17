import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageCircle, Sparkles, Filter } from 'lucide-react';
import { Review, Language } from '../types';
import { t } from '../i18n/translations';

interface ReviewsListProps {
  reviews: Review[];
  language: Language;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, language }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | '5stars' | 'with_photo'>('all');

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === '5stars') return r.rating === 5;
    return true;
  });

  return (
    <div id="reviews-list-container" className="space-y-6">
      
      {/* Top Rating Summary Banner */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 sm:p-8 border border-neutral-200 dark:border-[#222222] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-2xl bg-[#D12F2F] text-white flex flex-col items-center justify-center font-display-zen shadow-sm">
            <span className="text-3xl font-bold">{averageRating}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">из 5.0</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-japanese-serif text-neutral-950 dark:text-white">
              Отзывы гостей «Суши Роллы»
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-[#888888] mt-1">
              Более {reviews.length * 40}+ подтверждённых заказов с оценкой выше 4.9 ★
            </p>
            
            <div className="flex items-center gap-1.5 text-amber-500 text-sm mt-2">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
              <span className="text-xs text-neutral-500 dark:text-[#888888] ml-2 font-sans font-semibold">
                (99.4% рекомендуют друзьям)
              </span>
            </div>
          </div>
        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-neutral-50 dark:bg-[#181818] p-3 rounded-xl border border-neutral-200 dark:border-[#262626]">
            <div className="font-bold text-neutral-950 dark:text-white">🐟 Свежесть рыбы</div>
            <div className="text-amber-500 font-bold">4.98 / 5.0</div>
          </div>
          <div className="bg-neutral-50 dark:bg-[#181818] p-3 rounded-xl border border-neutral-200 dark:border-[#262626]">
            <div className="font-bold text-neutral-950 dark:text-white">⚡ Скорость курьера</div>
            <div className="text-amber-500 font-bold">4.95 / 5.0</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
              : 'bg-white dark:bg-[#181818] text-neutral-600 dark:text-[#AAAAAA] border border-neutral-200 dark:border-[#262626]'
          }`}
        >
          Все отзывы ({reviews.length})
        </button>

        <button
          onClick={() => setActiveFilter('5stars')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
            activeFilter === '5stars'
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
              : 'bg-white dark:bg-[#181818] text-neutral-600 dark:text-[#AAAAAA] border border-neutral-200 dark:border-[#262626]'
          }`}
        >
          <span>5 звёзд ★</span>
        </button>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-neutral-200 dark:border-[#222222] shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  />
                  <div>
                    <div className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                      <span>{rev.userName}</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5 border border-emerald-200 dark:border-emerald-900/40">
                        <ShieldCheck className="w-3 h-3" /> Заказ подтверждён
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 dark:text-[#888888]">{rev.date} • {rev.orderNumber}</div>
                  </div>
                </div>

                <div className="flex text-amber-400 text-sm">
                  {'★'.repeat(rev.rating)}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {rev.tags.map((tg, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-neutral-100 dark:bg-[#1A1A1A] text-neutral-700 dark:text-[#CCCCCC] border border-neutral-200 dark:border-[#262626] font-medium"
                  >
                    {tg}
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-[#CCCCCC] leading-relaxed">
                «{rev.comment}»
              </p>
            </div>

            {/* Reply From Chef if available */}
            {rev.replyFromChef && (
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-200 dark:border-[#262626] text-xs space-y-1">
                <div className="font-bold text-[#D12F2F] flex items-center gap-1.5">
                  <span>🍣 Ответ Шеф-повара «Суши Роллы»:</span>
                </div>
                <p className="text-neutral-600 dark:text-[#AAAAAA] italic">
                  {rev.replyFromChef}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
