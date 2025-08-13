'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { DELIVERIES } from '../../../../graphql/query';
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
import { CheckCheck, Clock, XCircle, Bike, Award } from 'lucide-react';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6'];

// Helper functions to format timestamps
const formatTimestampToMonth = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const formatTimestampToDayMonth = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
};

const formatTimestampToDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(',', ' •');
};

const getCurrentMonth = () => {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
};

const RiderPerformanceChart = () => {
  const globalUserId = useSelector(selectTempUserId);

  const { data, loading, error } = useQuery(DELIVERIES, {
    variables: { getRidersDeliveryId: globalUserId },
  });
  
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  const deliveries = data?.getRidersDelivery ?? [];

  // Process rider-specific data
  const { monthlyData, performanceStats, months } = useMemo(() => {
    const statusMap = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0,
      in_transit: 0,
    };

    const monthlyMap: Record<string, Record<string, number>> = {};

    deliveries.forEach((delivery: any) => {
      const timestamp = parseInt(delivery.createdAt);
      if (isNaN(timestamp)) return; // Skip invalid timestamps
      
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

    const completionRate = deliveries.length > 0 
      ? Math.round((statusMap.Delivered / deliveries.length) * 100) 
      : 0;

    return {
      monthlyData: monthlyDataFormatted,
      performanceStats: [
        {
          label: 'Completed',
          value: statusMap.Delivered,
          icon: <CheckCheck className="w-5 h-5 text-green-500" />,
        },
        {
          label: 'In Progress',
          value: statusMap.in_transit,
          icon: <Bike className="w-5 h-5 text-blue-500" />,
        },
        {
          label: 'Pending',
          value: statusMap.Pending,
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
        },
        {
          label: 'Completion Rate',
          value: `${completionRate}%`,
          icon: <Award className="w-5 h-5 text-purple-500" />,
        },
      ],
      months: Object.keys(monthlyDataFormatted),
    };
  }, [deliveries]);

  const chartData = monthlyData[selectedMonth] || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Delivery Performance</h1>
        <p className="text-gray-600">Track your delivery stats and progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {performanceStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center"
          >
            <div className="mr-3 p-2 bg-white rounded-full shadow-sm">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-md font-semibold">Daily Deliveries</h2>
        <div className="flex space-x-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-1 text-sm rounded-md ${
                selectedMonth === month
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load delivery data
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No deliveries for {selectedMonth}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar 
                dataKey="count" 
                name="Deliveries"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={barColors[index % barColors.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Recent Deliveries</h3>
        <div className="space-y-2">
          {deliveries.slice(0, 3).map((delivery: any) => {
            const timestamp = parseInt(delivery.createdAt);
            return (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{delivery.trackingNumber}</p>
                  <p className="text-sm text-gray-500">
                    {formatTimestampToDateTime(timestamp)}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  delivery.deliveryStatus === 'Delivered' || delivery.deliveryStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : delivery.deliveryStatus === 'in_transit'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {delivery.deliveryStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RiderPerformanceChart;
