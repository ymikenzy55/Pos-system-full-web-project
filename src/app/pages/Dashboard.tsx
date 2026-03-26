import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { dashboardAPI } from '../services/api';
import { TrendingUp, Coins, ShoppingCart, Package, AlertTriangle, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps = {}) => {
  const { currentShop, transactions, products, dashboardStats } = useStore();
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);

  // Calculate low stock from products immediately (no API call needed)
  const lowStockProducts = useMemo(() => 
    products.filter(p => p.stock <= (p.lowStockThreshold || 10)).slice(0, 5),
    [products]
  );

  useEffect(() => {
    if (currentShop) {
      // Set low stock immediately from local data
      setLowStock(lowStockProducts);
      
      // Load top products in background (only data we don't have locally)
      loadTopProducts();
    }
  }, [currentShop, lowStockProducts]);

  const loadTopProducts = async () => {
    if (!currentShop) return;
    
    try {
      const shopId = currentShop.id || currentShop.shop?.id;
      const topResponse = await dashboardAPI.getTopProducts(shopId, 5);
      setTopProducts((topResponse as any).data);
    } catch (error) {
      // Silent fail - not critical
    }
  };

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="h-screen overflow-y-auto bg-[#FDFBF7] p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="bg-[#5D4037] p-2 rounded-lg text-white">
          <TrendingUp size={20} className="md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Dashboard</h1>
          <p className="text-xs md:text-sm text-[#8D6E63]">Today's Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <button 
          onClick={() => onNavigate?.('reports')}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-all text-left hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#8D6E63] font-medium text-xs md:text-sm">Today's Revenue</h3>
            <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
              <Coins size={16} className="text-green-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[#5D4037]">{formatCurrency(dashboardStats.todayRevenue)}</p>
          <p className="text-xs text-[#8D6E63] mt-1">{dashboardStats.todayOrders} orders • Click for detailed reports</p>
        </button>

        <button 
          onClick={() => onNavigate?.('sales')}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-all text-left hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#8D6E63] font-medium text-xs md:text-sm">Orders Today</h3>
            <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg">
              <ShoppingCart size={16} className="text-blue-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[#5D4037]">{dashboardStats.todayOrders}</p>
          <p className="text-xs text-[#8D6E63] mt-1">{dashboardStats.todayItemsSold} items sold</p>
        </button>

        <button 
          onClick={() => onNavigate?.('inventory')}
          className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4] hover:shadow-md transition-all text-left hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[#8D6E63] font-medium text-xs md:text-sm">Total Products</h3>
            <div className="bg-purple-100 p-1.5 md:p-2 rounded-lg">
              <Package size={16} className="text-purple-600 md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-xl md:text-3xl font-bold text-[#5D4037]">{products.length}</p>
          <p className="text-xs text-[#8D6E63] mt-1">{lowStock.length} low stock</p>
        </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <h3 className="text-base md:text-lg font-bold text-[#5D4037] mb-4">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-[#8D6E63] text-center py-8">No sales yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((item, index) => (
                <div key={item.product?.id || index} className="flex items-center gap-3 p-3 rounded-lg bg-[#FDFBF7] hover:bg-[#F5F1E8] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#5D4037] text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#3E2723]">{item.product?.name || 'Unknown'}</p>
                    <p className="text-xs text-[#8D6E63]">{item.quantitySold || 0} units sold</p>
                  </div>
                  <p className="font-bold text-[#5D4037]">{formatCurrency(item.totalRevenue || 0)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-orange-500 md:w-5 md:h-5" />
            <h3 className="text-base md:text-lg font-bold text-[#5D4037]">Low Stock Alert</h3>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-[#8D6E63] text-center py-8">All products well stocked</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {lowStock.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div>
                    <p className="font-semibold text-[#3E2723]">{product.name}</p>
                    <p className="text-xs text-[#8D6E63]">{product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{product.stock} left</p>
                    <p className="text-xs text-[#8D6E63]">Restock needed</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-[#5D4037] md:w-5 md:h-5" />
          <h3 className="text-base md:text-lg font-bold text-[#5D4037]">Recent Transactions</h3>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="text-[#8D6E63] text-center py-8">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-[#E6E0D4]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#5D4037]">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#5D4037]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#5D4037]">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#5D4037]">Payment</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#5D4037]">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-[#F5F1E8] hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 px-4 text-sm text-[#3E2723] font-mono">#{transaction.id.slice(0, 6)}</td>
                    <td className="py-3 px-4 text-sm text-[#8D6E63]">
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8D6E63]">
                      {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#5D4037] text-white uppercase">
                        {transaction.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#5D4037]">
                      {formatCurrency(transaction.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
