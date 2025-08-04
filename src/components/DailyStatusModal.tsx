import React from 'react';
import { X, Sun, Moon, IndianRupee } from 'lucide-react';

interface DailyStatusModalProps {
  type: 'morning' | 'evening';
  currentCash: { [key: string]: number };
  currentTotal: number;
  onClose: () => void;
  onSubmit: (type: 'morning' | 'evening') => void;
}

const DailyStatusModal: React.FC<DailyStatusModalProps> = ({ 
  type, 
  currentCash, 
  currentTotal, 
  onClose, 
  onSubmit 
}) => {
  const handleSubmit = () => {
    onSubmit(type);
    onClose();
  };

  const denominations = [
    { key: '2000', value: 2000, label: '₹2000' },
    { key: '500', value: 500, label: '₹500' },
    { key: '200', value: 200, label: '₹200' },
    { key: '100', value: 100, label: '₹100' },
    { key: '50', value: 50, label: '₹50' },
    { key: '20', value: 20, label: '₹20' },
    { key: '10', value: 10, label: '₹10' },
    { key: 'coin10', value: 10, label: '₹10 (Coin)' },
    { key: 'coin5', value: 5, label: '₹5' },
    { key: 'coin2', value: 2, label: '₹2' },
    { key: 'coin1', value: 1, label: '₹1' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r ${
          type === 'morning' ? 'from-orange-50 to-yellow-100' : 'from-indigo-50 to-purple-100'
        } rounded-t-xl`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              type === 'morning' ? 'bg-orange-500' : 'bg-indigo-500'
            }`}>
              {type === 'morning' ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {type === 'morning' ? 'Morning Cash Status' : 'Evening Cash Status'}
              </h2>
              <p className="text-sm text-gray-600">
                Record your {type} cash position for {new Date().toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Total */}
          <div className={`bg-gradient-to-r ${
            type === 'morning' ? 'from-orange-50 to-yellow-50' : 'from-indigo-50 to-purple-50'
          } rounded-lg p-4 mb-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IndianRupee className={`w-8 h-8 ${
                  type === 'morning' ? 'text-orange-600' : 'text-indigo-600'
                }`} />
                <div>
                  <p className="text-sm text-gray-600">Current Cash Total</p>
                  <p className={`text-3xl font-bold ${
                    type === 'morning' ? 'text-orange-700' : 'text-indigo-700'
                  }`}>
                    ₹{currentTotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {type === 'morning' ? 'Opening Balance' : 'Closing Balance'}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Cash Breakdown */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {denominations
                .filter(denom => (currentCash[denom.key] || 0) > 0)
                .map((denom) => {
                  const count = currentCash[denom.key] || 0;
                  const total = count * denom.value;
                  return (
                    <div key={denom.key} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">{denom.label}</div>
                        <div className="text-sm text-gray-600">{count} pcs</div>
                        <div className="text-sm font-medium text-green-600">
                          ₹{total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {Object.values(currentCash).every(count => count === 0) && (
              <div className="text-center py-8 text-gray-500">
                <IndianRupee className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No cash denominations recorded</p>
              </div>
            )}
          </div>

          {/* Confirmation */}
          <div className={`bg-gradient-to-r ${
            type === 'morning' ? 'from-orange-50 to-yellow-50' : 'from-indigo-50 to-purple-50'
          } rounded-lg p-4 mb-6`}>
            <h4 className="font-semibold text-gray-800 mb-2">Confirm Status Recording</h4>
            <p className="text-sm text-gray-600 mb-3">
              This will record your {type} cash status of ₹{currentTotal.toLocaleString('en-IN')} 
              for today ({new Date().toLocaleDateString('en-IN')}).
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${
                type === 'morning' ? 'bg-orange-400' : 'bg-indigo-400'
              }`} />
              <span>
                {type === 'morning' 
                  ? 'This will be your opening balance for the day' 
                  : 'This will be your closing balance for the day'
                }
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                type === 'morning' 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              Record {type === 'morning' ? 'Morning' : 'Evening'} Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyStatusModal;