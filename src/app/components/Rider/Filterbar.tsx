'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function FilterBar({ onFilter }: { onFilter: (filters: { search: string; date: Date | null }) => void }) {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleFilterChange = (searchVal: string, dateVal: Date | null) => {
    onFilter({ search: searchVal, date: dateVal });
  };

const handleClear = () => {
  setSearch('');
  setSelectedDate(null);
  onFilter({ search: '', date: null }); // ⬅ this triggers full data reset
};


  return (
    <div className="customgrad flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 shadow-sm">
      <Input
        placeholder="🔍 Search Delivery ID"
        value={search}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
          handleFilterChange(val, selectedDate);
        }}
        className="w-full sm:max-w-xs"
      />

      <div className="flex items-center gap-2">
        <DatePicker
          selected={selectedDate}
          onChange={(date:any) => {
            setSelectedDate(date);
            handleFilterChange(search, date);
          }}
          placeholderText="📅 Filter by Date"
          className="border px-2 py-1 rounded-md text-sm"
        />
        {/* <Button variant="outline" className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
        </Button> */}
      </div>
    </div>
  );
}
