import React, { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface CashCounterProps {
  currentCash: { [key: string]: number };
  setCurrentCash: (cash: { [key: string]: number }) => void;
  onTransaction: (type: 'add' | 'subtract', amount: number, reason: string, denominations?: { [key: string]: number }) => void;
}

const denominations = [
  { key: '2000', value: 2000, label: '₹2000', color: 'bg-pink-100 border-pink-300', type: 'note' },
  { key: '500', value: 500, label: '₹500', color: 'bg-purple-100 border-purple-300', type: 'note' },
  { key: '200', value: 200, label: '₹200', color: 'bg-yellow-100 border-yellow-300', type: 'note' },
  { key: '100', value: 100, label: '₹100', color: 'bg-blue-100 border-blue-300', type: 'note' },
  { key: '50', value: 50, label: '₹50', color: 'bg-green-100 border-green-300', type: 'note' },
  { key: '20', value: 20, label: '₹20', color: 'bg-orange-100 border-orange-300', type: 'note' },
  { key: '10', value: 10, label: '₹10', color: 'bg-red-100 border-red-300', type: 'note' },
  { key: 'coin10', value: 10, label: '₹10', color: 'bg-gray-100 border-gray-300', type: 'coin' },
  { key: 'coin5', value: 5, label: '₹5', color: 'bg-gray-100 border-gray-300', type: 'coin' },
  { key: 'coin2', value: 2, label: '₹2', color: 'bg-gray-100 border-gray-300', type: 'coin' },
  { key: 'coin1', value: 1, label: '₹1', color: 'bg-gray-100 border-gray-300', type: 'coin' },
];

const CashCounter: React.FC<CashCounterProps> = ({ currentCash, setCurrentCash, onTransaction }) => {
  const [tempCounts, setTempCounts] = useState<{ [key: string]: number }>({});

  const updateCount = (denomKey: string, delta: number) => {
    setTempCounts(prev => ({
      ...prev,
      [denomKey]: Math.max(0, (prev[denomKey] || 0) + delta)
    }));
  };

  const resetTempCounts = () => {
    setTempCounts({});
  };

  const applyChanges = (type: 'add' | 'subtract') => {
    const hasChanges = Object.values(tempCounts).some(count => count > 0);
    if (!hasChanges) return;

    const amount = Object.entries(tempCounts).reduce((total, [key, count]) => {
      const denom = denominations.find(d => d.key === key);
      return total + (denom?.value || 0) * count;
    }, 0);

    const reason = type === 'add' ? 'Manual cash addition' : 'Manual cash removal';
    onTransaction(type, amount, reason, tempCounts);
    setTempCounts({});
  };

  const calculateTotal = () => {
    return Object.entries(tempCounts).reduce((total, [key, count]) => {
      const denom = denominations.find(d => d.key === key);
      return total + (denom?.value || 0) * count;
    }, 0);
  };

  const calculateCurrentTotal = () => {
    return Object.entries(currentCash).reduce((total, [key, count]) => {
      const denom = denominations.find(d => d.key === key);
      return total + (denom?.value || 0) * count;
    }, 0);
  };

  const tempTotal = calculateTotal();
  const currentTotal = calculateCurrentTotal();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cash Counter</h2>
        <p className="text-gray-600">Count your cash by denomination</p>
      </div>

      {/* Current Total */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Current Total</p>
            <p className="text-2xl font-bold text-green-600">₹{currentTotal.toLocaleString('en-IN')}</p>
          </div>
          {tempTotal > 0 && (
            <div>
              <p className="text-sm text-gray-600">Pending Changes</p>
              <p className="text-xl font-semibold text-blue-600">₹{tempTotal.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">Notes</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {denominations.filter(d => d.type === 'note').map((denom) => (
            <div key={denom.key} className={`${denom.color} border-2 rounded-lg p-4 transition-all hover:shadow-md`}>
              <div className="text-center mb-3">
                <div className="text-lg font-bold text-gray-800">{denom.label}</div>
                <div className="text-sm text-gray-600">
                  Current: {currentCash[denom.key] || 0}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => updateCount(denom.key, -1)}
                  className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={tempCounts[denom.key] || 0}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setTempCounts(prev => ({
                      ...prev,
                      [denom.key]: value
                    }));
                  }}
                  className="text-xl font-bold min-w-[3rem] w-16 text-center border border-gray-300 rounded px-1 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <button
                  onClick={() => updateCount(denom.key, 1)}
                  className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center text-sm font-medium text-gray-700">
                ₹{((tempCounts[denom.key] || 0) * denom.value).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coins Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2">Coins</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {denominations.filter(d => d.type === 'coin').map((denom) => (
            <div key={denom.key} className={`${denom.color} border-2 rounded-lg p-4 transition-all hover:shadow-md`}>
              <div className="text-center mb-3">
                <div className="text-lg font-bold text-gray-800">{denom.label}</div>
                <div className="text-sm text-gray-600">
                  Current: {currentCash[denom.key] || 0}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => updateCount(denom.key, -1)}
                  className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={tempCounts[denom.key] || 0}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setTempCounts(prev => ({
                      ...prev,
                      [denom.key]: value
                    }));
                  }}
                  className="text-xl font-bold min-w-[3rem] w-16 text-center border border-gray-300 rounded px-1 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <button
                  onClick={() => updateCount(denom.key, 1)}
                  className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center text-sm font-medium text-gray-700">
                ₹{((tempCounts[denom.key] || 0) * denom.value).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {tempTotal > 0 && (
        <div className="flex flex-wrap gap-3 justify-center bg-gray-50 rounded-lg p-4">
          <button
            onClick={() => applyChanges('add')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Add to Cash</span>
          </button>
          <button
            onClick={() => applyChanges('subtract')}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Minus className="w-5 h-5" />
            <span>Remove from Cash</span>
          </button>
          <button
            onClick={resetTempCounts}
            className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CashCounter;