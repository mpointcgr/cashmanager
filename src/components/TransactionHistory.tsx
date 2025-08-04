import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { Transaction } from '../App';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'add' | 'subtract'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filterTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (dateFilter === 'today') {
      filtered = filtered.filter(t => t.timestamp >= today);
    } else if (dateFilter === 'week') {
      filtered = filtered.filter(t => t.timestamp >= weekAgo);
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(t => t.timestamp >= monthAgo);
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions();

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction History</h2>
        <p className="text-gray-600">Track all your cash transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="add">Cash Added</option>
            <option value="subtract">Cash Removed</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredTransactions.length} of {transactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No transactions found</h3>
            <p className="text-gray-400">Start by adding or removing cash to see your transaction history</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`bg-white border-l-4 ${
                transaction.type === 'add' ? 'border-green-500' : 'border-red-500'
              } rounded-lg shadow-sm hover:shadow-md transition-shadow p-4`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'add' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'add' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{transaction.reason}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatTime(transaction.timestamp)}
                    </p>
                    {transaction.denominations && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Denominations:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(transaction.denominations)
                            .filter(([_, count]) => count > 0)
                            .map(([denom, count]) => (
                              <span
                                key={denom}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                {denom.startsWith('coin') ? `₹${denom.slice(4)}` : `₹${denom}`}: {count}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    transaction.type === 'add' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'add' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;