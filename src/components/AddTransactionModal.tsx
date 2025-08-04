import React, { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';

interface AddTransactionModalProps {
  type: 'add' | 'subtract';
  onClose: () => void;
  onSubmit: (type: 'add' | 'subtract', amount: number, reason: string) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ type, onClose, onSubmit }) => {
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!reason.trim()) {
      alert('Please enter a reason for this transaction');
      return;
    }
    
    onSubmit(type, numAmount, reason.trim());
    onClose();
  };

  const commonReasons = type === 'add' 
    ? ['Daily Sales', 'Cash Deposit', 'Customer Payment', 'Return Money', 'Petty Cash Addition']
    : ['Purchase Payment', 'Expense', 'Cash Withdrawal', 'Staff Payment', 'Utility Bill'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r ${
          type === 'add' ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
        } rounded-t-xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              type === 'add' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {type === 'add' ? 'Add Cash' : 'Remove Cash'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reason for this transaction"
              required
            />
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Reasons:</p>
            <div className="flex flex-wrap gap-2">
              {commonReasons.map((commonReason) => (
                <button
                  key={commonReason}
                  type="button"
                  onClick={() => setReason(commonReason)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {commonReason}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                type === 'add' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {type === 'add' ? 'Add Cash' : 'Remove Cash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;