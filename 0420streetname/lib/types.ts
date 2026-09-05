export type TableSection = 'dining' | 'bar' | 'patio' | 'wine_room' | 'lakewood_room';

export type TableStatus = 'vacant' | 'seated' | 'apps_fired' | 'entrees_fired' | 'dessert' | 'paid';

export interface Table {
  id: string;
  number: string;
  name: string;
  section: TableSection;
  capacity: number;
  status: TableStatus;
  serverName?: string;
  seatedAt?: number;
  guestCount?: number;
  vipNote?: string;
  currentOrderId?: string;
}

export type MenuCategory = 
  | 'apps' 
  | 'salads' 
  | 'sandwiches_pizza' 
  | 'pasta' 
  | 'entrees' 
  | 'sides' 
  | 'wine' 
  | 'cocktails' 
  | 'desserts';

export type KitchenStation = 'grill' | 'saute' | 'pizza' | 'pantry' | 'bar' | 'pastry';

export interface WineDetails {
  vintage: string;
  varietal: string;
  region: string;
  binNumber: string;
  cellarStock: number;
  byTheGlass?: boolean;
  glassPrice?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  station: KitchenStation;
  description: string;
  flags?: ('GF' | 'V' | 'RAW')[];
  courseDefault: 1 | 2 | 3 | 4; // 1: Apps, 2: Salads/Soups, 3: Entrees, 4: Dessert
  wineDetails?: WineDetails;
  popular?: boolean;
}

export type CourseNumber = 1 | 2 | 3 | 4;
export type ItemStatus = 'draft' | 'hold' | 'prep' | 'fire' | 'plated' | 'bumped';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  seatNumber: number | 'shared';
  course: CourseNumber;
  station: KitchenStation;
  mods: string[];
  status: ItemStatus;
  sentAt?: number;
  firedAt?: number;
  platedAt?: number;
}

export interface SplitCheck {
  id: string;
  checkNumber: number;
  seatNumbers: number[];
  itemIds: string[];
  subtotal: number;
  tax: number;
  autoGrat: number;
  total: number;
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'Card' | 'Cash' | 'Corporate Amex' | 'House Account' | 'Apple Pay';
  paidAt?: number;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: string;
  serverName: string;
  guestCount: number;
  items: OrderItem[];
  createdAt: number;
  status: 'open' | 'closed';
  notes?: string;
  splitChecks?: SplitCheck[];
}

export interface EventRoom {
  id: string;
  roomName: string;
  section: TableSection;
  maxCapacity: number;
  fnbMinimum: number;
  depositPaid: number;
  hostName: string;
  hostCompany?: string;
  eventTime: string;
  currentSpend: number;
  contractNotes: string;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: 'SEAT' | 'ORDER_ITEM' | 'REMOVE_ITEM' | 'FIRE_COURSE' | 'SEND_ORDER' | 'BUMP_COURSE' | 'SPLIT_CHECK' | 'SETTLE_CHECK' | 'CLOSE_TABLE' | 'TOGGLE_86' | 'CELLAR_DECREMENT' | 'SYSTEM_RECONCILE';
  tableNumber?: string;
  serverName: string;
  description: string;
  hash: string;
  amount?: number;
  details?: Record<string, any>;
}

