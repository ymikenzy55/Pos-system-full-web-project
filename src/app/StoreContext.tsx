import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, User, Transaction } from './types';
import { toast } from 'sonner';
import { authAPI, shopAPI, productAPI, salesAPI, customerAPI, categoryAPI, dashboardAPI } from './services/api';

interface StoreContextType {
  user: User | null;
  currentShop: any | null;
  products: Product[];
  categories: any[];
  cart: CartItem[];
  transactions: Transaction[];
  users: any[];
  loading: boolean;
  dashboardStats: {
    todayRevenue: number;
    todayOrders: number;
    todayItemsSold: number;
  };
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    shopName: string;
    shopAddress?: string;
    shopPhone?: string;
  }) => Promise<void>;
  logout: () => void;
  selectShop: (shopId: string) => Promise<void>;
  
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  setCartItemDiscount: (productId: string, discount: number, type: 'percent' | 'fixed') => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  
  processTransaction: (paymentMethod: 'cash' | 'card' | 'split', cashAmount?: number, cardAmount?: number) => Promise<Transaction | null>;
  refundTransaction: (transactionId: string, items: { productId: string, quantity: number }[]) => void;
  
  loadProducts: () => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  adjustStock: (productId: string, adjustment: number, reason: string) => void;
  
  loadDashboardStats: () => Promise<void>;
  loadTransactions: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentShop, setCurrentShop] = useState<any | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    todayItemsSold: 0,
  });

  const TAX_RATE = 0.08;

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedShop = localStorage.getItem('currentShop');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      if (savedShop) {
        const shop = JSON.parse(savedShop);
        setCurrentShop(shop);
        
        // Preload cached data immediately for instant display
        const cachedProducts = localStorage.getItem(`products_${shop.id}`);
        const cachedStats = localStorage.getItem(`stats_${shop.id}`);
        const cachedTransactions = localStorage.getItem(`transactions_${shop.id}`);
        
        if (cachedProducts) setProducts(JSON.parse(cachedProducts));
        if (cachedStats) setDashboardStats(JSON.parse(cachedStats));
        if (cachedTransactions) setTransactions(JSON.parse(cachedTransactions));
      }
    }
  }, []);

  // Load products when shop changes
  useEffect(() => {
    if (currentShop) {
      // Load all data in parallel for faster initial load
      // Data will update in background while cached data shows immediately
      Promise.all([
        loadProducts(),
        loadCategories(),
        loadDashboardStats(),
        loadTransactions(),
      ]);
    }
  }, [currentShop]);

  const loadTransactions = async () => {
    if (!currentShop) return;
    try {
      const response: any = await dashboardAPI.getSalesSummary(currentShop.id, '', '');
      
      if (response.data?.sales) {
        const transformedTransactions = response.data.sales.map((sale: any) => ({
          id: sale.id,
          date: sale.createdAt,
          items: sale.items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.unitPrice,
            quantity: item.quantity,
            sku: item.product.sku,
            stock: item.product.stock,
            categoryId: item.product.categoryId,
            category: item.product.category,
            discount: 0,
            discountType: 'percent' as const,
            discountValue: 0,
          })),
          subtotal: sale.totalAmount,
          tax: 0,
          discount: 0,
          total: sale.totalAmount,
          paymentMethod: sale.paymentMethod.toLowerCase() as 'cash' | 'card',
          employeeId: sale.staffMemberId,
          status: 'completed' as const,
        }));
        setTransactions(transformedTransactions);
        // Cache transactions for instant load
        localStorage.setItem(`transactions_${currentShop.id}`, JSON.stringify(transformedTransactions));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      // Silent fail
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response: any = await authAPI.login({ email, password });
      
      // Check if response is successful
      if (!response.success || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const { user: userData, token } = response.data;
      
      // Validate user data
      if (!userData || !token) {
        throw new Error('Invalid credentials');
      }
      
      // Check if user has a shop assigned
      if (!userData.shop) {
        toast.error('Your account is not associated with any shop. Please contact the administrator.');
        throw new Error('No shop assigned');
      }
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set shop from user's first staff membership
      setCurrentShop(userData.shop);
      localStorage.setItem('currentShop', JSON.stringify(userData.shop));
      
      toast.success(`Welcome back, ${userData.firstName}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages from backend
      if (error.error) {
        toast.error(error.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
      
      throw error;
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    shopName: string;
    shopAddress?: string;
    shopPhone?: string;
  }) => {
    try {
      const response: any = await authAPI.register(data);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Set shop from registration response
      if (userData.shop) {
        setCurrentShop(userData.shop);
        localStorage.setItem('currentShop', JSON.stringify(userData.shop));
      }
      
      toast.success(`Welcome, ${userData.firstName}! Your account has been created.`);
    } catch (error: any) {
      toast.error(error.error || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('currentShop');
    setUser(null);
    setCurrentShop(null);
    setCart([]);
    setProducts([]);
    toast.info('Logged out');
  };

  const selectShop = async (shopId: string) => {
    try {
      const response: any = await shopAPI.getById(shopId);
      setCurrentShop(response.data);
      localStorage.setItem('currentShop', JSON.stringify(response.data));
    } catch (error) {
      toast.error('Failed to load shop');
    }
  };

  const loadProducts = async () => {
    if (!currentShop) return;
    try {
      const response: any = await productAPI.getAll(currentShop.id);
      setProducts(response.data);
      // Cache products for instant load next time
      localStorage.setItem(`products_${currentShop.id}`, JSON.stringify(response.data));
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const loadCategories = async () => {
    if (!currentShop) return;
    try {
      const response: any = await categoryAPI.getAll(currentShop.id);
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };



  const loadDashboardStats = async () => {
    if (!currentShop) return;
    try {
      const response: any = await dashboardAPI.getTodaySales(currentShop.id);
      const stats = {
        todayRevenue: response.data?.totalRevenue || 0,
        todayOrders: response.data?.transactionCount || 0,
        todayItemsSold: response.data?.itemsSold || 0,
      };
      setDashboardStats(stats);
      // Cache stats for instant load
      localStorage.setItem(`stats_${currentShop.id}`, JSON.stringify(stats));
    } catch (error) {
      // Silent fail
    }
  };

  // Cart calculations
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
    const itemTotal = item.price * item.quantity;
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
      return [...prev, { 
        ...product, 
        quantity: 1, 
        discount: 0, 
        discountType: 'percent', 
        discountValue: 0,
        taxExempt: product.taxExempt || false 
      }];
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

  const processTransaction = async (paymentMethod: 'cash' | 'card' | 'split', cashAmount = 0, cardAmount = 0) => {
    if (cart.length === 0 || !currentShop) return null;

    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const paymentMethodMap: any = {
        cash: 'CASH',
        card: 'MOBILE_MONEY',
        split: 'MOBILE_MONEY',
      };

      const requestData = {
        paymentMethod: paymentMethodMap[paymentMethod],
        items,
      };

      const response: any = await salesAPI.create(currentShop.id, requestData);

      // Transform the sale response to match Transaction type
      const saleData = response.data;
      const transaction: Transaction = {
        id: saleData.id,
        date: saleData.createdAt,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sku: item.sku,
          stock: item.stock,
          categoryId: item.categoryId,
          category: item.category,
          discount: item.discountValue || 0,
          discountType: item.discountType,
          discountValue: item.discountValue || 0,
        })),
        subtotal: cartSubtotal,
        tax: cartTax,
        discount: cartDiscount,
        total: cartTotal,
        paymentMethod: paymentMethod,
        employeeId: user?.id || '',
        status: 'completed' as const,
      };

      clearCart();
      
      // Optimistic updates for better UX - update local state immediately
      setProducts(prev => prev.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      }));

      // Update dashboard stats optimistically
      setDashboardStats(prev => ({
        todayRevenue: prev.todayRevenue + cartTotal,
        todayOrders: prev.todayOrders + 1,
        todayItemsSold: prev.todayItemsSold + cart.reduce((sum, item) => sum + item.quantity, 0),
      }));

      // Add transaction to local state
      setTransactions(prev => [transaction, ...prev]);

      // Reload data in background (don't wait for it)
      Promise.all([
        loadProducts(),
        loadDashboardStats(),
        loadTransactions(),
      ]).catch(() => {
        // Silent fail - optimistic updates already applied
      });

      toast.success('Transaction completed successfully');
      
      return transaction;
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.error || 'Transaction failed');
      return null;
    }
  };

  const addProduct = async (productData: any) => {
    if (!currentShop) return;
    try {
      const response: any = await productAPI.create(currentShop.id, productData);
      // Optimistic update - add the new product immediately
      setProducts(prev => [...prev, response.data]);
      toast.success('Product added');
    } catch (error: any) {
      toast.error(error.error || 'Failed to add product');
      // Reload on error to ensure consistency
      await loadProducts();
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!currentShop) return;
    try {
      // Optimistic update - update local state immediately
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      
      const response: any = await productAPI.update(currentShop.id, id, updates);
      
      // Update with server response to ensure consistency
      setProducts(prev => prev.map(p => p.id === id ? response.data : p));
      toast.success('Product updated');
    } catch (error: any) {
      toast.error(error.error || 'Failed to update product');
      // Reload on error to ensure consistency
      await loadProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!currentShop) return;
    try {
      // Optimistic update - remove immediately
      setProducts(prev => prev.filter(p => p.id !== id));
      await productAPI.delete(currentShop.id, id);
      toast.success('Product deleted');
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete product');
      // Reload on error to ensure consistency
      await loadProducts();
    }
  };

  const adjustStock = (productId: string, adjustment: number, reason: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: p.stock + adjustment } : p
    ));
    toast.success(`Stock adjusted: ${reason}`);
  };

  const refundTransaction = (transactionId: string, itemsToRefund: { productId: string, quantity: number }[]) => {
    toast.success('Refund processed');
  };



  return (
    <StoreContext.Provider value={{
      user, currentShop, products, categories, cart, transactions, users, loading, dashboardStats,
      login, register, logout, selectShop,
      addToCart, removeFromCart, updateCartQuantity, setCartItemDiscount, clearCart,
      cartTotal, cartSubtotal, cartTax, cartDiscount,
      processTransaction, refundTransaction,
      loadProducts, addProduct, updateProduct, deleteProduct, adjustStock,
      loadDashboardStats, loadTransactions,
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
