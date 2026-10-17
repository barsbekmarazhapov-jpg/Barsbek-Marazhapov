import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Leaf, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Heart,
  Filter,
  Volume2,
  Bell,
  Star,
  Check,
  Bike
} from 'lucide-react';
import { 
  Language, 
  Theme, 
  MenuItem, 
  CartItem, 
  UserProfile, 
  Order, 
  OrderStatus, 
  Review, 
  PushNotificationItem, 
  ChatMessage, 
  CategoryId,
  Address,
  PaymentMethodType
} from './types';
import { CATEGORIES, MENU_ITEMS, INITIAL_REVIEWS } from './data/menu';
import { t } from './i18n/translations';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { CourierTrackingMap } from './components/CourierTrackingMap';
import { CourierChatModal } from './components/CourierChatModal';
import { CheckoutModal } from './components/CheckoutModal';
import { UserCabinet } from './components/UserCabinet';
import { OrderReviewModal } from './components/OrderReviewModal';
import { ReviewsList } from './components/ReviewsList';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { PushNotificationCenter } from './components/PushNotificationCenter';

export default function App() {
  // 1. Core Theme & Locale State
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('ru');
  const [activeTab, setActiveTab] = useState<string>('menu');

  // Apply dark mode class to <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 2. User State (Initial logged in demo user)
  const [user, setUser] = useState<UserProfile | null>({
    id: 'usr-default',
    name: 'Александр Волков',
    phone: '+7 (999) 450-88-22',
    email: 'alex.volkov@sushi-rolls.ru',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    provider: 'phone',
    bonusPoints: 420,
    tier: 'silver',
    totalOrdersCount: 6,
    totalSpent: 6350,
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
        comment: 'Оставить у двери',
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
  });

  // 3. Menu & Search Filtering
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);
  const [filterVeggieOnly, setFilterVeggieOnly] = useState(false);
  const [filterChefPickOnly, setFilterChefPickOnly] = useState(false);

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      menuItem: MENU_ITEMS[0], // Philadelphia Premium
      quantity: 1,
    },
    {
      id: 'cart-init-2',
      menuItem: MENU_ITEMS[7], // Ceremonial Matcha
      quantity: 2,
    },
  ]);

  // 5. Active Order & Tracking
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'order-live-1',
      orderNumber: '#85104',
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      items: [
        { id: 'item-1', menuItem: MENU_ITEMS[0], quantity: 1 },
        { id: 'item-2', menuItem: MENU_ITEMS[1], quantity: 1 },
      ],
      subtotal: 1470,
      deliveryFee: 0,
      discount: 0,
      bonusUsed: 50,
      bonusEarned: 70,
      total: 1420,
      status: 'on_the_way',
      statusHistory: [
        { status: 'created', timestamp: '17:30', description: { ru: 'Заказ принят', ja: '注文受付', en: 'Order Accepted', kk: 'Қабылданды' } },
        { status: 'cooking', timestamp: '17:35', description: { ru: 'Шеф готовит роллы', ja: '調理中', en: 'Chef is rolling', kk: 'Дайындалуда' } },
        { status: 'ready', timestamp: '17:42', description: { ru: 'Собрано в термосумку', ja: '梱包完了', en: 'Packed in bag', kk: 'Сөмкеге салынды' } },
        { status: 'on_the_way', timestamp: '17:45', description: { ru: 'Курьер мчится к вам', ja: '配達員急行中', en: 'On the way', kk: 'Жолда' } },
      ],
      estimatedMinutesLeft: 12,
      courier: {
        id: 'courier-1',
        name: 'Кэндзи Танака',
        phone: '+7 (903) 123-45-67',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        vehicle: 'scooter',
        rating: 4.98,
        totalDeliveries: 840,
        currentLocation: {
          lat: 55.7558,
          lng: 37.6173,
          progress: 0.55,
        },
      },
      deliveryAddress: {
        id: 'addr-order-1',
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
      paymentMethod: 'saved_card',
      paymentStatus: 'paid',
      chopsticksCount: 2,
      needCall: false,
      chatMessages: [
        {
          id: 'msg-sys-1',
          sender: 'system',
          text: 'Курьер Кэндзи принял ваш заказ и выехал из суши-кафе.',
          timestamp: '17:45',
          isRead: true,
        },
        {
          id: 'msg-1',
          sender: 'user',
          text: 'Здравствуйте! Код домофона 42К, 5 этаж.',
          timestamp: '17:46',
          isRead: true,
        },
        {
          id: 'msg-2',
          sender: 'courier',
          text: 'Добрый вечер! Принял, буду у вас через 10-12 минут.',
          timestamp: '17:47',
          isRead: true,
        },
      ],
    },
  ]);

  const [activeOrderId, setActiveOrderId] = useState<string>('order-live-1');
  const currentActiveOrder = orders.find(o => o.id === activeOrderId) || orders[0];

  // 6. Community Reviews
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // 7. Push Notifications
  const [notifications, setNotifications] = useState<PushNotificationItem[]>([
    {
      id: 'notif-1',
      title: {
        ru: '🛵 Курьер выехал по вашему адресу!',
        ja: '🛵 配達員が出発しました！',
        en: '🛵 Courier is on the way!',
        kk: '🛵 Курьер сізге қарай шықты!',
      },
      body: {
        ru: 'Кэндзи на электроскутере прибудет примерно через 12 минут.',
        ja: '担当配達員ケンジが向かっています（到着目安: 12分）',
        en: 'Kenji on e-scooter will arrive in about 12 minutes.',
        kk: 'Кэндзи шамамен 12 минутта келіп жетеді.',
      },
      timestamp: '5 мин назад',
      type: 'order_status',
      isRead: false,
      orderId: 'order-live-1',
    },
    {
      id: 'notif-2',
      title: {
        ru: '🌸 Вам начислено 70 бонусов Сакура Club',
        ja: '🌸 70ポイント獲得しました',
        en: '🌸 You earned 70 Sakura Club points',
        kk: '🌸 Сізге 70 бонус есептелді',
      },
      body: {
        ru: 'Кешбэк 5% за предыдущий заказ успешно зачислен на ваш баланс.',
        ja: '前回の注文の5%ポイントが加算されました。',
        en: '5% cashback from your previous order is ready to use.',
        kk: 'Алдыңғы тапсырыстың 5% кешбэгі балансқа түсті.',
      },
      timestamp: '2 часа назад',
      type: 'loyalty',
      isRead: true,
    },
  ]);

  // 8. Toast Alert State
  const [activeToast, setActiveToast] = useState<{ title: string; body: string } | null>(null);

  const showToast = (title: string, body: string) => {
    sound.playNotification();
    setActiveToast({ title, body });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  // 9. Modals Open/Close States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallingCourier, setIsCallingCourier] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedDishForModal, setSelectedDishForModal] = useState<MenuItem | null>(null);
  const [reviewOrderTarget, setReviewOrderTarget] = useState<Order | null>(null);

  // Filtered menu items
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (filterSpicyOnly && !item.spicy) return false;
    if (filterVeggieOnly && !item.vegetarian) return false;
    if (filterChefPickOnly && !item.chefPick) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.name[language] || item.name.ru).toLowerCase();
      const desc = (item.description[language] || item.description.ru).toLowerCase();
      const ingredients = (item.ingredients[language] || item.ingredients.ru).join(' ').toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !ingredients.includes(q)) return false;
    }
    return true;
  });

  // Cart operations
  const handleAddToCart = (item: MenuItem, quantity = 1, options?: { extraWasabi?: boolean; extraGinger?: boolean }) => {
    sound.playAddToCart();
    setCart((prev) => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${item.id}`,
          menuItem: item,
          quantity,
          selectedOptions: options,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCart((prev) => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter(i => i.id !== id));
  };

  // Place Order Handler
  const handlePlaceOrder = (orderData: {
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
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
    const deliveryFee = subtotal >= 1500 ? 0 : 250;
    const total = Math.max(0, subtotal + deliveryFee - orderData.bonusUsed);
    const bonusEarned = Math.round(total * 0.05);

    const newOrderNumber = `#${Math.floor(80000 + Math.random() * 19000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: 0,
      bonusUsed: orderData.bonusUsed,
      bonusEarned,
      total,
      status: 'cooking',
      statusHistory: [
        { status: 'created', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: { ru: 'Заказ принят', ja: '注文受付完了', en: 'Order Accepted', kk: 'Қабылданды' } },
        { status: 'cooking', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), description: { ru: 'Шеф-повар крутит роллы', ja: '調理中', en: 'Chef is rolling', kk: 'Дайындалуда' } },
      ],
      estimatedMinutesLeft: 35,
      courier: {
        id: 'courier-kenji',
        name: 'Кэндзи Танака',
        phone: '+7 (903) 123-45-67',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
        vehicle: 'scooter',
        rating: 4.98,
        totalDeliveries: 841,
        currentLocation: {
          lat: 55.7558,
          lng: 37.6173,
          progress: 0.1,
        },
      },
      deliveryAddress: orderData.address,
      paymentMethod: orderData.paymentMethod,
      selectedCardId: orderData.selectedCardId,
      paymentStatus: 'paid',
      chopsticksCount: orderData.chopsticksCount,
      needCall: orderData.needCall,
      orderComment: orderData.orderComment,
      chatMessages: [
        {
          id: `msg-sys-${Date.now()}`,
          sender: 'system',
          text: `Заказ ${newOrderNumber} принят! Шеф-повар приступил к приготовлению.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        },
      ],
    };

    // Update user profile points and saved cards if requested
    if (user) {
      const updatedCards = [...user.savedCards];
      if (orderData.saveCardToProfile && orderData.newCardData) {
        const masked = `•••• ${orderData.newCardData.number.slice(-4)}`;
        updatedCards.push({
          id: `card-${Date.now()}`,
          numberMasked: masked,
          expiryDate: orderData.newCardData.expiry,
          brand: orderData.newCardData.brand,
          holderName: orderData.newCardData.holder,
          isDefault: updatedCards.length === 0,
          colorScheme: 'ruby',
        });
      }

      setUser({
        ...user,
        bonusPoints: user.bonusPoints - orderData.bonusUsed + bonusEarned,
        totalOrdersCount: user.totalOrdersCount + 1,
        totalSpent: user.totalSpent + total,
        savedCards: updatedCards,
      });
    }

    setOrders([newOrder, ...orders]);
    setActiveOrderId(newOrder.id);
    setCart([]);
    setIsCheckoutOpen(false);
    setActiveTab('track');

    // Add push notification & toast
    const newPush: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: {
        ru: `🍱 Заказ ${newOrderNumber} успешно оплачен!`,
        ja: `🍱 注文 ${newOrderNumber} の受付が完了しました`,
        en: `🍱 Order ${newOrderNumber} confirmed!`,
        kk: `🍱 Тапсырыс ${newOrderNumber} сәтті қабылданды!`,
      },
      body: {
        ru: `Шеф-повар крутит ваши роллы. Доставка за ~35 мин. Начислено +${bonusEarned} бонусов!`,
        ja: `板前が調理を開始しました。お届け予定: 約35分。+${bonusEarned}pt獲得！`,
        en: `Chef is rolling your sushi. Delivery in ~35 mins. Earned +${bonusEarned} bonus pts!`,
        kk: `Шеф-аспаз дайындауда. Жеткізу ~35 мин. +${bonusEarned} бонус қосылды!`,
      },
      timestamp: 'Только что',
      type: 'order_status',
      isRead: false,
      orderId: newOrder.id,
    };

    setNotifications([newPush, ...notifications]);
    showToast(newPush.title[language], newPush.body[language]);
  };

  // Status Change handler for active order simulation
  const handleOrderStatusChange = (newStatus: OrderStatus) => {
    if (!currentActiveOrder) return;
    const updated = {
      ...currentActiveOrder,
      status: newStatus,
      statusHistory: [
        ...currentActiveOrder.statusHistory,
        {
          status: newStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: {
            ru: newStatus === 'cooking' ? 'Шеф готовит роллы' : newStatus === 'ready' ? 'Собрано в термосумку' : newStatus === 'on_the_way' ? 'Курьер мчится к вам' : newStatus === 'arrived' ? 'Курьер у вашего дома!' : 'Заказ доставлен',
            ja: '状況更新',
            en: 'Status updated',
            kk: 'Мәртебе жаңартылды',
          },
        },
      ],
    };

    setOrders(orders.map(o => o.id === currentActiveOrder.id ? updated : o));

    const statusTitles: Record<OrderStatus, Record<Language, string>> = {
      created: { ru: 'Заказ принят', ja: '注文受付', en: 'Order Accepted', kk: 'Қабылданды' },
      cooking: { ru: '🍣 Шеф-повар крутит ваши роллы!', ja: '🍣 調理中', en: '🍣 Chef is rolling sushi', kk: '🍣 Роллдар дайындалуда' },
      ready: { ru: '🍱 Заказ упакован в термосумку T-Max', ja: '🍱 梱包完了', en: '🍱 Packed in thermo-bag', kk: '🍱 Термосөмкеге салынды' },
      on_the_way: { ru: '🛵 Курьер уже мчится по вашему адресу!', ja: '🛵 配達員が急行中！', en: '🛵 Courier is on the way!', kk: '🛵 Курьер жолда келеді!' },
      arrived: { ru: '📍 Курьер прибыл к вашему дому!', ja: '📍 配達員が到着しました！', en: '📍 Courier arrived at your home!', kk: '📍 Курьер үйіңізге жетті!' },
      delivered: { ru: '✨ Заказ доставлен. Приятного аппетита!', ja: '✨ 配達完了。いただきます！', en: '✨ Delivered. Bon Appétit!', kk: '✨ Жеткізілді. Асыңыз дәмді болсын!' },
      cancelled: { ru: 'Заказ отменён', ja: 'キャンセル', en: 'Cancelled', kk: 'Бас тартылды' },
    };

    const push: PushNotificationItem = {
      id: `notif-${Date.now()}`,
      title: statusTitles[newStatus],
      body: {
        ru: `Заказ ${currentActiveOrder.orderNumber} • ${currentActiveOrder.deliveryAddress.street}`,
        ja: `注文 ${currentActiveOrder.orderNumber}`,
        en: `Order ${currentActiveOrder.orderNumber}`,
        kk: `Тапсырыс ${currentActiveOrder.orderNumber}`,
      },
      timestamp: 'Только что',
      type: 'order_status',
      isRead: false,
      orderId: currentActiveOrder.id,
    };

    setNotifications([push, ...notifications]);
    showToast(push.title[language], push.body[language]);
  };

  // Chat message sending
  const handleSendChatMessage = (text: string) => {
    if (!currentActiveOrder) return;

    if (text.startsWith('[courier_reply]:')) {
      const replyContent = text.replace('[courier_reply]:', '');
      const courierMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'courier',
        text: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };

      const updated = {
        ...currentActiveOrder,
        chatMessages: [...currentActiveOrder.chatMessages, courierMsg],
      };
      setOrders(orders.map(o => o.id === currentActiveOrder.id ? updated : o));

      // Push notification for courier message
      const push: PushNotificationItem = {
        id: `notif-${Date.now()}`,
        title: {
          ru: `💬 Новое сообщение от курьера (${currentActiveOrder.courier?.name})`,
          ja: `💬 配達員からのメッセージ`,
          en: `💬 Message from Courier (${currentActiveOrder.courier?.name})`,
          kk: `💬 Курьерден жаңа хабарлама`,
        },
        body: {
          ru: replyContent,
          ja: replyContent,
          en: replyContent,
          kk: replyContent,
        },
        timestamp: 'Только что',
        type: 'chat',
        isRead: false,
        orderId: currentActiveOrder.id,
      };
      setNotifications([push, ...notifications]);
      showToast(push.title[language], push.body[language]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    const updated = {
      ...currentActiveOrder,
      chatMessages: [...currentActiveOrder.chatMessages, userMsg],
    };
    setOrders(orders.map(o => o.id === currentActiveOrder.id ? updated : o));
  };

  // Review submission
  const handleSubmitReview = (review: Review) => {
    setReviews([review, ...reviews]);
    if (user) {
      setUser({
        ...user,
        bonusPoints: user.bonusPoints + 50,
      });
    }
    setReviewOrderTarget(null);
    showToast('✨ Спасибо за ваш отзыв!', 'Вам начислено +50 баллов Сакура Club на счёт.');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-japanese-pattern-dark text-neutral-100' : 'bg-japanese-pattern-light text-neutral-900'
    }`}>
      
      {/* 1. Universal Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAuth={() => setIsAuthOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        activeOrderCount={orders.filter(o => o.status !== 'delivered').length}
      />

      {/* 2. Floating Live Push Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white/95 dark:bg-[#121212]/95 text-neutral-900 dark:text-[#E0E0E0] p-4 rounded-2xl shadow-xl border border-neutral-200 dark:border-[#262626] backdrop-blur-md animate-in slide-in-from-top-5 duration-300 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#D12F2F] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-white animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs sm:text-sm font-japanese-serif text-neutral-900 dark:text-white">
              {activeToast.title}
            </h4>
            <p className="text-[11px] text-neutral-600 dark:text-[#999999] mt-0.5 line-clamp-2">
              {activeToast.body}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Main Content View Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        
        {/* TAB A: MENU (Online Ordering & Categories) */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            
            {/* Japanese Clean Minimalism Aesthetic Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#121212] text-neutral-900 dark:text-[#E0E0E0] p-6 sm:p-10 border border-neutral-200 dark:border-[#222222] shadow-sm">
              {/* Background decorative kanji */}
              <div className="absolute right-6 -bottom-10 text-[180px] font-japanese-serif text-neutral-900/[0.03] dark:text-white/[0.03] select-none pointer-events-none">
                鮮
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neutral-100 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#2A2A2A] text-[#D12F2F] dark:text-[#FF6B6B] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#D12F2F] animate-ping" />
                  <span>Традиции Токио • Норвежский лосось • Сакура Club до 15%</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-japanese-serif tracking-tight text-neutral-950 dark:text-white leading-tight">
                  Искусство аутентичных суши и премиальных роллов
                </h1>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-[#999999] max-w-lg leading-relaxed">
                  Используем правильный рис Кошихикари, дикий тихоокеанский тунец Чу-Торо и свежайшие морепродукты. Доставляем в специальных термосумках за 30-45 минут.
                </p>

                {/* Quick features pill row */}
                <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-neutral-700 dark:text-[#B0B0B0]">
                  <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-[#262626]">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Быстрая доставка от 30 мин</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-[#262626]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% свежесть рыбы</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-neutral-100 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-neutral-200/80 dark:border-[#262626]">
                    <Bike className="w-3.5 h-3.5 text-[#D12F2F]" />
                    <span>Live GPS трекинг курьера</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar & Category Horizontal Scroll */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search input */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="menu-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder', language)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] text-xs sm:text-sm text-neutral-900 dark:text-[#E0E0E0] placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#D12F2F] dark:focus:border-[#D12F2F] shadow-sm transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Quick Dietary Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setFilterChefPickOnly(!filterChefPickOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      filterChefPickOnly
                        ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                        : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#AAAAAA] border border-neutral-200 dark:border-[#222222] hover:border-neutral-300 dark:hover:border-[#333333]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('badgeChefPick', language)}</span>
                  </button>

                  <button
                    onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      filterSpicyOnly
                        ? 'bg-[#D12F2F] text-white shadow-sm font-bold'
                        : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#AAAAAA] border border-neutral-200 dark:border-[#222222] hover:border-neutral-300 dark:hover:border-[#333333]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-[#D12F2F]" />
                    <span>{t('badgeSpicy', language)}</span>
                  </button>

                  <button
                    onClick={() => setFilterVeggieOnly(!filterVeggieOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      filterVeggieOnly
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#AAAAAA] border border-neutral-200 dark:border-[#222222] hover:border-neutral-300 dark:hover:border-[#333333]'
                    }`}
                  >
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{t('badgeVegetarian', language)}</span>
                  </button>
                </div>

              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    id={`category-btn-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-neutral-900 text-white dark:bg-[#1E1E1E] dark:text-white dark:border dark:border-[#3A3A3A] shadow-sm'
                        : 'bg-white dark:bg-[#121212] text-neutral-700 dark:text-[#888888] hover:bg-neutral-100 dark:hover:bg-[#181818] dark:hover:text-[#E0E0E0] border border-neutral-200 dark:border-[#222222]'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name[language] || cat.name.ru}</span>
                    <span className="text-[10px] font-japanese-serif opacity-60">
                      {cat.kanji}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-[#888888]">
                  Найдено блюд: {filteredMenuItems.length}
                </span>
                <span className="text-xs text-[#D12F2F] dark:text-[#FF6B6B] font-semibold font-japanese-serif">
                  新鮮な寿司 (Fresh Sushi)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    id={`menu-card-${item.id}`}
                    className="group bg-white dark:bg-[#121212] rounded-2xl overflow-hidden border border-neutral-200 dark:border-[#1E1E1E] hover:border-neutral-300 dark:hover:border-[#333333] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Image Container with Zoom and Badges */}
                    <div
                      className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950 cursor-pointer"
                      onClick={() => setSelectedDishForModal(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {item.chefPick && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-neutral-950 text-[10px] font-bold shadow-sm">
                            ★ Выбор шефа
                          </span>
                        )}
                        {item.spicy && (
                          <span className="px-2 py-0.5 rounded-md bg-[#D12F2F] text-white text-[10px] font-bold shadow-sm">
                            🌶️ Острое
                          </span>
                        )}
                        {item.vegetarian && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-sm">
                            🌱 Веган
                          </span>
                        )}
                      </div>

                      {/* Weight & Rating Pill */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-white/10">
                          {item.weight} {item.pieces ? `• ${item.pieces} шт.` : ''}
                        </span>
                        <span className="bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-400 border border-white/10 flex items-center gap-1">
                          ★ {item.rating}
                        </span>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h3
                          onClick={() => setSelectedDishForModal(item)}
                          className="font-bold text-sm sm:text-base font-japanese-serif text-neutral-900 dark:text-[#EDEDED] group-hover:text-[#D12F2F] dark:group-hover:text-[#FF6B6B] transition-colors line-clamp-1 cursor-pointer"
                        >
                          {item.name[language]}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-[#888888] line-clamp-2 leading-relaxed">
                          {item.description[language]}
                        </p>
                      </div>

                      {/* Price & Add to Cart Button */}
                      <div className="pt-3 border-t border-neutral-100 dark:border-[#1E1E1E] flex items-center justify-between">
                        <div>
                          <div className="font-display-zen font-bold text-base sm:text-lg text-neutral-900 dark:text-white">
                            {item.price} ₽
                          </div>
                          {item.oldPrice && (
                            <span className="text-[10px] text-neutral-400 dark:text-[#666666] line-through">
                              {item.oldPrice} ₽
                            </span>
                          )}
                        </div>

                        <button
                          id={`add-btn-${item.id}`}
                          onClick={() => handleAddToCart(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-[#EDEDED] dark:text-neutral-950 hover:bg-[#D12F2F] dark:hover:bg-[#D12F2F] dark:hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('addToCart', language)}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB B: LIVE COURIER TRACKING MAP */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-japanese-serif text-neutral-950 dark:text-white">
                  {t('liveTrackingTitle', language)}
                </h1>
                <p className="text-xs text-neutral-500 dark:text-[#888888]">
                  Интерактивная карта доставки с обновлением координат каждые 2 секунды
                </p>
              </div>
            </div>

            {currentActiveOrder ? (
              <CourierTrackingMap
                order={currentActiveOrder}
                language={language}
                onOpenChat={() => setIsChatOpen(true)}
                onCallCourier={() => {
                  setIsCallingCourier(true);
                  setIsChatOpen(true);
                }}
                onStatusChange={handleOrderStatusChange}
                onOpenReview={(ord) => setReviewOrderTarget(ord)}
              />
            ) : (
              <div className="bg-white dark:bg-[#121212] rounded-2xl p-12 text-center border border-neutral-200 dark:border-[#222222] space-y-3">
                <span className="text-4xl">🛵</span>
                <h3 className="font-bold text-base font-japanese-serif text-neutral-950 dark:text-white">
                  Нет активных доставок в данный момент
                </h3>
                <p className="text-xs text-neutral-500 dark:text-[#888888] max-w-sm mx-auto">
                  Сделайте заказ в меню, чтобы наблюдать за перемещением курьера на карте в реальном времени!
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  className="px-5 py-2.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Перейти в меню
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB C: SAKURA CLUB LOYALTY */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            {user ? (
              <UserCabinet
                user={user}
                orders={orders}
                language={language}
                onUpdateUser={setUser}
                onRepeatOrder={(ord) => {
                  setCart(ord.items);
                  setIsCartOpen(true);
                }}
                onOpenReview={(ord) => setReviewOrderTarget(ord)}
                onTrackOrder={(ord) => {
                  setActiveOrderId(ord.id);
                  setActiveTab('track');
                }}
              />
            ) : (
              <div className="bg-white dark:bg-[#121212] rounded-2xl p-12 text-center border border-neutral-200 dark:border-[#222222] space-y-4">
                <span className="text-5xl">🌸</span>
                <h2 className="text-xl font-bold font-japanese-serif text-neutral-950 dark:text-white">
                  Программа лояльности «Сакура Club»
                </h2>
                <p className="text-xs text-neutral-500 dark:text-[#888888] max-w-md mx-auto">
                  Войдите в личный кабинет, чтобы копить до 15% кешбэка баллами, оплачивать ими заказы и привязывать банковские карты.
                </p>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-[#D12F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-colors"
                >
                  Войти в профиль
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB D: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <ReviewsList reviews={reviews} language={language} />
          </div>
        )}

        {/* TAB E: ORDERS HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {user ? (
              <UserCabinet
                user={user}
                orders={orders}
                language={language}
                onUpdateUser={setUser}
                onRepeatOrder={(ord) => {
                  setCart(ord.items);
                  setIsCartOpen(true);
                }}
                onOpenReview={(ord) => setReviewOrderTarget(ord)}
                onTrackOrder={(ord) => {
                  setActiveOrderId(ord.id);
                  setActiveTab('track');
                }}
              />
            ) : (
              <div className="bg-white dark:bg-[#121212] rounded-2xl p-12 text-center border border-neutral-200 dark:border-[#222222] space-y-3">
                <p className="text-sm font-semibold text-neutral-900 dark:text-[#E0E0E0]">Войдите, чтобы просмотреть историю ваших заказов</p>
                <button onClick={() => setIsAuthOpen(true)} className="px-4 py-2 bg-[#D12F2F] hover:bg-[#B71C1C] text-white rounded-xl text-xs font-bold transition-colors">
                  Войти
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB F: PROFILE */}
        {activeTab === 'profile' && user && (
          <UserCabinet
            user={user}
            orders={orders}
            language={language}
            onUpdateUser={setUser}
            onRepeatOrder={(ord) => {
              setCart(ord.items);
              setIsCartOpen(true);
            }}
            onOpenReview={(ord) => setReviewOrderTarget(ord)}
            onTrackOrder={(ord) => {
              setActiveOrderId(ord.id);
              setActiveTab('track');
            }}
          />
        )}

      </main>

      {/* 4. MODALS & POPUPS */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        language={language}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        user={user}
        language={language}
        onPlaceOrder={handlePlaceOrder}
        onAddAddress={(addr) => {
          if (user) {
            setUser({
              ...user,
              addresses: [...user.addresses, addr],
            });
          }
        }}
      />

      {/* Courier Direct Chat & Call Modal */}
      {currentActiveOrder && currentActiveOrder.courier && (
        <CourierChatModal
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setIsCallingCourier(false);
          }}
          courier={currentActiveOrder.courier}
          messages={currentActiveOrder.chatMessages}
          onSendMessage={handleSendChatMessage}
          language={language}
          isCalling={isCallingCourier}
          onStartCall={() => setIsCallingCourier(true)}
          onEndCall={() => setIsCallingCourier(false)}
        />
      )}

      {/* Dish Details Modal */}
      <ItemDetailModal
        item={selectedDishForModal}
        isOpen={!!selectedDishForModal}
        onClose={() => setSelectedDishForModal(null)}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {/* Order Rating & Review Modal */}
      {reviewOrderTarget && (
        <OrderReviewModal
          isOpen={!!reviewOrderTarget}
          onClose={() => setReviewOrderTarget(null)}
          order={reviewOrderTarget}
          language={language}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        language={language}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          showToast(`Добро пожаловать, ${loggedUser.name}!`, 'Вы успешно вошли в профиль «Суши Роллы».');
        }}
      />

      {/* Notification Center Popover */}
      <PushNotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        language={language}
        onMarkAllRead={() => {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }}
        onNotificationClick={(notif) => {
          if (notif.orderId) {
            setActiveOrderId(notif.orderId);
            setActiveTab('track');
          }
        }}
      />

    </div>
  );
}
