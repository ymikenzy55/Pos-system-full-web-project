import React from 'react';
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
  Cell
} from 'recharts';
import { FileChartColumn, TrendingUp, AlertCircle } from 'lucide-react';

export const Reports = () => {
  const { transactions } = useStore();

  // Calculate stats
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalOrders = transactions.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Prepare chart data
  const salesByDate = transactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
    date,
    amount
  }));

  const salesByCategory = transactions.flatMap(t => t.items).reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.price * item.quantity);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(salesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#5D4037', '#8D6E63', '#BCAAA4', '#D7CCC8', '#EFEBE0'];

  if (transactions.length === 0) {
    return (
      <div className="p-8 h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-[#EFEBE0] rounded-full flex items-center justify-center mb-6">
          <FileChartColumn size={48} className="text-[#8D6E63]" />
        </div>
        <h1 className="text-3xl font-bold text-[#5D4037] mb-2">No Reports Available</h1>
        <p className="text-[#8D6E63] max-w-md">
          Start processing transactions to see sales data, revenue trends, and category performance reports here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FDFBF7] h-screen overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#5D4037] p-2 rounded-lg text-white">
          <TrendingUp size={24} />
        </div>
        <h1 className="text-3xl font-bold text-[#5D4037]">Business Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-shadow">
          <h3 className="text-[#8D6E63] font-medium mb-2 uppercase text-xs tracking-wider">Total Revenue</h3>
          <p className="text-4xl font-bold text-[#5D4037]">GH₵{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-shadow">
          <h3 className="text-[#8D6E63] font-medium mb-2 uppercase text-xs tracking-wider">Total Orders</h3>
          <p className="text-4xl font-bold text-[#5D4037]">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-shadow">
          <h3 className="text-[#8D6E63] font-medium mb-2 uppercase text-xs tracking-wider">Avg Order Value</h3>
          <p className="text-4xl font-bold text-[#5D4037]">GH₵{avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Sales Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
                <XAxis 
                    dataKey="date" 
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
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#FDFBF7' }}
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E6E0D4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#5D4037', fontWeight: 'bold' }}
                />
                <Bar dataKey="amount" fill="#5D4037" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-lg font-bold text-[#5D4037] mb-6">Sales by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
                    itemStyle={{ color: '#5D4037', fontWeight: 'bold' }}
                    formatter={(value: number) => `GH₵${value.toFixed(2)}`}
                />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[#5D4037] font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
