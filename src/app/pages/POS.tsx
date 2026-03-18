import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { ProductCard } from '../components/pos/ProductCard';
import { Cart } from '../components/pos/Cart';
import { PaymentModal } from '../components/pos/PaymentModal';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';

export const POS = () => {
  const { products, cartTotal } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => 
    (selectedCategory ? p.category === selectedCategory : true) &&
    (searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Product List */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5D4037] focus:border-transparent transition-all shadow-sm bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                !selectedCategory ? "bg-[#5D4037] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap",
                  selectedCategory === cat ? "bg-[#5D4037] text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl font-medium">No products found</p>
              <p className="text-sm mt-2">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full shadow-xl z-20">
        <Cart onPayment={() => setIsPaymentOpen(true)} />
      </div>

      {/* Payment Modal */}
      {isPaymentOpen && (
        <PaymentModal 
          isOpen={isPaymentOpen} 
          onClose={() => setIsPaymentOpen(false)} 
          total={cartTotal} 
        />
      )}
    </div>
  );
};