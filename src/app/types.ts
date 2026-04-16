export type Role = 'ADMIN' | 'MANAGER' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  active?: boolean;
  firstName?: string;
  lastName?: string;
  shop?: any;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice?: number;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  categoryId?: string;
  stock: number;
  image?: string;
  barcode?: string;
  description?: string;
  taxExempt?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  discount: number; // Percentage or fixed amount? Let's assume percentage for simplicity or handle both. Let's do percentage for now.
  discountType: 'percent' | 'fixed';
  discountValue: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  lastPurchaseDate?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'split';
  cashAmount?: number;
  cardAmount?: number;
  customerId?: string;
  employeeId: string;
  status: 'completed' | 'refunded';
  originalTransactionId?: string; // For refunds
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  adjustment: number;
  reason: string;
  date: string;
  userId: string;
}