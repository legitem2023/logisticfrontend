'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { CheckCheck, Clock, Bike, Award } from 'lucide-react';
import dayjs from 'dayjs';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6'];

const RiderPerformanceChart = () => {
  const globalUserId = useSelector(selectTempUserId);

  const { data, loading, error } = useQuery(DELIVERIES, {
    variables: { getRidersDeliveryId: globalUserId },
  });
  
  const deliveries = data?.getRidersDelivery ?? [];
  
  // Process data and get available months
  const { monthlyData, performanceStats, months } = useMemo(() => {
    const statusMap = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0,
      in_transit: 0,
    };

    const monthlyMap: Record<string, Record<string, number>> = {};

    deliveries.forEach((delivery: any) => {
      // Handle MongoDB timestamp (ISO string or Date object)
      const deliveryDate = new Date(delivery.createdAt);
      if (isNaN(deliveryDate.getTime())) return;

      const month = dayjs(deliveryDate).format('MMMM');
      const date = dayjs(deliveryDate).format('MMM DD');

      // Initialize month/date if not exists
      if (!monthlyMap[month]) monthlyMap[month] = {};
      monthlyMap[month][date] = (monthlyMap[month][date] || 0) + 1;

      // Normalize status values
      const status = delivery.deliveryStatus.toLowerCase();
      if (status.includes('deliver') || status.includes('complete')) {
        statusMap.Delivered++;
      } else if (status.includes('cancel')) {
        statusMap.Cancelled++;
      } else if (status.includes('transit') || status.includes('progress')) {
        statusMap.in_transit++;
      } else {
        statusMap.Pending++;
      }
    });

    // Filter months with actual data and sort chronologically
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyDataFormatted: Record<string, { date: string; count: number }[]> = {};
    const availableMonths = Object.keys(monthlyMap)
      .filter(month => Object.keys(monthlyMap[month]).length > 0)
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

    availableMonths.forEach(month => {
      monthlyDataFormatted[month] = Object.entries(monthlyMap[month])
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    });

    // Calculate metrics
    const totalDeliveries = deliveries.length;
    const completionRate = totalDeliveries > 0 
      ? Math.round((statusMap.Delivered / totalDeliveries) * 100) 
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
          label: 'In Transit',
          value: statusMap.in_transit,
          icon: <Bike className="w-5 h-5 text-blue-500" />,
        },
        {
          label: 'Completion Rate',
          value: `${completionRate}%`,
          icon: <Award className="w-5 h-5 text-purple-500" />,
        },
        {
          label: 'Pending',
          value: statusMap.Pending,
          icon: <Clock className="w-5 h-5 text-yellow-500" />,
        },
      ],
      months: availableMonths,
    };
  }, [deliveries]);

  // Set initial month to first available month or current month
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months.length > 0 ? months[0] : dayjs().format('MMMM')
  );

  // Update selected month if months change
  useEffect(() => {
    if (months.length > 0 && !months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  const chartData = monthlyData[selectedMonth] || [];

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const normalizedStatus = status.toLowerCase();
    let badgeClass = '';
    
    if (normalizedStatus.includes('deliver') || normalizedStatus.includes('complete')) {
      badgeClass = 'bg-green-100 text-green-800';
    } else if (normalizedStatus.includes('transit') || normalizedStatus.includes('progress')) {
      badgeClass = 'bg-blue-100 text-blue-800';
    } else if (normalizedStatus.includes('cancel')) {
      badgeClass = 'bg-red-100 text-red-800';
    } else {
      badgeClass = 'bg-yellow-100 text-yellow-800';
    }

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">My Delivery Performance</h1>
        <p className="text-gray-600">Track your delivery stats and progress</p>
      </div>

      {/* Performance Cards */}
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

      {/* Month Selector */}
      {months.length > 0 && (
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
      )}

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            Failed to load delivery data
          </div>
        ) : months.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No delivery data available
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

      {/* Recent Activity */}
      {deliveries.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Recent Deliveries</h3>
          <div className="space-y-2">
            {deliveries.slice(0, 3).map((delivery: any) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{delivery.trackingNumber}</p>
                  <p className="text-sm text-gray-500">
                    {delivery.createdAt}
                    {dayjs(delivery.createdAt).format('MMM D, YYYY • h:mm A')}
                  </p>
                </div>
                <StatusBadge status={delivery.deliveryStatus} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderPerformanceChart;
