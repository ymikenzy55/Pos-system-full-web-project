import { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Search, FileText, Calendar, ChevronDown, ChevronUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { format } from 'date-fns';
import { InvoiceModal } from '../components/pos/InvoiceModal';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

export const Sales = () => {
  const { transactions } = useStore();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = t.id.toLowerCase().includes(search);
      
      let matchesDate = true;
      if (selectedDate) {
        const transactionDate = format(new Date(t.date), 'yyyy-MM-dd');
        matchesDate = transactionDate === selectedDate;
      }
      
      return matchesSearch && matchesDate;
    });
  }, [transactions, searchTerm, selectedDate]);

  // Calculate totals for filtered transactions
  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => ({
      revenue: acc.revenue + transaction.total,
      orders: acc.orders + 1,
      items: acc.items + transaction.items.reduce((sum, item) => sum + item.quantity, 0)
    }), { revenue: 0, orders: 0, items: 0 });
  }, [filteredTransactions]);

  const dateTotals = useMemo(() => {
    if (!selectedDate) return null;
    
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalItemsSold = filteredTransactions.reduce((sum, t) => 
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    
    return {
      revenue: totalRevenue,
      itemsSold: totalItemsSold,
      orders: filteredTransactions.length
    };
  }, [filteredTransactions, selectedDate]);

  const toggleExpand = (saleId: string) => {
    setExpandedSaleId(expandedSaleId === saleId ? null : saleId);
  };

  return (
    <div className="p-8 h-screen bg-[#FDFBF7] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5D4037]">Sales History</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]" 
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Sale ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]" 
            />
          </div>
        </div>
      </div>

      {/* Summary Cards - Always Show */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#8D6E63] font-medium">Total Revenue</p>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#5D4037]">{formatCurrency(totals.revenue)}</p>
          <p className="text-xs text-[#8D6E63] mt-1">
            {selectedDate ? `For ${format(new Date(selectedDate), 'MMM dd, yyyy')}` : 'All time'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#8D6E63] font-medium">Total Orders</p>
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#5D4037]">{totals.orders}</p>
          <p className="text-xs text-[#8D6E63] mt-1">
            {totals.orders > 0 ? `Avg: ${formatCurrency(totals.revenue / totals.orders)}` : 'No orders'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[#8D6E63] font-medium">Items Sold</p>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Package size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#5D4037]">{totals.items}</p>
          <p className="text-xs text-[#8D6E63] mt-1">
            {totals.orders > 0 ? `${(totals.items / totals.orders).toFixed(1)} items/order` : 'No items'}
          </p>
        </div>
      </div>

      {dateTotals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" style={{display: 'none'}}>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D4]">
            <p className="text-sm text-[#8D6E63] mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#5D4037]">{formatCurrency(dateTotals.revenue)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D4]">
            <p className="text-sm text-[#8D6E63] mb-1">Items Sold</p>
            <p className="text-2xl font-bold text-[#5D4037]">{dateTotals.itemsSold}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E6E0D4]">
            <p className="text-sm text-[#8D6E63] mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-[#5D4037]">{dateTotals.orders}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4] overflow-hidden">
        <div className="space-y-2 p-4">
          {filteredTransactions.map(t => (
            <div key={t.id} className="border border-[#E6E0D4] rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 hover:bg-[#FAFAFA] cursor-pointer"
                onClick={() => toggleExpand(t.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-[#8D6E63]">#{t.id.slice(0, 8)}</p>
                    <p className="text-sm text-[#8D6E63]">{format(new Date(t.date), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#8D6E63]">Items</p>
                    <p className="font-semibold text-[#3E2723]">{t.items.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#8D6E63]">Payment</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#5D4037] text-white uppercase">
                      {t.paymentMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#8D6E63]">Total</p>
                    <p className="font-bold text-[#5D4037]">{formatCurrency(t.total)}</p>
                  </div>
                </div>
                <div className="ml-4">
                  {expandedSaleId === t.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {expandedSaleId === t.id && (
                <div className="border-t border-[#E6E0D4] bg-[#FDFBF7] p-4">
                  <h4 className="font-semibold text-[#5D4037] mb-3">Items Purchased</h4>
                  <div className="space-y-2">
                    {t.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-white rounded">
                        <div>
                          <p className="font-medium text-[#3E2723]">{item.name}</p>
                          <p className="text-xs text-[#8D6E63]">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#8D6E63]">Qty: {item.quantity}</p>
                          <p className="font-semibold text-[#5D4037]">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(t);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#5D4037] rounded-lg hover:bg-[#4E342E] transition-colors"
                    >
                      <FileText size={16} />
                      View Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-[#8D6E63]">
              <p>No sales found</p>
            </div>
          )}
        </div>
      </div>

      <InvoiceModal 
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
