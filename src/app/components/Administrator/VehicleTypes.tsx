'use client';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '../ui/Card';
import { Loader2, AlertTriangle, Search, Filter, X } from 'lucide-react';
import { VEHICLEQUERY } from '../../../../graphql/query';

export default function VehicleTypes() {
  const { data, loading, error } = useQuery(VEHICLEQUERY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minCapacity: '',
    maxCapacity: '',
    minVolume: '',
    maxVolume: '',
    sortBy: 'name'
  });
  const [showFilters, setShowFilters] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin w-8 h-8 text-gold-600" />
    </div>
  );
  
  if (error) return (
    <div className="text-red-600 flex items-center gap-2 p-6 bg-red-50 rounded-xl border border-red-200 max-w-2xl mx-auto">
      <AlertTriangle className="w-6 h-6" />
      Failed to load vehicle types
    </div>
  );

  // Filter and sort logic
  const filteredVehicles = data?.getVehicleTypes?.filter((vehicle: any) => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vehicle.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = (!filters.minCapacity || vehicle.maxCapacityKg >= parseInt(filters.minCapacity)) &&
                           (!filters.maxCapacity || vehicle.maxCapacityKg <= parseInt(filters.maxCapacity));
    
    const matchesVolume = (!filters.minVolume || vehicle.maxVolumeM3 >= parseInt(filters.minVolume)) &&
                         (!filters.maxVolume || vehicle.maxVolumeM3 <= parseInt(filters.maxVolume));
    
    return matchesSearch && matchesCapacity && matchesVolume;
  }).sort((a: any, b: any) => {
    if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
    if (filters.sortBy === 'capacity') return b.maxCapacityKg - a.maxCapacityKg;
    if (filters.sortBy === 'volume') return b.maxVolumeM3 - a.maxVolumeM3;
    if (filters.sortBy === 'cost') return a.cost - b.cost;
    return 0;
  });

  const clearFilters = () => {
    setFilters({
      minCapacity: '',
      maxCapacity: '',
      minVolume: '',
      maxVolume: '',
      sortBy: 'name'
    });
    setSearchTerm('');
  };

  const hasActiveFilters = searchTerm || filters.minCapacity || filters.maxCapacity || 
                          filters.minVolume || filters.maxVolume || filters.sortBy !== 'name';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Premium Vehicle Fleet</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our luxurious selection of vehicles, each meticulously maintained and perfectly suited for your transportation needs.
          </p>
        </div>

        {/* Search and Filter Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vehicles by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Capacity (kg)</label>
                <input
                  type="number"
                  value={filters.minCapacity}
                  onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity (kg)</label>
                <input
                  type="number"
                  value={filters.maxCapacity}
                  onChange={(e) => setFilters({...filters, maxCapacity: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Min Volume (m³)</label>
                <input
                  type="number"
                  value={filters.minVolume}
                  onChange={(e) => setFilters({...filters, minVolume: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Volume (m³)</label>
                <input
                  type="number"
                  value={filters.maxVolume}
                  onChange={(e) => setFilters({...filters, maxVolume: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="capacity">Capacity</option>
                  <option value="volume">Volume</option>
                  <option value="cost">Price</option>
                </select>
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">
                {filteredVehicles.length} vehicle(s) match your criteria
              </span>
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles?.map((vehicle: any) => (
            <Card key={vehicle.id} className="overflow-hidden transition-all duration-300 hover:scale-[1.02] group border-0 shadow-lg rounded-2xl">
              <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <Icon 
                  icon={vehicle.icon} 
                  style={{ height: '80px', width: '80px' }} 
                  className="text-white"
                />
              </div>
              <CardContent className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{vehicle.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    ₱{vehicle.cost}
                  </span>
                </div>
                <p className="text-slate-600 mb-5">{vehicle.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-slate-500">Capacity</div>
                    <div className="font-semibold text-slate-800">{vehicle.maxCapacityKg} kg</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-slate-500">Volume</div>
                    <div className="font-semibold text-slate-800">{vehicle.maxVolumeM3} m³</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-slate-500">Base Rate</div>
                    <div className="font-semibold text-slate-800">₱{vehicle.cost}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-slate-500">Per Km</div>
                    <div className="font-semibold text-slate-800">₱10</div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                  Select Vehicle
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-2">No vehicles match your search criteria</div>
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
