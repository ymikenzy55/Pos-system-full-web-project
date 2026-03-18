import React from 'react';
import { Transaction } from '../../types';
import { X, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useStore } from '../../StoreContext';

interface InvoiceModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ transaction, isOpen, onClose }) => {
  const { customers } = useStore();
  
  if (!isOpen || !transaction) return null;

  const customer = transaction.customerId ? customers.find(c => c.id === transaction.customerId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 backdrop-blur-sm print:bg-white print:p-0 print:absolute print:inset-0 print:z-[100]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh] print:shadow-none print:w-full print:h-full print:max-w-none print:max-h-none print:rounded-none"
      >
        {/* Header (Hidden on Print) */}
        <div className="p-4 border-b border-[#E6E0D4] flex justify-between items-center bg-[#FDFBF7] print:hidden">
          <h2 className="font-bold text-lg text-[#5D4037]">Invoice Details</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 text-[#8D6E63] hover:bg-[#EFEBE0] rounded-lg transition-colors flex items-center gap-2"
              title="Print Invoice"
            >
              <Printer size={20} />
              <span className="text-sm font-medium">Print</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-white print:p-0 print:overflow-visible">
          {/* Business Info */}
          <div className="text-center mb-8 pb-8 border-b border-dashed border-gray-300">
            <h1 className="text-3xl font-bold text-[#5D4037] mb-2 uppercase tracking-tight">Bean & Brew</h1>
            <p className="text-sm text-[#8D6E63]">123 Coffee Lane, Brewtown, CA 90210</p>
            <p className="text-sm text-[#8D6E63]">(555) 123-4567 • info@beanandbrew.com</p>
          </div>

          {/* Transaction Meta */}
          <div className="flex justify-between mb-8 text-sm">
            <div>
              <p className="text-[#8D6E63] font-medium uppercase text-xs mb-1">Billed To</p>
              {customer ? (
                <>
                  <p className="font-bold text-[#3E2723]">{customer.name}</p>
                  <p className="text-[#8D6E63]">{customer.phone}</p>
                  {customer.email && <p className="text-[#8D6E63] text-xs">{customer.email}</p>}
                </>
              ) : (
                <p className="font-bold text-[#3E2723]">Walk-in Customer</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[#8D6E63] font-medium uppercase text-xs mb-1">Invoice Info</p>
              <p className="font-bold text-[#3E2723]">#{transaction.id}</p>
              <p className="text-[#8D6E63]">{format(new Date(transaction.date), 'MMM dd, yyyy hh:mm a')}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b border-[#3E2723] text-[#3E2723]">
                <th className="py-2 font-bold uppercase text-xs tracking-wider w-1/2">Item</th>
                <th className="py-2 font-bold uppercase text-xs tracking-wider text-center">Qty</th>
                <th className="py-2 font-bold uppercase text-xs tracking-wider text-right">Price</th>
                <th className="py-2 font-bold uppercase text-xs tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transaction.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 font-medium text-[#3E2723]">{item.name}</td>
                  <td className="py-3 text-center text-[#8D6E63]">{item.quantity}</td>
                  <td className="py-3 text-right text-[#8D6E63]">GH₵{item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-bold text-[#3E2723]">GH₵{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2 space-y-2">
              <div className="flex justify-between text-sm text-[#8D6E63]">
                <span>Subtotal</span>
                <span>GH₵{transaction.subtotal.toFixed(2)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-sm text-[#FF8F00]">
                  <span>Discount</span>
                  <span>-GH₵{transaction.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#8D6E63]">
                <span>Tax</span>
                <span>GH₵{transaction.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#5D4037] pt-2 border-t border-[#3E2723]">
                <span>Total</span>
                <span>GH₵{transaction.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E6E0D4] print:border print:border-gray-300">
            <p className="text-xs font-bold text-[#8D6E63] uppercase mb-2">Payment Details</p>
            <div className="flex justify-between text-sm">
              <span className="capitalize font-medium text-[#3E2723]">{transaction.paymentMethod}</span>
              <span className="font-bold text-[#5D4037]">GH₵{transaction.total.toFixed(2)}</span>
            </div>
            {transaction.paymentMethod === 'cash' && (
              <div className="flex justify-between text-xs text-[#8D6E63] mt-1">
                <span>Tendered: GH₵{transaction.cashAmount?.toFixed(2)}</span>
                <span>Change: GH₵{(transaction.cashAmount ? transaction.cashAmount - transaction.total : 0).toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-[#BCAAA4] pt-8 border-t border-gray-100">
            <p>Thank you for your business!</p>
            <p>Returns accepted within 30 days with original receipt.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
