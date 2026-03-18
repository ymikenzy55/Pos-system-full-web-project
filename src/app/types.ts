export type Role = 'admin' | 'manager' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  description?: string;
  taxExempt: boolean;
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
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit: string;
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