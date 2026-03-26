import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Search, Plus, UserPlus, Phone, X, Check, ChevronLeft, ChevronRight, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/currency';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Customers = () => {
  const { customers, addCustomer, loadCustomers, deleteCustomer, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDate, setFilterDate] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; customerId: string; customerName: string }>({
    show: false,
    customerId: '',
    customerName: ''
  });
  const itemsPerPage = 20;

  // Filter customers by search term and date
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );

    // Filter by date if selected
    if (filterDate) {
      const selectedDate = new Date(filterDate);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter(c => {
        if (!c.lastPurchaseDate) return false;
        const purchaseDate = new Date(c.lastPurchaseDate);
        return purchaseDate >= selectedDate && purchaseDate < nextDay;
      });
    }

    return filtered;
  }, [customers, searchTerm, filterDate]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);

  const handleAdd = () => {
    if (!newCustomer.name.trim()) {
        toast.error('Name is required');
        return;
    }

    if (!newCustomer.phone.trim()) {
        toast.error('Phone number is required');
        return;
    }

    // Validate phone number (must be exactly 10 digits)
    const phoneDigits = newCustomer.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        return;
    }
    
    addCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
    });
    
    setIsAdding(false);
    setNewCustomer({ name: '', phone: '' });
    toast.success('Customer added successfully');
  };

  return (
    <div className="p-4 md:p-8 h-screen bg-[#FDFBF7] overflow-y-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#5D4037]">Customers</h1>
            <p className="text-[#8D6E63] mt-1 text-sm">Manage customer profiles and purchase history.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
              onClick={() => {
                loadCustomers();
                toast.success('Customers refreshed');
              }}
              className="bg-white border border-[#5D4037] text-[#5D4037] px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#FDFBF7] transition-colors shadow-sm"
          >
              <RefreshCw size={20} />
              Refresh
          </button>
          <button 
              onClick={() => setIsAdding(true)}
              className="bg-[#5D4037] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4E342E] transition-colors shadow-sm"
          >
              <Plus size={20} />
              Add Customer
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E6E0D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] bg-white" 
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-[#E6E0D4] rounded-lg">
          <Calendar size={18} className="text-[#8D6E63]" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="focus:outline-none text-sm"
            placeholder="Filter by date"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-[#8D6E63] hover:text-[#5D4037]"
              title="Clear date filter"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {searchTerm || filterDate ? (
        <p className="text-sm text-[#8D6E63] mb-4">
          Found {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
          {filterDate && ` on ${format(new Date(filterDate), 'MMM dd, yyyy')}`}
        </p>
      ) : null}

      <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#F5F5F5] border-b border-[#E6E0D4]">
              <tr>
                <th className="p-4 font-medium text-[#8D6E63]">Name</th>
                <th className="p-4 font-medium text-[#8D6E63]">Phone</th>
                <th className="p-4 font-medium text-[#8D6E63]">Total Spent</th>
                <th className="p-4 font-medium text-[#8D6E63]">Last Purchase</th>
                {user?.role === 'ADMIN' && <th className="p-4 font-medium text-[#8D6E63] text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isAdding && (
                  <tr className="bg-[#FFF8E1] animate-in fade-in duration-300">
                      <td className="p-4">
                          <input 
                              className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                              placeholder="Full Name" 
                              value={newCustomer.name} 
                              onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                              autoFocus
                          />
                      </td>
                      <td className="p-4">
                          <input 
                              className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                              placeholder="0XXXXXXXXX (10 digits)" 
                              type="tel"
                              maxLength={10}
                              value={newCustomer.phone} 
                              onChange={e => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 10) {
                                      setNewCustomer({...newCustomer, phone: value});
                                  }
                              }}
                          />
                          {newCustomer.phone && newCustomer.phone.length !== 10 && (
                              <p className="text-xs text-red-500 mt-1">Must be 10 digits</p>
                          )}
                      </td>
                      <td className="p-4 text-[#8D6E63] italic">{formatCurrency(0)}</td>
                      <td className="p-4">
                          <div className="flex gap-2 justify-end">
                              <button onClick={handleAdd} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-lg transition-colors"><Check size={20} /></button>
                              <button onClick={() => setIsAdding(false)} className="bg-red-100 text-red-700 hover:bg-red-200 p-2 rounded-lg transition-colors"><X size={20} /></button>
                          </div>
                      </td>
                  </tr>
              )}

              {filteredCustomers.length === 0 && !isAdding && (
                  <tr>
                      <td colSpan={4} className="p-12 text-center text-[#8D6E63]">
                          <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center">
                                  <UserPlus size={32} className="text-[#D7CCC8]" />
                              </div>
                              <p className="font-medium">
                                {searchTerm || filterDate ? 'No customers match your filters' : 'No customers found'}
                              </p>
                              {!searchTerm && !filterDate && (
                                <button onClick={() => setIsAdding(true)} className="text-[#5D4037] hover:underline text-sm">Add your first customer</button>
                              )}
                          </div>
                      </td>
                  </tr>
              )}

              {paginatedCustomers.map(customer => (
                <tr key={customer.id} className="border-b border-[#F0EBE0] hover:bg-[#FAFAFA] transition-colors">
                  <td className="p-4 font-medium text-[#3E2723] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EFEBE0] text-[#5D4037] flex items-center justify-center font-bold text-xs">
                          {customer.name.substring(0, 2).toUpperCase()}
                      </div>
                      {customer.name}
                  </td>
                  <td className="p-4 text-[#8D6E63]">
                      <div className="flex items-center gap-2">
                          <Phone size={14} className="text-[#D7CCC8]" />
                          {customer.phone}
                      </div>
                  </td>
                  <td className="p-4 text-[#3E2723] font-medium">{formatCurrency(customer.totalSpent)}</td>
                  <td className="p-4 text-[#8D6E63] text-sm">
                    {customer.lastPurchaseDate 
                      ? format(new Date(customer.lastPurchaseDate), 'MMM dd, yyyy HH:mm')
                      : 'No purchases yet'}
                  </td>
                  {user?.role === 'ADMIN' && (
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setDeleteConfirm({ show: true, customerId: customer.id, customerName: customer.name })}
                          disabled={customer.totalSpent > 0}
                          className={`p-2 rounded-lg transition-colors ${
                            customer.totalSpent > 0
                              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                              : 'text-[#8D6E63] hover:text-red-500 hover:bg-red-50'
                          }`}
                          title={customer.totalSpent > 0 ? 'Cannot delete customer with purchase history' : 'Delete customer'}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-sm text-[#8D6E63]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className={clsx(
                      "px-3 py-2 rounded-lg transition-colors",
                      currentPage === pageNum
                        ? "bg-[#5D4037] text-white"
                        : "border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7]"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, customerId: '', customerName: '' })}
        onConfirm={() => {
          deleteCustomer(deleteConfirm.customerId);
          setDeleteConfirm({ show: false, customerId: '', customerName: '' });
        }}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteConfirm.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
