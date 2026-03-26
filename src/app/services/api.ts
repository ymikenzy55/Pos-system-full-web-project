import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only logout on actual authentication failures, not network errors
    if (error.response?.status === 401 && error.response?.data?.error) {
      // Check if it's a real auth error, not just a network issue
      const errorMessage = error.response.data.error.toLowerCase();
      if (errorMessage.includes('token') || errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('currentShop');
        window.location.href = '/';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string;
    shopName: string;
    shopAddress?: string;
    shopPhone?: string;
  }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Shop APIs
export const shopAPI = {
  create: (data: { name: string; address: string; phone: string }) =>
    api.post('/shops', data),
  
  getMyShops: () =>
    api.get('/shops/myshops'),
  
  getById: (shopId: string) =>
    api.get(`/shops/${shopId}`),
  
  update: (shopId: string, data: { name?: string; address?: string; phone?: string }) =>
    api.patch(`/shops/${shopId}`, data),
};

// Staff APIs
export const staffAPI = {
  create: (shopId: string, data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    role: string 
  }) =>
    api.post(`/shops/${shopId}/staff/create`, data),
  
  add: (shopId: string, data: { userId: string; role: string }) =>
    api.post(`/shops/${shopId}/staff`, data),
  
  getAll: (shopId: string) =>
    api.get(`/shops/${shopId}/staff`),
  
  getById: (shopId: string, staffId: string) =>
    api.get(`/shops/${shopId}/staff/${staffId}`),
  
  updateRole: (shopId: string, staffId: string, role: string) =>
    api.patch(`/shops/${shopId}/staff/${staffId}/role`, { role }),
  
  updateStatus: (shopId: string, staffId: string, isActive: boolean) =>
    api.patch(`/shops/${shopId}/staff/${staffId}/status`, { isActive }),
  
  delete: (shopId: string, staffId: string) =>
    api.delete(`/shops/${shopId}/staff/${staffId}`),
};

// Category APIs
export const categoryAPI = {
  create: (shopId: string, data: { name: string; description?: string }) =>
    api.post(`/shops/${shopId}/categories`, data),
  
  getAll: (shopId: string) =>
    api.get(`/shops/${shopId}/categories`),
  
  delete: (shopId: string, categoryId: string) =>
    api.delete(`/shops/${shopId}/categories/${categoryId}`),
};

// Product APIs
export const productAPI = {
  create: (shopId: string, data: {
    name: string;
    sku: string;
    barcode?: string;
    price: number;
    costPrice: number;
    categoryId: string;
    stock?: number;
    image?: string;
  }) =>
    api.post(`/shops/${shopId}/products`, data),
  
  getAll: (shopId: string) =>
    api.get(`/shops/${shopId}/products`),
  
  getById: (shopId: string, productId: string) =>
    api.get(`/shops/${shopId}/products/${productId}`),
  
  update: (shopId: string, productId: string, data: any) =>
    api.patch(`/shops/${shopId}/products/${productId}`, data),
  
  delete: (shopId: string, productId: string) =>
    api.delete(`/shops/${shopId}/products/${productId}`),
};

// Inventory APIs
export const inventoryAPI = {
  restock: (shopId: string, data: { productId: string; quantity: number; note?: string }) =>
    api.post(`/shops/${shopId}/inventory/restock`, data, {
      headers: { 'idempotency-key': `restock-${Date.now()}-${Math.random()}` }
    }),
  
  adjust: (shopId: string, data: { productId: string; quantity: number; reason: string }) =>
    api.post(`/shops/${shopId}/inventory/adjust`, data, {
      headers: { 'idempotency-key': `adjust-${Date.now()}-${Math.random()}` }
    }),
};

// Sales APIs
export const salesAPI = {
  create: (shopId: string, data: {
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY';
    items: { productId: string; quantity: number }[];
  }) => {
    return api.post(`/shops/${shopId}/sales`, data, {
      headers: { 
        'idempotency-key': `sale-${Date.now()}-${Math.random()}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  getById: (shopId: string, saleId: string) =>
    api.get(`/shops/${shopId}/sales/${saleId}`),
};

// Refund APIs
export const refundAPI = {
  create: (shopId: string, data: {
    saleId: string;
    reason: string;
    items: { productId: string; quantity: number }[];
  }) =>
    api.post(`/shops/${shopId}/refunds`, data, {
      headers: { 'idempotency-key': `refund-${Date.now()}-${Math.random()}` }
    }),
};

// Stock Movement APIs
export const stockMovementAPI = {
  getAll: (shopId: string, limit = 20, cursor?: string) =>
    api.get(`/shops/${shopId}/stock-movements`, { params: { limit, cursor } }),
  
  getByProduct: (shopId: string, productId: string) =>
    api.get(`/shops/${shopId}/stock-movements/${productId}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getTodaySales: (shopId: string) =>
    api.get(`/shops/${shopId}/dashboard/today-sales`),
  
  getTopProducts: (shopId: string, limit = 10) =>
    api.get(`/shops/${shopId}/dashboard/top-products`, { params: { limit } }),
  
  getSalesSummary: (shopId: string, startDate: string, endDate: string) =>
    api.get(`/shops/${shopId}/dashboard/sales-summary`, { params: { startDate, endDate } }),
  
  getLowStock: (shopId: string) =>
    api.get(`/shops/${shopId}/dashboard/low-stock`),
};

// Customer APIs
export const customerAPI = {
  create: (shopId: string, data: { name: string; phone: string }) =>
    api.post(`/shops/${shopId}/customers`, data),
  
  getAll: (shopId: string) =>
    api.get(`/shops/${shopId}/customers`),
  
  getById: (shopId: string, customerId: string) =>
    api.get(`/shops/${shopId}/customers/${customerId}`),
  
  delete: (shopId: string, customerId: string) =>
    api.delete(`/shops/${shopId}/customers/${customerId}`),
};

export default api;
