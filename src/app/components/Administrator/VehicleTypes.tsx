'use client';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent } from '../ui/Card';
import { Loader2, AlertTriangle, Plus, X } from 'lucide-react';
import { VEHICLEQUERY, CREATE_VEHICLE_MUTATION } from '../../../../graphql/query';

export default function VehicleTypes() {
  const { data, loading, error } = useQuery(VEHICLEQUERY);
  const [createVehicle] = useMutation(CREATE_VEHICLE_MUTATION, {
    refetchQueries: [{ query: VEHICLEQUERY }],
  });
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    maxCapacityKg: '',
    maxVolumeM3: '',
    cost: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVehicle({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            icon: formData.icon,
            maxCapacityKg: parseInt(formData.maxCapacityKg),
            maxVolumeM3: parseFloat(formData.maxVolumeM3),
            cost: parseFloat(formData.cost)
          }
        }
      });
      setFormData({
        name: '',
        description: '',
        icon: '',
        maxCapacityKg: '',
        maxVolumeM3: '',
        cost: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating vehicle:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="animate-spin w-6 h-6" />
    </div>
  );
  
  if (error) return (
    <div className="text-red-600 flex items-center gap-2 p-4 bg-red-50 rounded-lg">
      <AlertTriangle className="w-5 h-5" />
      Failed to load vehicle types
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Vehicle Fleet</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>

        {/* Insert Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Add New Vehicle</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Icon Identifier</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity (kg)</label>
                <input
                  type="number"
                  name="maxCapacityKg"
                  value={formData.maxCapacityKg}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Volume (m³)</label>
                <input
                  type="number"
                  step="0.01"
                  name="maxVolumeM3"
                  value={formData.maxVolumeM3}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Cost (₱)</label>
                <input
                  type="number"
                  step="0.01"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Vehicle
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data?.getVehicleTypes?.map((vehicle: any) => (
            <Card key={vehicle.id} className="shadow-md border rounded-xl p-3">
              <CardContent className="flex flex-col gap-2 p-0">
                <div className="flex items-center gap-2">
                  <Icon icon={vehicle.icon} style={{ height: '32px', width: '32px' }} />
                  <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{vehicle.description}</p>
                <div className="text-sm text-gray-800">
                  <p><strong>Capacity:</strong> {vehicle.maxCapacityKg} kg</p>
                  <p><strong>Volume:</strong> {vehicle.maxVolumeM3} m³</p>
                  <p><strong>Base Rate:</strong> ₱{vehicle.cost}</p>
                  <p><strong>Per Km Rate:</strong> ₱10</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
