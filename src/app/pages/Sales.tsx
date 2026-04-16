import { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Search, FileText, Calendar, ChevronDown, ChevronUp, Coins, ShoppingCart, Package } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  // Calculate totals for filtered transactions
  const totals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => ({
      revenue: acc.revenue + transaction.total,
      orders: acc.orders + 1,
      items: acc.items + transaction.items.reduce((sum, item) => sum + item.quantity, 0)
    }), { revenue: 0, orders: 0, items: 0 });
  }, [filteredTransactions]);

  const toggleExpand = (saleId: string) => {
    setExpandedSaleId(expandedSaleId === saleId ? null : saleId);
  };

  return (
    <div className="h-screen bg-[#FDFBF7] flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-[#FDFBF7] border-b border-[#E6E0D4] px-4 md:px-8 pt-6 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Sales History</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] w-full sm:w-auto" 
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
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] w-full sm:w-auto" 
              />
            </div>
          </div>
        </div>

        {/* Summary Cards - Fixed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#8D6E63] font-medium">Total Revenue</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <Coins size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-[#5D4037]">{formatCurrency(totals.revenue)}</p>
            <p className="text-xs text-[#8D6E63] mt-1">
              {selectedDate ? `For ${format(new Date(selectedDate), 'MMM dd, yyyy')}` : 'All time'}
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#8D6E63] font-medium">Total Orders</p>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ShoppingCart size={20} className="text-blue-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-[#5D4037]">{totals.orders}</p>
            <p className="text-xs text-[#8D6E63] mt-1">
              {totals.orders > 0 ? `Avg: ${formatCurrency(totals.revenue / totals.orders)}` : 'No orders'}
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-[#E6E0D4]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#8D6E63] font-medium">Items Sold</p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Package size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-[#5D4037]">{totals.items}</p>
            <p className="text-xs text-[#8D6E63] mt-1">
              {totals.orders > 0 ? `${(totals.items / totals.orders).toFixed(1)} items/order` : 'No items'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4] overflow-hidden">
          <div className="space-y-2 p-4">
            {paginatedTransactions.map(t => (
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
            {paginatedTransactions.length === 0 && (
              <div className="p-8 text-center text-[#8D6E63]">
                <p>No sales found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#8D6E63]">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} sales
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, current page, and pages around current
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#5D4037] text-white"
                        : "border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <InvoiceModal 
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};
