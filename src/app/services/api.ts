import axios from 'axios';

// Base API URL - update this when backend is ready
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
};

// Shop APIs
export const shopAPI = {
  create: (data: { name: string; address: string; phone: string }) =>
    api.post('/', data),
  
  getMyShops: () =>
    api.get('/myshops'),
  
  getById: (shopId: string) =>
    api.get(`/${shopId}`),
  
  update: (shopId: string, data: { name?: string; address?: string }) =>
    api.patch(`/${shopId}`, data),
};

// Staff APIs
export const staffAPI = {
  add: (shopId: string, data: any) =>
    api.post(`/${shopId}/staff`, data),
  
  getAll: (shopId: string) =>
    api.get(`/${shopId}/staff`),
  
  getById: (shopId: string, staffId: string) =>
    api.get(`/${shopId}/staff/${staffId}`),
  
  updateRole: (shopId: string, staffId: string, role: string) =>
    api.patch(`/${shopId}/staff/${staffId}/role`, { role }),
  
  updateStatus: (shopId: string, staffId: string, isActive: boolean) =>
    api.patch(`/${shopId}/staff/${staffId}/status`, { isActive }),
  
  delete: (shopId: string, staffId: string) =>
    api.delete(`/${shopId}/staff/${staffId}`),
};

// Category APIs
export const categoryAPI = {
  create: (shopId: string, data: { name: string; description?: string }) =>
    api.post(`/${shopId}/categories`, data),
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
  }) =>
    api.post(`/${shopId}/products`, data),
  
  getAll: (shopId: string) =>
    api.get(`/${shopId}/products`),
  
  getById: (shopId: string, productId: string) =>
    api.get(`/${shopId}/products/${productId}`),
};

// Inventory APIs
export const inventoryAPI = {
  restock: (shopId: string, data: { productId: string; quantity: number; note?: string }, idempotencyKey: string) =>
    api.post(`/${shopId}/inventory/restock`, data, {
      headers: { 'idempotency-key': idempotencyKey }
    }),
  
  adjust: (shopId: string, data: { productId: string; quantity: number; reason: string }, idempotencyKey: string) =>
    api.post(`/${shopId}/inventory/adjust`, data, {
      headers: { 'idempotency-key': idempotencyKey }
    }),
};

// Sales APIs
export const salesAPI = {
  create: (shopId: string, data: {
    paymentMethod: 'CASH' | 'CARD' | 'MOBILE_MONEY';
    items: { productId: string; quantity: number }[];
  }, idempotencyKey: string) =>
    api.post(`/${shopId}/sales`, data, {
      headers: { 'idempotency-key': idempotencyKey }
    }),
  
  getById: (shopId: string, saleId: string) =>
    api.get(`/${shopId}/sales/${saleId}`),
};

// Refund APIs
export const refundAPI = {
  create: (shopId: string, data: {
    saleId: string;
    reason: string;
    items: { productId: string; quantity: number }[];
  }, idempotencyKey: string) =>
    api.post(`/${shopId}/refunds`, data, {
      headers: { 'idempotency-key': idempotencyKey }
    }),
};

// Stock Movement APIs
export const stockMovementAPI = {
  getAll: (shopId: string, limit = 20, cursor?: string) =>
    api.get(`/${shopId}/stock-movements`, { params: { limit, cursor } }),
  
  getByProduct: (shopId: string, productId: string) =>
    api.get(`/${shopId}/stock-movements/${productId}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getTodaySales: (shopId: string) =>
    api.get(`/${shopId}/dashboard/today-sales`),
  
  getTopProducts: (shopId: string, limit = 10) =>
    api.get(`/${shopId}/dashboard/top-products`, { params: { limit } }),
  
  getSalesSummary: (shopId: string, startDate: string, endDate: string) =>
    api.get(`/${shopId}/dashboard/sales-summary`, { params: { startDate, endDate } }),
  
  getLowStock: (shopId: string) =>
    api.get(`/${shopId}/dashboard/low-stock`),
};

export default api;
