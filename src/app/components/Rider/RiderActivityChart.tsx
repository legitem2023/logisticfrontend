'use client';

import { useState } from 'react';
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

type Activity = {
  date: string;
  count: number;
};

const allMonthlyData: Record<string, Activity[]> = {
  // (Same data as before)
  July: [
    { date: 'Jul 18', count: 3 },
    { date: 'Jul 19', count: 7 },
    { date: 'Jul 20', count: 5 },
    { date: 'Jul 21', count: 9 },
    { date: 'Jul 22', count: 6 },
    { date: 'Jul 23', count: 10 },
    { date: 'Jul 24', count: 4 },
  ],
  // ... Other months
};

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];
const months = Object.keys(allMonthlyData);

// Mock status data (could be fetched)
const statusSummary = [
  {
    label: 'Completed',
    count: 124,
    color: 'bg-green-100 text-green-700',
    icon: <CheckCheck className="w-5 h-5 text-green-600" />,
  },
  {
    label: 'Pending',
    count: 38,
    color: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="w-5 h-5 text-yellow-500" />,
  },
  {
    label: 'Cancelled',
    count: 12,
    color: 'bg-red-100 text-red-700',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
  {
    label: 'Ongoing',
    count: 22,
    color: 'bg-blue-100 text-blue-700',
    icon: <Loader className="w-5 h-5 text-blue-500" />,
  },
];

const RiderActivityChart = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('July');
  const data = allMonthlyData[selectedMonth];

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
        <ResponsiveContainer width="100%" aspect={16 / 9}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiderActivityChart;
