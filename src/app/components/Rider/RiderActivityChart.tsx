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

type Activity = {
  date: string;
  count: number;
};

const allMonthlyData: Record<string, Activity[]> = {
  January: [
    { date: 'Jan 1', count: 5 },
    { date: 'Jan 2', count: 8 },
    { date: 'Jan 3', count: 2 },
  ],
  February: [
    { date: 'Feb 1', count: 6 },
    { date: 'Feb 2', count: 4 },
    { date: 'Feb 3', count: 9 },
  ],
  March: [
    { date: 'Mar 1', count: 3 },
    { date: 'Mar 2', count: 7 },
    { date: 'Mar 3', count: 5 },
  ],
  April: [
    { date: 'Apr 1', count: 4 },
    { date: 'Apr 2', count: 6 },
    { date: 'Apr 3', count: 2 },
  ],
  May: [
    { date: 'May 1', count: 9 },
    { date: 'May 2', count: 5 },
    { date: 'May 3', count: 6 },
  ],
  June: [
    { date: 'Jun 1', count: 8 },
    { date: 'Jun 2', count: 3 },
    { date: 'Jun 3', count: 7 },
  ],
  July: [
    { date: 'Jul 18', count: 3 },
    { date: 'Jul 19', count: 7 },
    { date: 'Jul 20', count: 5 },
    { date: 'Jul 21', count: 9 },
    { date: 'Jul 22', count: 6 },
    { date: 'Jul 23', count: 10 },
    { date: 'Jul 24', count: 4 },
  ],
  August: [
    { date: 'Aug 1', count: 2 },
    { date: 'Aug 2', count: 4 },
    { date: 'Aug 3', count: 7 },
  ],
  September: [
    { date: 'Sep 1', count: 6 },
    { date: 'Sep 2', count: 3 },
    { date: 'Sep 3', count: 9 },
  ],
  October: [
    { date: 'Oct 1', count: 1 },
    { date: 'Oct 2', count: 5 },
    { date: 'Oct 3', count: 8 },
  ],
  November: [
    { date: 'Nov 1', count: 4 },
    { date: 'Nov 2', count: 6 },
    { date: 'Nov 3', count: 2 },
  ],
  December: [
    { date: 'Dec 1', count: 7 },
    { date: 'Dec 2', count: 5 },
    { date: 'Dec 3', count: 6 },
  ],
};

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const months = Object.keys(allMonthlyData);

const RiderActivityChart = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('July');

  const handleTabClick = (month: string) => {
    setSelectedMonth(month);
  };

  const data = allMonthlyData[selectedMonth];

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-md font-semibold mb-4 text-center text-gray-700">Rider Daily Activity</h2>

      {/* Month Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => handleTabClick(month)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              selectedMonth === month
                ? 'bg-blue-500 text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Chart */}
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
  );
};

export default RiderActivityChart;
