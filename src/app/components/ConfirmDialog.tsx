import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const colors = {
    warning: {
      bg: 'bg-orange-100',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700'
    },
    danger: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    info: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const colorScheme = colors[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`${colorScheme.bg} p-3 rounded-full flex-shrink-0`}>
            <AlertTriangle size={24} className={colorScheme.icon} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#3E2723] mb-2">{title}</h3>
            <p className="text-[#8D6E63] text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E6E0D4] text-[#5D4037] font-medium hover:bg-[#FDFBF7] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${colorScheme.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
