import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { Search, Plus, UserPlus, Mail, Phone, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const Customers = () => {
  const { customers, addCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handleAdd = () => {
    if (!newCustomer.name) {
        toast.error('Name is required');
        return;
    }
    
    addCustomer({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
    });
    
    setIsAdding(false);
    setNewCustomer({ name: '', email: '', phone: '' });
    toast.success('Customer added successfully');
  };

  return (
    <div className="p-8 h-screen bg-[#FDFBF7] overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-[#5D4037]">Customers</h1>
            <p className="text-[#8D6E63] mt-1">Manage customer profiles and loyalty points.</p>
        </div>
        
        <div className="flex gap-4">
            <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
                type="text" 
                placeholder="Search customers..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E6E0D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] bg-white" 
            />
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-[#5D4037] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4E342E] transition-colors shadow-sm"
            >
                <Plus size={20} />
                <span className="hidden md:inline">Add Customer</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E6E0D4] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] border-b border-[#E6E0D4]">
            <tr>
              <th className="p-4 font-medium text-[#8D6E63]">Name</th>
              <th className="p-4 font-medium text-[#8D6E63]">Email</th>
              <th className="p-4 font-medium text-[#8D6E63]">Phone</th>
              <th className="p-4 font-medium text-[#8D6E63]">Loyalty Points</th>
              <th className="p-4 font-medium text-[#8D6E63]">Total Spent</th>
              <th className="p-4 font-medium text-[#8D6E63]">Last Visit</th>
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
                            placeholder="Email Address" 
                            value={newCustomer.email} 
                            onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                        />
                    </td>
                    <td className="p-4">
                        <input 
                            className="border border-[#D7CCC8] p-2 rounded w-full focus:outline-none focus:border-[#5D4037]" 
                            placeholder="Phone Number" 
                            value={newCustomer.phone} 
                            onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                        />
                    </td>
                    <td className="p-4 text-[#8D6E63] italic">0</td>
                    <td className="p-4 text-[#8D6E63] italic">GH₵0.00</td>
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
                    <td colSpan={6} className="p-12 text-center text-[#8D6E63]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center">
                                <UserPlus size={32} className="text-[#D7CCC8]" />
                            </div>
                            <p className="font-medium">No customers found</p>
                            <button onClick={() => setIsAdding(true)} className="text-[#5D4037] hover:underline text-sm">Add your first customer</button>
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
                        <Mail size={14} className="text-[#D7CCC8]" />
                        {customer.email || '-'}
                    </div>
                </td>
                <td className="p-4 text-[#8D6E63]">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-[#D7CCC8]" />
                        {customer.phone || '-'}
                    </div>
                </td>
                <td className="p-4">
                    <span className="bg-[#FFF8E1] text-[#FF8F00] px-2 py-1 rounded-full text-xs font-bold border border-[#FFECB3]">
                        {customer.loyaltyPoints} pts
                    </span>
                </td>
                <td className="p-4 text-[#3E2723] font-medium">GH₵{customer.totalSpent.toFixed(2)}</td>
                <td className="p-4 text-[#8D6E63] text-sm">{new Date(customer.lastVisit).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#8D6E63]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "px-3 py-2 rounded-lg",
                    currentPage === page
                      ? "bg-[#5D4037] text-white"
                      : "border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7]"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-[#E6E0D4] text-[#5D4037] hover:bg-[#FDFBF7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
