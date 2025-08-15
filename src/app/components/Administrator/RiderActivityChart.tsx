'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GETDELIVERIESADMIN } from '../../../../graphql/query';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { CheckCheck, Clock, XCircle, Loader, Info } from 'lucide-react';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const formatTimestampToMonth = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const formatTimestampToDayMonth = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

const formatTimestampToFullDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCurrentMonth = () => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
};

const RiderActivityChart = () => {
  const { data, loading, error } = useQuery(GETDELIVERIESADMIN);
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [showInfo, setShowInfo] = useState(false);

  const deliveries = data?.getDeliveries ?? [];

  const { allMonthlyData, statusSummary, months } = useMemo(() => {
    const statusMap: Record<string, number> = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0,
      in_transit: 0,
    };

    const monthlyMap: Record<string, Record<string, number>> = {};

    deliveries.forEach((delivery: any) => {
      const timestamp = parseInt(delivery.createdAt);
      if (isNaN(timestamp)) return;

      const month = formatTimestampToMonth(timestamp);
      const date = formatTimestampToDayMonth(timestamp);

      if (!monthlyMap[month]) monthlyMap[month] = {};
      if (!monthlyMap[month][date]) monthlyMap[month][date] = 0;
      monthlyMap[month][date] += 1;

      switch (delivery.deliveryStatus) {
        case 'Delivered':
          statusMap.Delivered += 1;
          break;
        case 'Pending':
          statusMap.Pending += 1;
          break;
        case 'Cancelled':
          statusMap.Cancelled += 1;
          break;
        case 'in_transit':
          statusMap.in_transit += 1;
          break;
      }
    });

    const monthlyDataFormatted: Record<string, { date: string; count: number }[]> = {};
    for (const month in monthlyMap) {
      monthlyDataFormatted[month] = Object.entries(monthlyMap[month]).map(([date, count]) => ({
        date,
        count,
      }));
    }

    const summary = [
      {
        label: 'Completed',
        count: statusMap.Delivered,
        color: 'bg-green-100 text-green-700',
        icon: <CheckCheck className="w-5 h-5 text-green-600" />,
        description: 'Deliveries successfully completed'
      },
      {
        label: 'Pending',
        count: statusMap.Pending,
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
        description: 'Deliveries waiting to be assigned'
      },
      {
        label: 'Cancelled',
        count: statusMap.Cancelled,
        color: 'bg-red-100 text-red-700',
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        description: 'Deliveries that were cancelled'
      },
      {
        label: 'Ongoing',
        count: statusMap.in_transit,
        color: 'bg-blue-100 text-blue-700',
        icon: <Loader className="w-5 h-5 text-blue-500" />,
        description: 'Deliveries currently in progress'
      },
    ];

    return {
      allMonthlyData: monthlyDataFormatted,
      statusSummary: summary,
      months: Object.keys(monthlyDataFormatted),
    };
  }, [deliveries]);

  const chartData = allMonthlyData[selectedMonth] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-1">
      <div className="w-full max-w-6xl mx-auto  shadow-lg overflow-hidden">
        {/* Premium Green Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 p-6 relative">
          <h1 className="text-3xl font-bold text-white">Delivery Analytics Dashboard</h1>
          <p className="text-green-100">Track and analyze rider delivery performance</p>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 bg-white">
          {showInfo && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">About this dashboard</h3>
              <p className="text-sm text-green-700">
                This dashboard displays delivery statistics by status and daily activity.
              </p>
            </div>
          )}

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statusSummary.map((status) => (
              <div
                key={status.label}
                className={`rounded-2xl p-5 shadow-sm flex items-center justify-between ${status.color} hover:shadow-md transition-shadow`}
              >
                <div>
                  <p className="text-sm font-medium">{status.label}</p>
                  <p className="text-2xl font-bold">{status.count}</p>
                  <p className="text-xs mt-1 opacity-80">{status.description}</p>
                </div>
                <div className="p-3 rounded-full bg-white bg-opacity-50">
                  {status.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Month Tabs */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Daily Delivery Activity</h2>
              <p className="text-sm text-gray-500">
                Showing data for: <span className="font-medium">{selectedMonth}</span>
              </p>
            </div>
            <div className="overflow-x-auto border-b border-gray-200">
              <div className="flex space-x-2 whitespace-nowrap px-1 pb-1">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(month)}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      selectedMonth === month
                        ? 'border-green-500 text-green-600 bg-green-50 rounded-t-md'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-500">Loading delivery data...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-600 font-medium">Error loading data</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-400">No delivery data available for {selectedMonth}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Deliveries" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderActivityChart;
