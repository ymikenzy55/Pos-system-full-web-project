import React from 'react';
import { Product } from '../../types';
import { Plus, Check } from 'lucide-react';
import { useStore } from '../../StoreContext';
import { clsx } from 'clsx';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatCurrency } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, cart } = useStore();
  const inCart = cart.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);

  return (
    <button 
      onClick={() => addToCart(product)}
      className="group relative bg-white rounded-2xl shadow-sm border border-[#F0EBE0] hover:shadow-md hover:border-[#D7CCC8] transition-all overflow-hidden flex flex-col text-left h-full"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FDFBF7]">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5] text-gray-400">
            No Image
          </div>
        )}
        
        {inCart && (
          <div className="absolute top-2 right-2 bg-[#5D4037] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Check size={12} />
            {cartItem?.quantity}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 w-full">
        <h3 className="font-semibold text-[#3E2723] text-lg leading-tight mb-1 truncate w-full">{product.name}</h3>
        <p className="text-sm text-[#8D6E63] mb-3 truncate w-full">{product.category?.name || 'Uncategorized'}</p>
        
        <div className="mt-auto flex items-center justify-between w-full">
          <span className="font-bold text-[#5D4037] text-xl">{formatCurrency(product.price)}</span>
          <div className="w-8 h-8 rounded-full bg-[#FDFBF7] flex items-center justify-center text-[#5D4037] group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
            <Plus size={18} />
          </div>
        </div>
      </div>
    </button>
  );
};
