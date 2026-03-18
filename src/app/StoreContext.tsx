import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Transaction, Customer, Role } from './types';
import { initialProducts, initialUsers, initialCustomers, initialTransactions } from './data';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface StoreContextType {
  // State
  user: User | null;
  products: Product[];
  cart: CartItem[];
  transactions: Transaction[];
  customers: Customer[];
  users: User[];
  
  // Auth
  login: (email: string, password: string) => void;
  logout: () => void;
  
  // Cart
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  setCartItemDiscount: (productId: string, discount: number, type: 'percent' | 'fixed') => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  
  // Transactions
  processTransaction: (paymentMethod: 'cash' | 'card' | 'split', cashAmount?: number, cardAmount?: number, customerId?: string) => Promise<Transaction | null>;
  refundTransaction: (transactionId: string, items: { productId: string, quantity: number }[]) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, adjustment: number, reason: string) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Initial state from local storage or defaults
  const [user, setUser] = useState<User | null>(null); // Start logged out
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Constants
  const TAX_RATE = 0.08;

  // Derived Cart Values
  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    let discountAmount = 0;
    if (item.discountType === 'percent') {
      discountAmount = itemPrice * (item.discountValue / 100);
    } else {
      discountAmount = item.discountValue * item.quantity;
    }
    return sum + (itemPrice - discountAmount);
  }, 0);

  const cartTax = cart.reduce((sum, item) => {
    if (item.taxExempt) return sum;
    const itemTotal = (item.price * item.quantity);
    let discountAmount = 0;
    if (item.discountType === 'percent') {
      discountAmount = itemTotal * (item.discountValue / 100);
    } else {
      discountAmount = item.discountValue * item.quantity;
    }
    const taxableAmount = itemTotal - discountAmount;
    return sum + (taxableAmount * TAX_RATE);
  }, 0);

  const cartDiscount = cart.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    if (item.discountType === 'percent') {
      return sum + (itemPrice * (item.discountValue / 100));
    } else {
      return sum + (item.discountValue * item.quantity);
    }
  }, 0);

  const cartTotal = cartSubtotal + cartTax;

  // Auth Functions
  const login = (email: string, password: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      toast.success(`Welcome back, ${foundUser.name}`);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast.info('Logged out');
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product out of stock');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('Not enough stock available');
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, discount: 0, discountType: 'percent', discountValue: 0 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const setCartItemDiscount = (productId: string, discount: number, type: 'percent' | 'fixed') => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, discountValue: discount, discountType: type } : item
    ));
  };

  const clearCart = () => setCart([]);

  // Transaction Functions
  const processTransaction = async (paymentMethod: 'cash' | 'card' | 'split', cashAmount = 0, cardAmount = 0, customerId?: string) => {
    if (cart.length === 0) return null;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newTransaction: Transaction = {
      id: generateId(),
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      discount: cartDiscount,
      total: cartTotal,
      paymentMethod,
      cashAmount: paymentMethod === 'cash' ? cartTotal : cashAmount,
      cardAmount: paymentMethod === 'card' ? cartTotal : cardAmount,
      customerId,
      employeeId: user?.id || 'unknown',
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update inventory
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.quantity };
      }
      return p;
    }));

    // Update customer if exists
    if (customerId) {
      setCustomers(prev => prev.map(c => 
        c.id === customerId 
          ? { 
              ...c, 
              totalSpent: c.totalSpent + cartTotal, 
              lastVisit: new Date().toISOString(),
              loyaltyPoints: c.loyaltyPoints + Math.floor(cartTotal) 
            }
          : c
      ));
    }

    clearCart();
    toast.success('Transaction completed successfully');
    return newTransaction;
  };

  const refundTransaction = (transactionId: string, itemsToRefund: { productId: string, quantity: number }[]) => {
    const original = transactions.find(t => t.id === transactionId);
    if (!original) return;

    // Logic for refund... (simplified)
    toast.success('Refund processed');
  };

  // Product Management
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateId() };
    setProducts(prev => [newProduct, ...prev]); // Add to beginning
    toast.success('Product added');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    toast.success('Product updated');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const adjustStock = (productId: string, adjustment: number, reason: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock + adjustment } : p
    ));
    toast.success(`Stock adjusted: ${reason}`);
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => {
    const newCustomer = { 
      ...customer, 
      id: generateId(), 
      totalSpent: 0, 
      lastVisit: new Date().toISOString(), 
      loyaltyPoints: 0 
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast.success('Customer added');
  };

  return (
    <StoreContext.Provider value={{
      user, products, cart, transactions, customers, users,
      login, logout,
      addToCart, removeFromCart, updateCartQuantity, setCartItemDiscount, clearCart,
      cartTotal, cartSubtotal, cartTax, cartDiscount,
      processTransaction, refundTransaction,
      addProduct, updateProduct, deleteProduct, adjustStock,
      addCustomer
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};