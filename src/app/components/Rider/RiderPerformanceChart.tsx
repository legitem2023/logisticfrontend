'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { DELIVERIES } from '../../../../graphql/query';
import AnimatedCityscape from '../AnimatedCityscape';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { CheckCheck, Clock, Bike, Award, Info } from 'lucide-react';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6'];

const formatTimestampToMonth = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('en-US', { month: 'long' });

const formatTimestampToDayMonth = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

const formatTimestampToDateTime = (timestamp: number) =>
  new Date(timestamp)
    .toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' •');

const getCurrentMonth = () =>
  new Date().toLocaleDateString('en-US', { month: 'long' });

const RiderPerformanceChart = () => {
  const globalUserId = useSelector(selectTempUserId);
  const { data, loading, error } = useQuery(DELIVERIES, {
    variables: { getRidersDeliveryId: globalUserId },
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [showInfo, setShowInfo] = useState(false);

  const deliveries = data?.getRidersDelivery ?? [];

  const { monthlyData, performanceStats, months } = useMemo(() => {
    const statusMap = { Delivered: 0, Pending: 0, Cancelled: 0, in_transit: 0 };
    const monthlyMap: Record<string, Record<string, number>> = {};

    deliveries.forEach((delivery: any) => {
      const timestamp = parseInt(delivery.createdAt);
      if (isNaN(timestamp)) return;

      const month = formatTimestampToMonth(timestamp);
      const date = formatTimestampToDayMonth(timestamp);

      if (!monthlyMap[month]) monthlyMap[month] = {};
      if (!monthlyMap[month][date]) monthlyMap[month][date] = 0;
      monthlyMap[month][date] += 1;

      let statusKey = delivery.deliveryStatus;
      if (statusKey === 'completed') statusKey = 'Delivered';
      if (statusKey === 'cancelled') statusKey = 'Cancelled';

      if (statusMap.hasOwnProperty(statusKey)) {
        statusMap[statusKey as keyof typeof statusMap] += 1;
      }
    });

    const monthlyDataFormatted: Record<string, { date: string; count: number }[]> = {};
    for (const month in monthlyMap) {
      monthlyDataFormatted[month] = Object.entries(monthlyMap[month]).map(([date, count]) => ({
        date,
        count,
      }));
    }

    const completionRate = deliveries.length
      ? Math.round((statusMap.Delivered / deliveries.length) * 100)
      : 0;

    return {
      monthlyData: monthlyDataFormatted,
      performanceStats: [
        { label: 'Completed', value: statusMap.Delivered, color: 'bg-green-100 text-green-700', icon: <CheckCheck className="w-5 h-5 text-green-600" />, description: 'Deliveries successfully completed' },
        { label: 'In Progress', value: statusMap.in_transit, color: 'bg-blue-100 text-blue-700', icon: <Bike className="w-5 h-5 text-blue-500" />, description: 'Deliveries currently in transit' },
        { label: 'Pending', value: statusMap.Pending, color: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-5 h-5 text-yellow-500" />, description: 'Awaiting assignment' },
        { label: 'Completion Rate', value: `${completionRate}%`, color: 'bg-purple-100 text-purple-700', icon: <Award className="w-5 h-5 text-purple-500" />, description: 'Overall completion percentage' },
      ],
      months: Object.keys(monthlyDataFormatted),
    };
  }, [deliveries]);

  const chartData = monthlyData[selectedMonth] || [];

  return (
    <div className="p-0">
      <div className="w-full max-w-6xl mx-auto shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 relative">
         <AnimatedCityscape>
          <h1 className="text-2xl font-bold text-white">My Delivery Performance</h1>
          <p className="text-green-100">Track your delivery stats and progress</p>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Info className="w-5 h-5 text-white" />
          </button>
           </AnimatedCityscape>
        </div>

        <div className="p-6 bg-white">
          {showInfo && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">About this dashboard</h3>
              <p className="text-sm text-green-700">
                This section shows your delivery statistics, completion rate, and recent activities.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {performanceStats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-5 shadow-sm flex items-center justify-between ${stat.color} hover:shadow-md transition-shadow`}
              >
                <div>
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs mt-1 opacity-80">{stat.description}</p>
                </div>
                <div className="p-3 rounded-full bg-white bg-opacity-50">
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Month Selector */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Daily Deliveries</h2>
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
                <p className="text-gray-400">No deliveries for {selectedMonth}</p>
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
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Deliveries */}
          <div className="mt-8">
            <h3 className="font-medium mb-3 text-green-800">Recent Deliveries</h3>
            <div className="space-y-2">
              {deliveries.slice(0, 3).map((delivery: any) => {
                const timestamp = parseInt(delivery.createdAt);
                return (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-100 shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{delivery.trackingNumber}</p>
                      <p className="text-sm text-gray-500">
                        {formatTimestampToDateTime(timestamp)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        delivery.deliveryStatus === 'Delivered' || delivery.deliveryStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : delivery.deliveryStatus === 'in_transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {delivery.deliveryStatus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderPerformanceChart;
