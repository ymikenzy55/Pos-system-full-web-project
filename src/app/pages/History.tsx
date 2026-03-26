import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Search, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { InvoiceModal } from '../components/pos/InvoiceModal';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';

export const History = () => {
  const { transactions, customers } = useStore();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const customer = customers.find(c => c.id === t.customerId);
      const customerName = customer ? customer.name.toLowerCase() : '';
      const search = searchTerm.toLowerCase();
      
      // Search filter
      const matchesSearch = t.id.toLowerCase().includes(search) || customerName.includes(search);
      
      // Date filter
      let matchesDate = true;
      if (selectedDate) {
        const transactionDate = format(new Date(t.date), 'yyyy-MM-dd');
        matchesDate = transactionDate === selectedDate;
      }
      
      return matchesSearch && matchesDate;
    });
  }, [transactions, customers, searchTerm, selectedDate]);

  // Calculate totals for filtered date
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

  return (
    <div className="p-8 h-screen bg-[#FDFBF7] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5D4037]">Transaction History</h1>
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
              placeholder="Search ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037]" 
            />
          </div>
        </div>
      </div>

      {/* Date Summary */}
      {dateTotals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] border-b border-[#E6E0D4]">
            <tr>
              <th className="p-4 font-medium text-[#8D6E63]">ID</th>
              <th className="p-4 font-medium text-[#8D6E63]">Date</th>
              <th className="p-4 font-medium text-[#8D6E63]">Customer</th>
              <th className="p-4 font-medium text-[#8D6E63]">Items</th>
              <th className="p-4 font-medium text-[#8D6E63]">Payment</th>
              <th className="p-4 font-medium text-[#8D6E63]">Total</th>
              <th className="p-4 font-medium text-[#8D6E63]">Status</th>
              <th className="p-4 font-medium text-[#8D6E63]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => {
              const customer = customers.find(c => c.id === t.customerId);
              return (
                <tr key={t.id} className="border-b border-[#F0EBE0] hover:bg-[#FAFAFA]">
                  <td className="p-4 font-mono text-sm text-[#8D6E63]">#{t.id.slice(0, 6)}</td>
                  <td className="p-4 text-[#3E2723]">{format(new Date(t.date), 'MMM dd, hh:mm a')}</td>
                  <td className="p-4">
                    {customer ? (
                      <div>
                        <p className="font-medium text-[#3E2723]">{customer.name}</p>
                        <p className="text-xs text-[#8D6E63]">{customer.phone}</p>
                      </div>
                    ) : (
                      <span className="text-[#8D6E63] text-sm">Walk-in</span>
                    )}
                  </td>
                  <td className="p-4 text-[#8D6E63]">{t.items.length} items</td>
                  <td className="p-4 text-[#8D6E63] capitalize">{t.paymentMethod}</td>
                  <td className="p-4 font-bold text-[#5D4037]">{formatCurrency(t.total)}</td>
                  <td className="p-4 text-green-600 font-medium capitalize">{t.status}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedTransaction(t)}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-[#5D4037] bg-[#FDFBF7] border border-[#E6E0D4] rounded-lg hover:bg-[#EFEBE0] transition-colors"
                    >
                      <FileText size={16} />
                      Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-[#8D6E63]">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <InvoiceModal 
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
