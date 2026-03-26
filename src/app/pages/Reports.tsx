import React, { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FileChartColumn, TrendingUp, Calendar, Download, DollarSign, ShoppingCart, CreditCard } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/currency';

export const Reports = () => {
  const { currentShop } = useStore();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any>(null);

  // Set default dates (last 30 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  // Load report data when dates change
  useEffect(() => {
    if (startDate && endDate && currentShop) {
      loadReportData();
    }
  }, [startDate, endDate, currentShop]);

  const loadReportData = async () => {
    if (!currentShop) return;
    
    setLoading(true);
    try {
      const response: any = await dashboardAPI.getSalesSummary(currentShop.id, startDate, endDate);
      setReportData(response.data);
    } catch (error: any) {
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#5D4037', '#8D6E63', '#BCAAA4', '#D7CCC8', '#EFEBE0', '#FF8F00', '#4CAF50'];

  if (!reportData && !loading) {
    return (
      <div className="p-8 h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#EFEBE0] rounded-full flex items-center justify-center mb-6">
          <FileChartColumn size={48} className="text-[#8D6E63]" />
        </div>
        <h1 className="text-3xl font-bold text-[#5D4037] mb-2">Loading Reports...</h1>
        <p className="text-[#8D6E63] max-w-md">
          Please wait while we fetch your sales data.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5D4037] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8D6E63]">Loading report data...</p>
        </div>
      </div>
    );
  }

  const { summary, salesByDate, salesByCategory, salesByPaymentMethod, sales } = reportData;

  return (
    <div className="p-4 md:p-8 bg-[#FDFBF7] h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#5D4037] p-2 rounded-lg text-white">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Revenue Reports</h1>
            <p className="text-[#8D6E63] text-sm">Track sales performance and revenue trends</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#E6E0D4] shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#8D6E63]" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-[#E6E0D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] text-sm"
            />
          </div>
          <span className="text-[#8D6E63] self-center">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-[#E6E0D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] text-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#5D4037] to-[#4E342E] p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium uppercase text-xs tracking-wider opacity-90">Total Revenue</h3>
            <DollarSign size={24} className="opacity-75" />
          </div>
          <p className="text-4xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-xs opacity-75 mt-2">{salesByDate.length} days of sales</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#8D6E63] font-medium uppercase text-xs tracking-wider">Total Orders</h3>
            <ShoppingCart size={24} className="text-[#D7CCC8]" />
          </div>
          <p className="text-4xl font-bold text-[#5D4037]">{summary.totalOrders}</p>
          <p className="text-xs text-[#8D6E63] mt-2">
            {sales.length > 0 ? `${(summary.totalOrders / salesByDate.length).toFixed(1)} orders/day` : 'No orders yet'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#8D6E63] font-medium uppercase text-xs tracking-wider">Avg Order Value</h3>
            <CreditCard size={24} className="text-[#D7CCC8]" />
          </div>
          <p className="text-4xl font-bold text-[#5D4037]">{formatCurrency(summary.averageOrderValue)}</p>
          <p className="text-xs text-[#8D6E63] mt-2">Per transaction</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#8D6E63" 
                  tick={{ fill: '#8D6E63', fontSize: 11 }}
                  axisLine={{ stroke: '#E6E0D4' }}
                  tickLine={false}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis 
                  stroke="#8D6E63" 
                  tick={{ fill: '#8D6E63', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₵${value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#5D4037', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E6E0D4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#5D4037" 
                  strokeWidth={3}
                  dot={{ fill: '#5D4037', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Sales by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                  label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#8D6E63', strokeWidth: 1 }}
                >
                  {salesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E6E0D4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Payment Methods</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByPaymentMethod}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
                <XAxis 
                  dataKey="method" 
                  stroke="#8D6E63" 
                  tick={{ fill: '#8D6E63', fontSize: 12 }}
                  axisLine={{ stroke: '#E6E0D4' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#8D6E63" 
                  tick={{ fill: '#8D6E63', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₵${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#FDFBF7' }}
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E6E0D4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${formatCurrency(value)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#5D4037" radius={[8, 8, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Category Performance</h3>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F5F5F5] border-b border-[#E6E0D4]">
                <tr>
                  <th className="text-left p-3 font-medium text-[#8D6E63]">Category</th>
                  <th className="text-right p-3 font-medium text-[#8D6E63]">Qty</th>
                  <th className="text-right p-3 font-medium text-[#8D6E63]">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {salesByCategory.map((cat: any, index: number) => (
                  <tr key={index} className="border-b border-[#F0EBE0] hover:bg-[#FAFAFA]">
                    <td className="p-3 font-medium text-[#3E2723]">{cat.category}</td>
                    <td className="p-3 text-right text-[#8D6E63]">{cat.quantity}</td>
                    <td className="p-3 text-right font-bold text-[#5D4037]">{formatCurrency(cat.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#5D4037]">Recent Transactions</h3>
          <span className="text-sm text-[#8D6E63]">{sales.length} total transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5] border-b border-[#E6E0D4]">
              <tr>
                <th className="text-left p-3 font-medium text-[#8D6E63]">Date</th>
                <th className="text-left p-3 font-medium text-[#8D6E63]">Customer</th>
                <th className="text-left p-3 font-medium text-[#8D6E63]">Items</th>
                <th className="text-left p-3 font-medium text-[#8D6E63]">Payment</th>
                <th className="text-right p-3 font-medium text-[#8D6E63]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map((sale: any) => (
                <tr key={sale.id} className="border-b border-[#F0EBE0] hover:bg-[#FAFAFA]">
                  <td className="p-3 text-[#8D6E63]">{format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}</td>
                  <td className="p-3 font-medium text-[#3E2723]">{sale.customer?.name || 'Walk-in'}</td>
                  <td className="p-3 text-[#8D6E63]">{sale.items.length} items</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-[#FDFBF7] text-[#5D4037] rounded text-xs font-medium border border-[#E6E0D4]">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-[#5D4037]">{formatCurrency(sale.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
