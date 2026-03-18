import { Product, User, Customer, Transaction } from './types';

// Images from Unsplash
const COFFEE_IMG = "https://images.unsplash.com/photo-1604298458655-ae6e04213678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwY29mZmVlJTIwbGF0dGUlMjBjdXAlMjBwYXN0cnklMjBjYWtlJTIwc2FuZHdpY2glMjBqdWljZSUyMGJvdHRsZSUyMHNtb290aGllfGVufDF8fHx8MTc3MTI5MTcwOXww&ixlib=rb-4.1.0&q=80&w=1080";
const PASTRY_IMG = "https://images.unsplash.com/photo-1649542181703-33cc4f373b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0cnklMjBjcm9pc3NhbnQlMjBmb29kfGVufDF8fHx8MTc3MTI5MTcxNXww&ixlib=rb-4.1.0&q=80&w=1080";
const SANDWICH_IMG = "https://images.unsplash.com/photo-1711488735431-ea32225d9790?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGx1bmNoJTIwZm9vZHxlbnwxfHx8fDE3NzEyMjE4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Vanilla Latte',
    sku: 'BV-001',
    price: 4.50,
    category: 'Beverages',
    stock: 120,
    image: COFFEE_IMG,
    description: 'Creamy espresso with steamed milk and vanilla syrup.',
    taxExempt: false,
  },
  {
    id: '2',
    name: 'Croissant',
    sku: 'FD-001',
    price: 3.25,
    category: 'Food',
    stock: 45,
    image: PASTRY_IMG,
    description: 'Buttery, flaky pastry baked fresh daily.',
    taxExempt: false,
  },
  {
    id: '3',
    name: 'Turkey Club',
    sku: 'FD-002',
    price: 8.95,
    category: 'Food',
    stock: 20,
    image: SANDWICH_IMG,
    description: 'Roasted turkey, bacon, lettuce, tomato on sourdough.',
    taxExempt: false,
  },
  {
    id: '4',
    name: 'Iced Tea',
    sku: 'BV-002',
    price: 2.95,
    category: 'Beverages',
    stock: 200,
    image: COFFEE_IMG, 
    description: 'Fresh brewed black tea over ice.',
    taxExempt: false,
  },
  {
    id: '5',
    name: 'Blueberry Muffin',
    sku: 'FD-003',
    price: 3.50,
    category: 'Food',
    stock: 30,
    image: PASTRY_IMG,
    description: 'Moist muffin packed with fresh blueberries.',
    taxExempt: false,
  },
];

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Manager',
    email: 'alice@store.com',
    password: 'manager123',
    role: 'manager',
    active: true,
    avatar: 'https://ui-avatars.com/api/?name=Alice+Manager&background=FDFBF7&color=5D4037',
  },
  {
    id: 'u2',
    name: 'Bob Cashier',
    email: 'bob@store.com',
    password: 'cashier123',
    role: 'cashier',
    active: true,
    avatar: 'https://ui-avatars.com/api/?name=Bob+Cashier&background=FDFBF7&color=5D4037',
  },
  {
    id: 'u3',
    name: 'Charlie Admin',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
    active: true,
    avatar: 'https://ui-avatars.com/api/?name=Charlie+Admin&background=FDFBF7&color=5D4037',
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    loyaltyPoints: 150,
    totalSpent: 450.25,
    lastVisit: '2023-10-15',
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    loyaltyPoints: 45,
    totalSpent: 120.00,
    lastVisit: '2023-11-01',
  }
];

export const initialTransactions: Transaction[] = [];