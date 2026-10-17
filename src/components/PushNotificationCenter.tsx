import React from 'react';
import { Bell, X, CheckCheck, Sparkles, Bike, ChefHat, MessageSquare } from 'lucide-react';
import { PushNotificationItem, Language } from '../types';
import { t } from '../i18n/translations';

interface PushNotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  language: Language;
  onMarkAllRead: () => void;
  onNotificationClick: (item: PushNotificationItem) => void;
}

export const PushNotificationCenter: React.FC<PushNotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  language,
  onMarkAllRead,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: PushNotificationItem['type']) => {
    switch (type) {
      case 'order_status':
        return <Bike className="w-4 h-4 text-rose-500" />;
      case 'loyalty':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      default:
        return <ChefHat className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#222222] flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-white dark:bg-[#121212] text-neutral-950 dark:text-white flex items-center justify-between border-b border-neutral-200 dark:border-[#222222]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#D12F2F]" />
            <h3 className="font-bold text-sm font-japanese-serif text-neutral-950 dark:text-white">
              {t('notificationsTitle', language)}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-neutral-500 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-white transition-colors flex items-center gap-1"
              title="Прочитать все"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t('markAllRead', language)}</span>
            </button>
            <button onClick={onClose} className="p-1 text-neutral-400 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-[#888888] text-xs">
              <p>{t('noNotifications', language)}</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onNotificationClick(notif);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.isRead
                    ? 'bg-neutral-50 dark:bg-[#161616] border-neutral-200/80 dark:border-[#222222] opacity-75'
                    : 'bg-neutral-100 dark:bg-[#1A1A1A] border-neutral-300 dark:border-[#2E2E2E] shadow-sm'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#222222] border border-neutral-200 dark:border-[#2A2A2A] flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-neutral-950 dark:text-white truncate">
                      {notif.title[language] || notif.title.ru}
                    </h4>
                    <span className="text-[9px] text-neutral-400 dark:text-[#666666] shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-[#AAAAAA] mt-0.5 leading-snug">
                    {notif.body[language] || notif.body.ru}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
