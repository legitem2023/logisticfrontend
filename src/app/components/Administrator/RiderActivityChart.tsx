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
import dayjs from 'dayjs';

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const RiderActivityChart = () => {
  const { data, loading, error } = useQuery(GETDELIVERIESADMIN);
  const [selectedMonth, setSelectedMonth] = useState<string>(dayjs().format('MMMM'));
  const [showInfo, setShowInfo] = useState(false);

  const deliveries = data?.getDeliveries ?? [];

  // ⏳ Process data
  const { allMonthlyData, statusSummary, months } = useMemo(() => {
    const statusMap: Record<string, number> = {
      Delivered: 0,
      Pending: 0,
      Cancelled: 0,
      in_transit: 0,
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
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Analytics Dashboard</h1>
          <p className="text-gray-600">Track and analyze rider delivery performance</p>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Information"
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">About this dashboard</h3>
          <p className="text-sm text-blue-700">
            This dashboard displays delivery statistics by status and daily activity. Use the month tabs 
            to view daily delivery counts for specific months. The chart shows the number of deliveries 
            per day, while the status cards provide a quick overview of delivery outcomes.
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
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50 rounded-t-md'
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-500">Loading delivery data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600 font-medium">Error loading data</p>
            <p className="text-red-500 text-sm mt-1">Please try refreshing the page or contact support if the problem persists.</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-400">No delivery data available for {selectedMonth}</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
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
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Deliveries" 
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>Hover over bars to see exact delivery counts. Data updates in real-time.</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1">
            <h3 className="font-medium text-gray-700 mb-3">Key Insights</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2"></span>
                <span>
                  <span className="font-medium">Peak days</span>: {chartData.length > 0 
                    ? chartData.reduce((max, day) => max.count > day.count ? max : day).date 
                    : 'No data'} had the most deliveries this month
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                <span>
                  <span className="font-medium">Completion rate</span>: {statusSummary[0].count} of {deliveries.length} deliveries were completed ({deliveries.length > 0 ? Math.round((statusSummary[0].count / deliveries.length) * 100) : 0}%)
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2"></span>
                <span>
                  <span className="font-medium">Cancellation rate</span>: {statusSummary[2].count} deliveries cancelled ({deliveries.length > 0 ? Math.round((statusSummary[2].count / deliveries.length) * 100) : 0}%)
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-1">
            <h3 className="font-medium text-gray-700 mb-3">Data Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium">Time period</p>
                <p>{months.length > 0 ? `Data available from ${months[0]} to ${months[months.length - 1]}` : 'No data available'}</p>
              </div>
              <div>
                <p className="font-medium">Total deliveries</p>
                <p>{deliveries.length} recorded</p>
              </div>
              <div>
                <p className="font-medium">Last updated</p>
                <p>{dayjs().format('MMMM D, YYYY [at] h:mm A')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderActivityChart;
