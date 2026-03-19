import React, { useState } from 'react';
import { useStore } from '../../StoreContext';
import { Trash2, Plus, Minus, CreditCard, Banknote, Percent, Coins, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../ConfirmDialog';

interface CartProps {
  onPayment: () => void;
}

export const Cart: React.FC<CartProps> = ({ onPayment }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartSubtotal, cartTax, cartDiscount, setCartItemDiscount } = useStore();
  const [discountMode, setDiscountMode] = useState<string | null>(null); // 'item' or 'cart' (global not implemented yet)
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCart = () => {
    if (cart.length > 0) {
      setShowClearConfirm(true);
    }
  };

  const confirmClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#8D6E63] p-4 md:p-8 text-center bg-white">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-4 md:mb-6">
          <CreditCard size={32} className="text-[#D7CCC8] md:w-12 md:h-12" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-2 text-[#5D4037]">Your cart is empty</h3>
        <p className="text-xs md:text-sm max-w-[200px]">Add items from the product list to start a new transaction.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-5 border-b border-[#F0EBE0] flex justify-between items-center bg-[#FDFBF7]">
        <h2 className="font-bold text-base md:text-xl text-[#5D4037]">Current Order</h2>
        <button 
          onClick={handleClearCart}
          className="p-2 text-[#8D6E63] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear Cart"
        >
          <Trash2 size={18} className="md:w-5 md:h-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#FDFBF7] rounded-lg md:rounded-xl p-2 md:p-3 border border-[#F0EBE0] hover:border-[#D7CCC8] transition-colors group relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <h4 className="font-semibold text-sm md:text-base text-[#3E2723] leading-tight line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-[#8D6E63] mt-1">GH₵{item.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm md:text-base text-[#5D4037]">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 md:mt-3">
                <div className="flex items-center gap-2 md:gap-3 bg-white rounded-lg border border-[#E0E0E0] px-1.5 md:px-2 py-1 shadow-sm">
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-[#8D6E63] hover:text-[#5D4037] active:scale-95 transition-transform"
                  >
                    <Minus size={14} className="md:w-4 md:h-4" />
                  </button>
                  <span className="font-bold text-[#3E2723] min-w-[16px] md:min-w-[20px] text-center text-xs md:text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-[#8D6E63] hover:text-[#5D4037] active:scale-95 transition-transform"
                  >
                    <Plus size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                   {/* Discount Button */}
                   <button 
                     onClick={() => {
                        const newDiscount = item.discountValue === 0 ? 10 : 0;
                        setCartItemDiscount(item.id, newDiscount, 'percent');
                        toast.success(newDiscount > 0 ? '10% Discount Applied' : 'Discount Removed');
                     }}
                     className={clsx(
                       "p-1.5 md:p-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1",
                       item.discountValue > 0 ? "bg-[#FFF8E1] text-[#FF8F00] border border-[#FFECB3]" : "text-[#8D6E63] hover:bg-[#F5F5F5]"
                     )}
                     title="Toggle 10% Discount"
                   >
                     <Percent size={12} className="md:w-3.5 md:h-3.5" />
                     {item.discountValue > 0 && <span className="hidden md:inline">-10%</span>}
                   </button>
                   
                   <button 
                     onClick={() => removeFromCart(item.id)}
                     className="p-1.5 md:p-2 text-[#BCAAA4] hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={14} className="md:w-4 md:h-4" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="p-3 md:p-5 bg-[#FDFBF7] border-t border-[#F0EBE0] space-y-2 md:space-y-3">
        <div className="flex justify-between text-xs md:text-sm text-[#8D6E63]">
          <span>Subtotal</span>
          <span>GH₵{cartSubtotal.toFixed(2)}</span>
        </div>
        {cartDiscount > 0 && (
          <div className="flex justify-between text-xs md:text-sm text-[#FF8F00]">
            <span>Discount</span>
            <span>-GH₵{cartDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs md:text-sm text-[#8D6E63]">
          <span>Tax (8%)</span>
          <span>GH₵{cartTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-[#E0E0E0]">
          <span className="font-bold text-base md:text-lg text-[#3E2723]">Total</span>
          <span className="font-bold text-xl md:text-2xl text-[#5D4037]">GH₵{cartTotal.toFixed(2)}</span>
        </div>

        <button 
          onClick={onPayment}
          className="w-full mt-3 md:mt-4 bg-[#5D4037] text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-lg hover:bg-[#4E342E] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <CreditCard size={20} className="md:w-6 md:h-6" />
          <span className="truncate">Charge GH₵{(cartTotal).toFixed(2)}</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        message="Are you sure you want to clear all items from the cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};
