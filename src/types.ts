export type Language = 'ru' | 'ja' | 'en' | 'kk';
export type Theme = 'dark' | 'light';

export type CategoryId = 'all' | 'rolls' | 'sets' | 'nigiri' | 'sashimi' | 'wok_soups' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: CategoryId;
  price: number;
  oldPrice?: number;
  weight: string;
  calories: number;
  pieces?: number;
  image: string;
  spicy?: boolean;
  vegetarian?: boolean;
  chefPick?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  ingredients: Record<Language, string[]>;
}

export interface CartItem {
  id: string; // unique cart entry id
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: {
    extraWasabi?: boolean;
    extraGinger?: boolean;
    chopsticks?: number;
    specialInstructions?: string;
  };
}

export type PaymentMethodType = 'card' | 'saved_card' | 'sbp' | 'apple_google_pay' | 'cash' | 'points';

export interface SavedCard {
  id: string;
  numberMasked: string; // e.g. "•••• 4242"
  expiryDate: string;
  brand: 'visa' | 'mastercard' | 'mir' | 'jcb';
  holderName: string;
  isDefault: boolean;
  colorScheme: 'onyx' | 'ruby' | 'emerald' | 'gold';
}

export interface Address {
  id: string;
  title: string; // e.g. "Дом", "Офис", "Квартира"
  city: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  comment?: string;
  isDefault: boolean;
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyInfo {
  tier: LoyaltyTier;
  cashbackPercent: number;
  currentPoints: number;
  nextTierPointsNeeded: number;
  totalPointsEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  provider?: 'phone' | 'google' | 'telegram' | 'vk' | 'apple';
  bonusPoints: number;
  tier: LoyaltyTier;
  savedCards: SavedCard[];
  addresses: Address[];
  totalOrdersCount: number;
  totalSpent: number;
  referralCode: string;
}

export type OrderStatus =
  | 'created'
  | 'cooking'
  | 'ready'
  | 'on_the_way'
  | 'arrived'
  | 'delivered'
  | 'cancelled';

export interface CourierInfo {
  id: string;
  name: string;
  phone: string;
  photo: string;
  vehicle: 'scooter' | 'bicycle' | 'car';
  vehicleNumber?: string;
  rating: number;
  totalDeliveries: number;
  currentLocation: {
    lat: number;
    lng: number;
    progress: number; // 0 to 1 along route
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'courier' | 'system';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface OrderReview {
  id: string;
  orderId: string;
  orderNumber: string;
  rating: number;
  foodRating: number;
  deliveryRating: number;
  tags: string[];
  comment: string;
  userName: string;
  userAvatar?: string;
  date: string;
  replyFromChef?: string;
}

export type Review = OrderReview;

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  bonusUsed: number;
  bonusEarned: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    description: Record<Language, string>;
  }[];
  estimatedMinutesLeft: number;
  courier?: CourierInfo;
  deliveryAddress: Address;
  paymentMethod: PaymentMethodType;
  selectedCardId?: string;
  paymentStatus: 'paid' | 'pending' | 'cash_on_delivery';
  chatMessages: ChatMessage[];
  review?: OrderReview;
  chopsticksCount: number;
  needCall: boolean;
  orderComment?: string;
}

export interface PushNotificationItem {
  id: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  timestamp: string;
  type: 'order_status' | 'loyalty' | 'promo' | 'chat';
  isRead: boolean;
  orderId?: string;
}
