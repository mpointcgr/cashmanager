import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Calendar, TrendingUp, Download, Upload, IndianRupee, Sun, Moon, Clock } from 'lucide-react';
import CashCounter from './components/CashCounter';
import TransactionHistory from './components/TransactionHistory';
import ReportsView from './components/ReportsView';
import AddTransactionModal from './components/AddTransactionModal';
import DailyStatusModal from './components/DailyStatusModal';
import DailyStatusView from './components/DailyStatusView';

export interface Transaction {
  id: string;
  type: 'add' | 'subtract';
  amount: number;
  reason: string;
  timestamp: Date;
  denominations?: { [key: string]: number };
  source?: 'csc' | 'csp' | 'other' | 'cash';
}

export interface DailyStatus {
  date: string;
  morningCash: { [key: string]: number };
  morningTotal: number;
  eveningCash?: { [key: string]: number };
  eveningTotal?: number;
  variance?: number;
  timestamp: Date;
}

function App() {
  const [currentCash, setCurrentCash] = useState<{ [key: string]: number }>({});
  const [balances, setBalances] = useState<{
    csc: number;
    csp: number;
    other: number;
    cash: number;
  }>({ csc: 0, csp: 0, other: 0, cash: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dailyStatuses, setDailyStatuses] = useState<DailyStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'counter' | 'history' | 'reports' | 'daily-status'>('counter');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'subtract'>('add');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusType, setStatusType] = useState<'morning' | 'evening'>('morning');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCash = localStorage.getItem('dailyCashManager_cash');
    const savedBalances = localStorage.getItem('dailyCashManager_balances');
    const savedTransactions = localStorage.getItem('dailyCashManager_transactions');
    const savedStatuses = localStorage.getItem('dailyCashManager_dailyStatuses');
    
    if (savedCash) {
      setCurrentCash(JSON.parse(savedCash));
    }
    
    if (savedBalances) {
      setBalances(JSON.parse(savedBalances));
    }
    
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      setTransactions(parsedTransactions.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp)
      })));
    }
    
    if (savedStatuses) {
      const parsedStatuses = JSON.parse(savedStatuses);
      setDailyStatuses(parsedStatuses.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      })));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyCashManager_cash', JSON.stringify(currentCash));
  }, [currentCash]);

  useEffect(() => {
    localStorage.setItem('dailyCashManager_balances', JSON.stringify(balances));
  }, [balances]);

  useEffect(() => {
    localStorage.setItem('dailyCashManager_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dailyCashManager_dailyStatuses', JSON.stringify(dailyStatuses));
  }, [dailyStatuses]);

  const calculateTotal = (denominations: { [key: string]: number }) => {
    const denominationValues: { [key: string]: number } = {
      '2000': 2000, '500': 500, '200': 200, '100': 100, '50': 50, '20': 20, '10': 10,
      'coin10': 10, 'coin5': 5, 'coin2': 2, 'coin1': 1
    };

    return Object.entries(denominations).reduce((total, [denom, count]) => {
      return total + (denominationValues[denom] || 0) * count;
    }, 0);
  };

  const handleTransaction = (type: 'add' | 'subtract', amount: number, reason: string, denominations?: { [key: string]: number }, source?: 'csc' | 'csp' | 'other' | 'cash') => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      reason,
      timestamp: new Date(),
      denominations,
      source: source || 'cash'
    };

    setTransactions(prev => [transaction, ...prev]);

    // Update balances based on source
    if (source && source !== 'cash') {
      setBalances(prev => ({
        ...prev,
        [source]: type === 'add' ? prev[source] + amount : Math.max(0, prev[source] - amount)
      }));
    }

    if (denominations) {
      setCurrentCash(prev => {
        const newCash = { ...prev };
        Object.entries(denominations).forEach(([denom, count]) => {
          const currentCount = newCash[denom] || 0;
          newCash[denom] = type === 'add' ? currentCount + count : Math.max(0, currentCount - count);
        });
        return newCash;
      });
    }
  };

  const handleDailyStatus = (type: 'morning' | 'evening') => {
    const today = new Date().toDateString();
    const currentTotal = calculateTotal(currentCash);
    
    setDailyStatuses(prev => {
      const existingIndex = prev.findIndex(s => s.date === today);
      
      if (existingIndex >= 0) {
        // Update existing status
        const updated = [...prev];
        if (type === 'morning') {
          updated[existingIndex] = {
            ...updated[existingIndex],
            morningCash: { ...currentCash },
            morningTotal: currentTotal,
            timestamp: new Date()
          };
        } else {
          updated[existingIndex] = {
            ...updated[existingIndex],
            eveningCash: { ...currentCash },
            eveningTotal: currentTotal,
            variance: currentTotal - updated[existingIndex].morningTotal,
            timestamp: new Date()
          };
        }
        return updated;
      } else {
        // Create new status
        const newStatus: DailyStatus = {
          date: today,
          morningCash: type === 'morning' ? { ...currentCash } : {},
          morningTotal: type === 'morning' ? currentTotal : 0,
          timestamp: new Date()
        };
        
        if (type === 'evening') {
          newStatus.eveningCash = { ...currentCash };
          newStatus.eveningTotal = currentTotal;
          newStatus.variance = currentTotal - 0; // No morning data
        }
        
        return [newStatus, ...prev];
      }
    });
  };

  const exportData = () => {
    const data = {
      cash: currentCash,
      balances: balances,
      transactions: transactions,
      dailyStatuses: dailyStatuses,
      exportDate: new Date()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cash) setCurrentCash(data.cash);
       if (data.balances) setBalances(data.balances);
        if (data.transactions) {
          const parsedTransactions = data.transactions.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp)
          }));
          setTransactions(parsedTransactions);
        }
        if (data.dailyStatuses) {
          const parsedStatuses = data.dailyStatuses.map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp)
          }));
          setDailyStatuses(parsedStatuses);
        }
      } catch (error) {
        alert('Invalid backup file format');
      }
    };
    reader.readAsText(file);
  };

  const totalCash = calculateTotal(currentCash);
  const totalBalance = totalCash + balances.csc + balances.csp + balances.other;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <IndianRupee className="w-8 h-8 text-orange-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Daily Cash Manager</h1>
                <p className="text-gray-600">Track your daily cash flow with Indian denominations</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Balance</p>
              <p className="text-3xl font-bold text-green-600">₹{totalBalance.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">Cash: ₹{totalCash.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          {/* Balance Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-600">Physical Cash</p>
              <p className="text-lg font-bold text-gray-800">₹{totalCash.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-600">CSC Balance</p>
              <p className="text-lg font-bold text-blue-800">₹{balances.csc.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-600">CSP Balance</p>
              <p className="text-lg font-bold text-purple-800">₹{balances.csp.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-600">Other Balance</p>
              <p className="text-lg font-bold text-indigo-800">₹{balances.other.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('counter')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'counter'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <IndianRupee className="w-5 h-5" />
            <span>Cash Counter</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>History</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'reports'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('daily-status')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'daily-status'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Daily Status</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => {
              setModalType('add');
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Cash</span>
          </button>
          <button
            onClick={() => {
              setModalType('subtract');
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <MinusCircle className="w-5 h-5" />
            <span>Remove Cash</span>
          </button>
          <button
            onClick={() => {
              setStatusType('morning');
              setShowStatusModal(true);
            }}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Sun className="w-5 h-5" />
            <span>Morning Status</span>
          </button>
          <button
            onClick={() => {
              setStatusType('evening');
              setShowStatusModal(true);
            }}
            className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Moon className="w-5 h-5" />
            <span>Evening Status</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
          <label className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'counter' && (
            <CashCounter
              currentCash={currentCash}
              setCurrentCash={setCurrentCash}
            balances={balances}
            setBalances={setBalances}
              onTransaction={handleTransaction}
            />
          )}
          {activeTab === 'history' && (
            <TransactionHistory transactions={transactions} />
          )}
          {activeTab === 'reports' && (
            <ReportsView transactions={transactions} currentCash={currentCash} />
          )}
          {activeTab === 'daily-status' && (
            <DailyStatusView dailyStatuses={dailyStatuses} />
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <AddTransactionModal
          type={modalType}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleTransaction}
        />
      )}

      {/* Daily Status Modal */}
      {showStatusModal && (
        <DailyStatusModal
          type={statusType}
          currentCash={currentCash}
          currentTotal={totalCash}
          onClose={() => setShowStatusModal(false)}
          onSubmit={handleDailyStatus}
        />
      )}
    </div>
  );
}

export default App;