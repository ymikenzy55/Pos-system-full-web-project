import React from 'react';
import { Product } from '../../types';
import { Plus, Check, Package } from 'lucide-react';
import { useStore } from '../../StoreContext';
import { clsx } from 'clsx';

interface ProductRowProps {
  product: Product;
}

export const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const { addToCart, cart } = useStore();
  const inCart = cart.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);

  return (
    <tr 
      className="group hover:bg-[#FDFBF7] transition-all cursor-pointer border-b border-gray-100"
      onClick={() => addToCart(product)}
    >
      {/* Product Image & Name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0 shadow-sm">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package size={24} />
              </div>
            )}
            {inCart && (
              <div className="absolute top-1 right-1 bg-[#5D4037] text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <Check size={10} />
                {cartItem?.quantity}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#3E2723] text-base leading-tight truncate">
              {product.name}
            </h3>
            <p className="text-sm text-[#8D6E63] truncate">
              {product.description || 'No description'}
            </p>
          </div>
        </div>
      </td>

      {/* SKU */}
      <td className="py-4 px-4">
        <span className="text-sm font-mono text-[#5D4037] bg-[#F5F1E8] px-3 py-1 rounded-md">
          {product.sku}
        </span>
      </td>

      {/* Category */}
      <td className="py-4 px-4">
        <span className="text-sm text-[#3E2723]">
          {product.category}
        </span>
      </td>

      {/* Stock */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className={clsx(
            "text-sm font-semibold",
            product.stock > 20 ? "text-green-600" : 
            product.stock > 10 ? "text-yellow-600" : 
            product.stock > 0 ? "text-orange-600" : "text-red-600"
          )}>
            {product.stock}
          </span>
          <span className="text-xs text-[#8D6E63]">in stock</span>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-4">
        <span className="font-bold text-[#5D4037] text-lg">
          GH₵{product.price.toFixed(2)}
        </span>
      </td>

      {/* Add Button */}
      <td className="py-4 px-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={product.stock <= 0}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
            product.stock > 0
              ? "bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <Plus size={16} />
          {product.stock > 0 ? 'Add' : 'Out of Stock'}
        </button>
      </td>
    </tr>
  );
};
