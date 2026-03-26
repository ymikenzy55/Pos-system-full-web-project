import React, { useState } from 'react';
import { useStore } from '../../StoreContext';
import { CreditCard, Banknote, X, Check, Loader2, Printer, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Transaction } from '../../types';
import { InvoiceModal } from './InvoiceModal';
import { formatCurrency } from '../../utils/currency';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total }) => {
  const { processTransaction } = useStore();
  const [method, setMethod] = useState<'cash' | 'card' | 'split'>('cash');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const result = await processTransaction(method, cashAmount, 0);
      if (result) {
        setCompletedTransaction(result);
        setSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.error || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const changeDue = method === 'cash' ? Math.max(0, cashAmount - total) : 0;

  const handleClose = () => {
    setSuccess(false);
    setCompletedTransaction(null);
    setCashAmount(0);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            {success ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold text-[#5D4037] mb-2">Payment Successful!</h2>
                <p className="text-[#8D6E63] mb-8">Transaction has been recorded.</p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => setShowInvoice(true)}
                    className="w-full py-3 px-4 rounded-xl border-2 border-[#5D4037] text-[#5D4037] font-bold hover:bg-[#FDFBF7] transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer size={20} />
                    Print Invoice
                  </button>
                  <button 
                    onClick={handleClose}
                    className="w-full py-3 px-4 rounded-xl bg-[#5D4037] text-white font-bold hover:bg-[#4E342E] transition-colors flex items-center justify-center gap-2"
                  >
                    New Sale
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#5D4037] mb-6 text-center">Payment</h2>
                
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setMethod('cash')}
                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                      method === 'cash' 
                        ? 'border-[#5D4037] bg-[#FDFBF7] text-[#5D4037]' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Banknote size={24} />
                    <span className="font-medium text-sm">Cash</span>
                  </button>
                  <button
                    onClick={() => setMethod('card')}
                    className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${
                      method === 'card' 
                        ? 'border-[#5D4037] bg-[#FDFBF7] text-[#5D4037]' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="font-medium text-sm">MoMo</span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-lg font-medium text-gray-600">
                    <span>Total Due</span>
                    <span className="text-2xl font-bold text-[#5D4037]">{formatCurrency(total)}</span>
                  </div>

                  {method === 'cash' && (
                    <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E6E0D4]">
                      <label className="block text-sm font-medium text-[#8D6E63] mb-2">Cash Received</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63]">GH₵</span>
                        <input 
                          type="number" 
                          value={cashAmount || ''} 
                          onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                          className="w-full pl-16 pr-4 py-3 bg-white border border-[#E6E0D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5D4037] text-lg font-bold text-[#3E2723]"
                          placeholder="0.00"
                          autoFocus
                        />
                      </div>
                      {changeDue > 0 && (
                         <div className="mt-4 flex justify-between items-center text-[#4CAF50] font-medium">
                           <span>Change Due</span>
                           <span className="text-lg font-bold">{formatCurrency(changeDue)}</span>
                         </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={handlePayment}
                    disabled={isProcessing || (method === 'cash' && cashAmount < total)}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      isProcessing || (method === 'cash' && cashAmount < total)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Processing...
                      </>
                    ) : (
                      `Complete Transaction`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <InvoiceModal 
        isOpen={showInvoice} 
        transaction={completedTransaction} 
        onClose={() => setShowInvoice(false)} 
      />
    </>
  );
};
