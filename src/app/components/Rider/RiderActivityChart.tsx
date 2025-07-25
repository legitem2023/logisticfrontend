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
import { CheckCheck, Clock, XCircle, Loader } from 'lucide-react';
import dayjs from 'dayjs';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const RiderActivityChart = () => {
  const { data, loading, error } = useQuery(GETDELIVERIESADMIN);
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('MMMM'));

  const deliveries = data?.getDeliveries ?? [];

  // ⏳ Process data
  const { allMonthlyData, statusSummary, months } = useMemo(() => {
    const statusMap: Record<string, number> = {
      Completed: 0,
      Pending: 0,
      Cancelled: 0,
      Ongoing: 0,
    };

    const monthlyMap: Record<string, Record<string, number>> = {};

    deliveries.forEach((delivery: any) => {
      const createdAt = dayjs(delivery.createdAt);
      const month = createdAt.format('MMMM');
      const date = createdAt.format('MMM DD');

      if (!monthlyMap[month]) monthlyMap[month] = {};
      if (!monthlyMap[month][date]) monthlyMap[month][date] = 0;
      monthlyMap[month][date] += 1;

      // Count by status
      switch (delivery.deliveryStatus) {
        case 'COMPLETED':
          statusMap.Completed += 1;
          break;
        case 'PENDING':
          statusMap.Pending += 1;
          break;
        case 'CANCELLED':
          statusMap.Cancelled += 1;
          break;
        case 'ONGOING':
          statusMap.Ongoing += 1;
          break;
        default:
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
        count: statusMap.Completed,
        color: 'bg-green-100 text-green-700',
        icon: <CheckCheck className="w-5 h-5 text-green-600" />,
      },
      {
        label: 'Pending',
        count: statusMap.Pending,
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
      },
      {
        label: 'Cancelled',
        count: statusMap.Cancelled,
        color: 'bg-red-100 text-red-700',
        icon: <XCircle className="w-5 h-5 text-red-500" />,
      },
      {
        label: 'Ongoing',
        count: statusMap.Ongoing,
        color: 'bg-blue-100 text-blue-700',
        icon: <Loader className="w-5 h-5 text-blue-500" />,
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
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Rider Daily Activity</h2>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statusSummary.map((status) => (
          <div
            key={status.label}
            className={`rounded-2xl p-4 shadow-sm flex items-center justify-between ${status.color}`}
          >
            <div>
              <p className="text-sm font-medium">{status.label}</p>
              <p className="text-lg font-semibold">{status.count}</p>
            </div>
            {status.icon}
          </div>
        ))}
      </div>

      {/* Month Tabs */}
      <div className="overflow-x-auto border-b border-gray-200 mb-6">
        <div className="flex space-x-4 whitespace-nowrap px-1">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`py-2 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                selectedMonth === month
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-md shadow-md'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        {loading ? (
          <p className="text-center text-gray-400">Loading chart data...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load data.</p>
        ) : (
          <ResponsiveContainer width="100%" aspect={16 / 9}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RiderActivityChart;
