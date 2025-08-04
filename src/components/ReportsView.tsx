import React, { useState } from 'react';
import { BarChart3, Calendar, TrendingUp, TrendingDown, IndianRupee, Target } from 'lucide-react';
import { Transaction } from '../App';

interface ReportsViewProps {
  transactions: Transaction[];
  currentCash: { [key: string]: number };
}

const ReportsView: React.FC<ReportsViewProps> = ({ transactions, currentCash }) => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const calculateTotal = (denominations: { [key: string]: number }) => {
    const denominationValues: { [key: string]: number } = {
      '2000': 2000, '500': 500, '200': 200, '100': 100, '50': 50, '20': 20, '10': 10,
      'coin10': 10, 'coin5': 5, 'coin2': 2, 'coin1': 1
    };

    return Object.entries(denominations).reduce((total, [denom, count]) => {
      return total + (denominationValues[denom] || 0) * count;
    }, 0);
  };

  const getDateRanges = () => {
    const now = new Date();
    const ranges = [];

    if (reportPeriod === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        ranges.push({
          label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        });
      }
    } else if (reportPeriod === 'weekly') {
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - (i * 7));
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        ranges.push({
          label: `${startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`,
          start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
          end: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1)
        });
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        ranges.push({
          label: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
        });
      }
    }

    return ranges;
  };

  const getReportData = () => {
    const ranges = getDateRanges();
    return ranges.map(range => {
      const rangeTransactions = transactions.filter(t => 
        t.timestamp >= range.start && t.timestamp < range.end
      );

      const added = rangeTransactions
        .filter(t => t.type === 'add')
        .reduce((sum, t) => sum + t.amount, 0);

      const removed = rangeTransactions
        .filter(t => t.type === 'subtract')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        label: range.label,
        added,
        removed,
        net: added - removed,
        transactions: rangeTransactions.length
      };
    });
  };

  const reportData = getReportData();
  const currentTotal = calculateTotal(currentCash);

  const totalAdded = transactions
    .filter(t => t.type === 'add')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRemoved = transactions
    .filter(t => t.type === 'subtract')
    .reduce((sum, t) => sum + t.amount, 0);

  const maxAmount = Math.max(...reportData.map(d => Math.max(d.added, d.removed)));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Reports</h2>
        <p className="text-gray-600">Analyze your cash flow patterns</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setReportPeriod(period as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                reportPeriod === period
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Current Cash</p>
              <p className="text-2xl font-bold text-green-700">₹{currentTotal.toLocaleString('en-IN')}</p>
            </div>
            <IndianRupee className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Added</p>
              <p className="text-2xl font-bold text-blue-700">₹{totalAdded.toLocaleString('en-IN')}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Removed</p>
              <p className="text-2xl font-bold text-red-700">₹{totalRemoved.toLocaleString('en-IN')}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Net Flow</p>
              <p className={`text-2xl font-bold ${
                (totalAdded - totalRemoved) >= 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                ₹{(totalAdded - totalRemoved).toLocaleString('en-IN')}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Cash Flow Trend</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {reportData.map((data, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{data.label}</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">+₹{data.added.toLocaleString('en-IN')}</span>
                  <span className="text-red-600">-₹{data.removed.toLocaleString('en-IN')}</span>
                  <span className={`font-medium ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Net: ₹{data.net.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-1 h-6">
                <div
                  className="bg-green-400 rounded-sm transition-all"
                  style={{ width: `${maxAmount > 0 ? (data.added / maxAmount) * 100 : 0}%` }}
                  title={`Added: ₹${data.added.toLocaleString('en-IN')}`}
                />
                <div
                  className="bg-red-400 rounded-sm transition-all"
                  style={{ width: `${maxAmount > 0 ? (data.removed / maxAmount) * 100 : 0}%` }}
                  title={`Removed: ₹${data.removed.toLocaleString('en-IN')}`}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {data.transactions} transaction{data.transactions !== 1 ? 's' : ''}
                </span>
                <div className="flex space-x-3 text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-sm mr-1" />
                    Added
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-sm mr-1" />
                    Removed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Denomination Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Cash Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(currentCash)
            .filter(([_, count]) => count > 0)
            .sort(([a], [b]) => {
              const aValue = a.startsWith('coin') ? parseInt(a.slice(4)) : parseInt(a);
              const bValue = b.startsWith('coin') ? parseInt(b.slice(4)) : parseInt(b);
              return bValue - aValue;
            })
            .map(([denom, count]) => {
              const value = denom.startsWith('coin') ? parseInt(denom.slice(4)) : parseInt(denom);
              const total = value * count;
              return (
                <div key={denom} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="font-semibold text-gray-800">
                    ₹{denom.startsWith('coin') ? denom.slice(4) : denom}
                  </div>
                  <div className="text-sm text-gray-600">{count} pcs</div>
                  <div className="text-sm font-medium text-green-600">
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;