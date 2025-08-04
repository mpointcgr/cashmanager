import React, { useState } from 'react';
import { Sun, Moon, TrendingUp, TrendingDown, Calendar, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import { DailyStatus } from '../App';

interface DailyStatusViewProps {
  dailyStatuses: DailyStatus[];
}

const DailyStatusView: React.FC<DailyStatusViewProps> = ({ dailyStatuses }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  const filterStatusesByPeriod = () => {
    const now = new Date();
    let filtered = dailyStatuses;

    if (selectedPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = dailyStatuses.filter(status => new Date(status.date) >= weekAgo);
    } else if (selectedPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = dailyStatuses.filter(status => new Date(status.date) >= monthAgo);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredStatuses = filterStatusesByPeriod();

  const getTodayStatus = () => {
    const today = new Date().toDateString();
    return dailyStatuses.find(status => status.date === today);
  };

  const getWeeklyStats = () => {
    const weekStatuses = filteredStatuses.slice(0, 7);
    const totalDays = weekStatuses.length;
    const daysWithBothStatuses = weekStatuses.filter(s => s.eveningTotal !== undefined).length;
    const avgMorning = weekStatuses.reduce((sum, s) => sum + s.morningTotal, 0) / totalDays || 0;
    const avgEvening = weekStatuses
      .filter(s => s.eveningTotal !== undefined)
      .reduce((sum, s) => sum + (s.eveningTotal || 0), 0) / daysWithBothStatuses || 0;
    
    return { totalDays, daysWithBothStatuses, avgMorning, avgEvening };
  };

  const todayStatus = getTodayStatus();
  const weeklyStats = getWeeklyStats();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Cash Status</h2>
        <p className="text-gray-600">Track your morning and evening cash positions</p>
      </div>

      {/* Today's Status Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Today's Status
          </h3>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        {todayStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-700">Morning</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{todayStatus.morningTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-gray-500">Opening Balance</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-gray-700">Evening</span>
                </div>
                {todayStatus.eveningTotal !== undefined ? (
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{todayStatus.eveningTotal.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Not recorded</span>
                )}
              </div>
              <p className="text-xs text-gray-500">Closing Balance</p>
            </div>

            {todayStatus.variance !== undefined && (
              <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {todayStatus.variance >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium text-gray-700">Daily Variance</span>
                  </div>
                  <span className={`text-xl font-bold ${
                    todayStatus.variance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {todayStatus.variance >= 0 ? '+' : ''}₹{todayStatus.variance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No status recorded for today</p>
            <p className="text-sm text-gray-400">Use the Morning Status or Evening Status buttons to record your cash position</p>
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Days Tracked</p>
              <p className="text-2xl font-bold text-blue-600">{weeklyStats.totalDays}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Complete Days</p>
              <p className="text-2xl font-bold text-green-600">{weeklyStats.daysWithBothStatuses}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Morning</p>
              <p className="text-xl font-bold text-orange-600">₹{Math.round(weeklyStats.avgMorning).toLocaleString('en-IN')}</p>
            </div>
            <Sun className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Evening</p>
              <p className="text-xl font-bold text-indigo-600">₹{Math.round(weeklyStats.avgEvening).toLocaleString('en-IN')}</p>
            </div>
            <Moon className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['week', 'month', 'all'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === period
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
            }`}
          >
            {period === 'week' ? 'Last Week' : period === 'month' ? 'Last Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Status History */}
      <div className="space-y-4">
        {filteredStatuses.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No daily status records found</h3>
            <p className="text-gray-400">Start recording your morning and evening cash positions to see your daily status history</p>
          </div>
        ) : (
          filteredStatuses.map((status) => (
            <div key={status.date} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{formatDate(status.date)}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(status.date).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Sun className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Morning</p>
                    <p className="font-bold text-orange-700">₹{status.morningTotal.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm text-gray-600">Evening</p>
                    {status.eveningTotal !== undefined ? (
                      <p className="font-bold text-indigo-700">₹{status.eveningTotal.toLocaleString('en-IN')}</p>
                    ) : (
                      <p className="text-sm text-gray-400">Not recorded</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {status.variance !== undefined ? (
                    <>
                      {status.variance >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Variance</p>
                        <p className={`font-bold ${
                          status.variance >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {status.variance >= 0 ? '+' : ''}₹{status.variance.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Variance</p>
                        <p className="text-sm text-gray-400">Incomplete</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyStatusView;