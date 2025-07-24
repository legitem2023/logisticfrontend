'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

type Activity = {
  date: string;
  count: number;
};

const data: Activity[] = [
  { date: 'Jul 18', count: 3 },
  { date: 'Jul 19', count: 7 },
  { date: 'Jul 20', count: 5 },
  { date: 'Jul 21', count: 9 },
  { date: 'Jul 22', count: 6 },
  { date: 'Jul 23', count: 10 },
  { date: 'Jul 24', count: 4 },
];

const barColors = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#f87171'];

const RiderActivityChart = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Rider Daily Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
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
