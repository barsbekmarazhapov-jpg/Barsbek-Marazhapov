import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Crosshair,
  Flame,
  ChefHat,
  Package,
  Bike
} from 'lucide-react';
import { Order, OrderStatus, Language } from '../types';
import { t } from '../i18n/translations';
import { sound } from '../utils/audio';

interface CourierTrackingMapProps {
  order: Order;
  language: Language;
  onOpenChat: () => void;
  onCallCourier: () => void;
  onStatusChange?: (newStatus: OrderStatus) => void;
  onOpenReview?: (order: Order) => void;
}

export const CourierTrackingMap: React.FC<CourierTrackingMapProps> = ({
  order,
  language,
  onOpenChat,
  onCallCourier,
  onStatusChange,
  onOpenReview,
}) => {
  const [progress, setProgress] = useState(order.courier?.currentLocation.progress || 0.45);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);

  // Status steps configuration
  const steps: { key: OrderStatus; labelKey: string; icon: React.ReactNode; timeOffset: number }[] = [
    { key: 'created', labelKey: 'orderStatusCreated', icon: <CheckCircle2 className="w-4 h-4" />, timeOffset: 0 },
    { key: 'cooking', labelKey: 'orderStatusCooking', icon: <ChefHat className="w-4 h-4" />, timeOffset: 5 },
    { key: 'ready', labelKey: 'orderStatusReady', icon: <Package className="w-4 h-4" />, timeOffset: 12 },
    { key: 'on_the_way', labelKey: 'orderStatusOnTheWay', icon: <Bike className="w-4 h-4" />, timeOffset: 18 },
    { key: 'arrived', labelKey: 'orderStatusArrived', icon: <Navigation className="w-4 h-4" />, timeOffset: 28 },
    { key: 'delivered', labelKey: 'orderStatusDelivered', icon: <Sparkles className="w-4 h-4 text-amber-500" />, timeOffset: 32 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);

  // Simulated live movement along route spline
  useEffect(() => {
    if (order.status === 'on_the_way') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 0.95) {
            if (onStatusChange && order.status !== 'arrived') {
              sound.playNotification();
              onStatusChange('arrived');
            }
            return 0.98;
          }
          return prev + 0.008;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [order.status, onStatusChange]);

  // Route calculation along curved aesthetic path in SVG coordinate space (800 x 480)
  // Restaurant: (120, 380)
  // Waypoint 1: (240, 260)
  // Waypoint 2: (400, 320)
  // Waypoint 3: (560, 160)
  // Destination Customer House: (680, 110)
  const pathCoordinates = [
    { x: 120, y: 380 },
    { x: 200, y: 310 },
    { x: 270, y: 240 },
    { x: 380, y: 250 },
    { x: 470, y: 310 },
    { x: 550, y: 210 },
    { x: 620, y: 160 },
    { x: 680, y: 110 },
  ];

  // Helper function to interpolate point along multi-segment path
  const getPointAtProgress = (p: number) => {
    const totalSegments = pathCoordinates.length - 1;
    const scaled = p * totalSegments;
    const index = Math.min(Math.floor(scaled), totalSegments - 1);
    const segmentProgress = scaled - index;

    const p0 = pathCoordinates[index];
    const p1 = pathCoordinates[index + 1];

    const x = p0.x + (p1.x - p0.x) * segmentProgress;
    const y = p0.y + (p1.y - p0.y) * segmentProgress;

    // Angle calculation for vehicle orientation
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);

    return { x, y, angle };
  };

  const courierPos = getPointAtProgress(
    order.status === 'delivered' ? 1 : order.status === 'arrived' ? 0.98 : progress
  );

  const distanceRemainingKm = Math.max(0.1, (1 - progress) * 3.2).toFixed(1);
  const minutesLeft = Math.max(2, Math.round((1 - progress) * 22));

  // Path SVG 'd' string
  const svgPathData = `M ${pathCoordinates.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div id="courier-tracking-container" className="space-y-6">
      
      {/* Header Summary Banner */}
      <div className="bg-neutral-900 dark:bg-[#121212] text-white rounded-2xl p-6 shadow-xl border border-neutral-800 dark:border-[#222222] relative overflow-hidden">
        {/* Japanese subtle background seal */}
        <div className="absolute right-4 -bottom-6 text-9xl font-japanese-serif text-white/5 select-none pointer-events-none">
          速達
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#D12F2F] text-white text-xs font-bold font-japanese-serif">
                {order.orderNumber}
              </span>
              <span className="text-xs text-neutral-400 dark:text-[#888888]">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live GPS
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-japanese-serif text-white tracking-tight">
              {order.status === 'cooking' && '🍣 Шеф-повар крутит ваши роллы...'}
              {order.status === 'ready' && '🍱 Заказ собран и упакован в термосумку'}
              {order.status === 'on_the_way' && '🛵 Курьер мчится по вашему адресу!'}
              {order.status === 'arrived' && '📍 Курьер прибыл к вашему дому!'}
              {order.status === 'delivered' && '✨ Заказ успешно доставлен. Приятного аппетита!'}
              {order.status === 'created' && '🍵 Заказ принят в работу рестораном'}
            </h2>

            <p className="text-neutral-300 dark:text-[#AAAAAA] text-sm flex items-center gap-2">
              <span className="font-semibold text-white">{order.deliveryAddress.street}, д. {order.deliveryAddress.house}</span>
              {order.deliveryAddress.apartment && <span>(кв. {order.deliveryAddress.apartment})</span>}
            </p>
          </div>

          {/* Time & Distance Pill */}
          <div className="flex items-center gap-4 bg-white/5 dark:bg-[#181818] border border-neutral-700/60 dark:border-[#262626] rounded-xl p-4 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-[#D12F2F]/20 border border-[#D12F2F]/30 flex items-center justify-center text-[#FF6B6B]">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-neutral-400 dark:text-[#888888] uppercase tracking-wider font-semibold">
                {t('estimatedTime', language)}
              </div>
              <div className="text-2xl font-bold font-display-zen text-amber-400">
                {order.status === 'delivered' ? '0 мин' : `~${minutesLeft} мин`}
              </div>
              <div className="text-[11px] text-neutral-300 dark:text-[#888888]">
                {order.status === 'delivered' ? 'Вручено' : `Расстояние: ${distanceRemainingKm} км`}
              </div>
            </div>
          </div>
        </div>

        {/* Status Progress Stepper */}
        <div className="mt-8 pt-6 border-t border-neutral-800 dark:border-[#222222]">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.key}
                  id={`tracking-step-${step.key}`}
                  onClick={() => onStatusChange && onStatusChange(step.key)}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D12F2F]/15 border border-[#D12F2F] text-white font-semibold shadow-sm'
                      : isCompleted
                      ? 'text-neutral-300 hover:bg-white/5'
                      : 'text-neutral-500 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform ${
                    isCurrent
                      ? 'bg-[#D12F2F] text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {step.icon}
                  </div>
                  <span className="text-[11px] leading-tight line-clamp-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {t(step.labelKey as any, language)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Simulation controls for testing */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-400 dark:text-[#888888]">
            <span className="text-[11px]">💡 Нажимайте на этапы выше или кнопки для симуляции доставки:</span>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <button
                id="sim-cook-btn"
                onClick={() => onStatusChange && onStatusChange('cooking')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 dark:bg-[#1E1E1E] hover:bg-neutral-700 dark:hover:bg-[#262626] text-neutral-200 text-[11px] transition-colors"
              >
                1. Кухня
              </button>
              <button
                id="sim-courier-btn"
                onClick={() => onStatusChange && onStatusChange('on_the_way')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 dark:bg-[#1E1E1E] hover:bg-neutral-700 dark:hover:bg-[#262626] text-neutral-200 text-[11px] transition-colors"
              >
                2. В пути
              </button>
              <button
                id="sim-arrived-btn"
                onClick={() => onStatusChange && onStatusChange('arrived')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 dark:bg-[#1E1E1E] hover:bg-neutral-700 dark:hover:bg-[#262626] text-neutral-200 text-[11px] transition-colors"
              >
                3. У дома
              </button>
              <button
                id="sim-delivered-btn"
                onClick={() => onStatusChange && onStatusChange('delivered')}
                className="px-2.5 py-1 rounded-lg bg-[#D12F2F]/40 hover:bg-[#D12F2F]/60 text-rose-200 text-[11px] transition-colors"
              >
                4. Доставлен
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Courier Card Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Vector Map Canvas (2 cols) */}
        <div className={`lg:col-span-2 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#222222] shadow-xl bg-[#0A0A0A] ${isFullscreen ? 'fixed inset-4 z-50 lg:inset-10' : 'h-[440px] sm:h-[500px]'}`}>
          
          {/* Map Top Bar Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 bg-[#0A0A0A]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-neutral-800 text-xs shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#D12F2F] animate-ping" />
              <span className="font-semibold font-japanese-serif">Live GPS Радар</span>
              <span className="text-neutral-400 dark:text-[#888888]">| Скорость курьера: 34 км/ч</span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0A0A0A]/90 backdrop-blur-md p-1 rounded-xl border border-neutral-800 shadow-lg">
              <button
                onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.6))}
                className="p-1.5 rounded-lg text-neutral-300 hover:bg-[#1E1E1E] transition-colors text-xs font-bold w-7 h-7 flex items-center justify-center"
                title="Приблизить"
              >
                +
              </button>
              <button
                onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}
                className="p-1.5 rounded-lg text-neutral-300 hover:bg-[#1E1E1E] transition-colors text-xs font-bold w-7 h-7 flex items-center justify-center"
                title="Отдалить"
              >
                −
              </button>
              <button
                onClick={() => setMapZoom(1)}
                className="p-1.5 rounded-lg text-neutral-300 hover:bg-[#1E1E1E] transition-colors"
                title="Центрировать"
              >
                <Crosshair className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg text-neutral-300 hover:bg-[#1E1E1E] transition-colors"
                title="На весь экран"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Styled Vector Streets & Animated Courier SVG Map */}
          <div className="w-full h-full relative overflow-hidden bg-[#101010] flex items-center justify-center">
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `scale(${mapZoom})` }}
            >
              {/* Background Water / Park Zones */}
              <defs>
                <pattern id="streetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222222" strokeWidth="1" opacity="0.6" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D12F2F" />
                  <stop offset="100%" stopColor="#FF6B6B" />
                </linearGradient>
                <radialGradient id="pulseGlow">
                  <stop offset="0%" stopColor="#D12F2F" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D12F2F" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Map background grid */}
              <rect width="800" height="480" fill="#0D0D0D" />
              <rect width="800" height="480" fill="url(#streetGrid)" />

              {/* Japanese River / Water Body */}
              <path
                d="M -20 220 C 140 180, 260 260, 420 210 C 580 160, 720 240, 820 180 L 820 240 C 720 300, 580 220, 420 270 C 260 320, 140 240, -20 280 Z"
                fill="#161B22"
                opacity="0.8"
              />
              <text x="430" y="245" fill="#58A6FF" fontSize="10" opacity="0.5" fontStyle="italic">
                〜 Река Сумида 〜
              </text>

              {/* Sakura Park Zone */}
              <rect x="50" y="60" width="160" height="120" rx="12" fill="#13231B" opacity="0.7" />
              <text x="65" y="85" fill="#4ade80" fontSize="10" opacity="0.6">
                🌳 Парк Сакуры (Sakura Park)
              </text>

              {/* Major Street Lines */}
              <line x1="0" y1="140" x2="800" y2="140" stroke="#222222" strokeWidth="8" />
              <line x1="0" y1="360" x2="800" y2="360" stroke="#222222" strokeWidth="8" />
              <line x1="200" y1="0" x2="200" y2="480" stroke="#222222" strokeWidth="8" />
              <line x1="500" y1="0" x2="500" y2="480" stroke="#222222" strokeWidth="8" />
              <line x1="680" y1="0" x2="680" y2="480" stroke="#222222" strokeWidth="6" />

              {/* Street Names */}
              <text x="210" y="30" fill="#777777" fontSize="9" opacity="0.6">
                пр. Токио Авеню
              </text>
              <text x="510" y="450" fill="#777777" fontSize="9" opacity="0.6">
                ул. Самурайская
              </text>
              <text x="20" y="352" fill="#777777" fontSize="9" opacity="0.6">
                Набережная Гинза
              </text>

              {/* Route Polyline Background (Road track) */}
              <path
                d={svgPathData}
                fill="none"
                stroke="#2B2B2B"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Route Active Glow Line */}
              <path
                d={svgPathData}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 4"
                className="animate-pulse"
              />

              {/* 1. START POINT: Sushi Cafe Restaurant Pin */}
              <g transform="translate(120, 380)">
                <circle r="22" fill="#D12F2F" fillOpacity="0.2" className="animate-ping" />
                <circle r="16" fill="#B71C1C" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="14">
                  🍣
                </text>
                {/* Label Box */}
                <rect x="-60" y="-38" width="120" height="22" rx="6" fill="#121212" stroke="#D12F2F" strokeWidth="1" />
                <text x="0" y="-23" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  «Суши Роллы» Кафе
                </text>
              </g>

              {/* 2. END POINT: Customer Home Pin */}
              <g transform="translate(680, 110)">
                <circle r="24" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                <circle r="16" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="14">
                  🏠
                </text>
                {/* Destination Label Box */}
                <rect x="-55" y="-38" width="110" height="22" rx="6" fill="#121212" stroke="#10b981" strokeWidth="1" />
                <text x="0" y="-23" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  Ваш адрес (Дом)
                </text>
              </g>

              {/* 3. MOVING COURIER MARKER */}
              <g transform={`translate(${courierPos.x}, ${courierPos.y})`}>
                {/* Radar Sonar Rings */}
                <circle r="30" fill="url(#pulseGlow)" className="animate-radar" />
                <circle r="18" fill="#D12F2F" stroke="#ffffff" strokeWidth="3" shadow="0 4px 10px rgba(0,0,0,0.5)" />
                
                {/* Courier Scooter / Bike Icon with rotation */}
                <g transform={`rotate(${courierPos.angle})`}>
                  <text x="0" y="4" textAnchor="middle" fontSize="15" dominantBaseline="middle">
                    🛵
                  </text>
                </g>

                {/* Floating Courier Name Pill */}
                <g transform="translate(0, -28)">
                  <rect x="-40" y="-12" width="80" height="18" rx="6" fill="#121212" stroke="#D12F2F" strokeWidth="1.5" />
                  <text x="0" y="1" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    {order.courier?.name || 'Кэндзи'} (Курьер)
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Bottom Map Status Ticker */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between bg-[#0A0A0A]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="text-[#D12F2F] font-bold">●</span>
              <span>Термосумка T-Max сохраняет роллы при +65°C / -2°C</span>
            </div>
            <div className="font-semibold text-amber-400">
              {order.status === 'delivered' ? '✓ Заказ доставлен' : `Осталось: ~${distanceRemainingKm} км`}
            </div>
          </div>
        </div>

        {/* Courier Details & Action Card (1 col) */}
        <div className="space-y-4">
          
          {/* Courier Card */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-neutral-200 dark:border-[#222222] shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-neutral-500 dark:text-[#888888] font-bold">
                {t('courierCardTitle', language)}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-[#1E1E1E] px-2 py-0.5 rounded-md border border-amber-200 dark:border-[#2E2E2E]">
                ★ {order.courier?.rating || '4.98'} ({order.courier?.totalDeliveries || 850}+)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img
                  src={order.courier?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'}
                  alt={order.courier?.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#D12F2F] shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white text-[10px]" title="Онлайн">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-neutral-950 dark:text-white font-japanese-serif">
                  {order.courier?.name || 'Кэндзи Танака'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#888888] flex items-center gap-1 mt-0.5">
                  <Bike className="w-3.5 h-3.5 text-[#D12F2F]" />
                  <span>Электроскутер Yamaha E-Vino • № 74-29</span>
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Вакцинирован, термосумка продезинфицирована</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Call / Chat) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="call-courier-btn"
                onClick={onCallCourier}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-[#1A1A1A] hover:bg-neutral-200 dark:hover:bg-[#262626] text-neutral-900 dark:text-white font-semibold text-sm transition-colors border border-neutral-200 dark:border-[#262626]"
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>{t('callCourier', language)}</span>
              </button>

              <button
                id="chat-courier-btn"
                onClick={onOpenChat}
                className="relative flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('chatWithCourier', language)}</span>
                {order.chatMessages && order.chatMessages.filter(m => m.sender === 'courier' && !m.isRead).length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Order Contents Overview */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-neutral-200 dark:border-[#222222] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-[#888888] uppercase tracking-wider">
                Состав заказа ({order.items.length})
              </span>
              <span className="text-sm font-bold text-neutral-950 dark:text-white font-display-zen">
                {order.total} ₽
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs py-1 border-b border-neutral-100 dark:border-[#1E1E1E] last:border-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={it.menuItem.image}
                      alt={it.menuItem.name[language]}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-neutral-800 dark:text-[#CCCCCC] line-clamp-1">
                        {it.menuItem.name[language]}
                      </div>
                      <div className="text-[10px] text-neutral-400 dark:text-[#666666]">
                        {it.quantity} × {it.menuItem.price} ₽
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {it.quantity * it.menuItem.price} ₽
                  </span>
                </div>
              ))}
            </div>

            {/* Leave Review Button if Delivered */}
            {order.status === 'delivered' && (
              <button
                id="order-leave-review-btn"
                onClick={() => onOpenReview && onOpenReview(order)}
                className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('leaveReview', language)} (+50 баллов)</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
