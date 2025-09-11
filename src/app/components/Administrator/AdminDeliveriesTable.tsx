'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GETDELIVERIESADMIN, RIDERS } from '../../../../graphql/query';
import { ASSIGNRIDER } from '../../../../graphql/mutation';
import AdminDeliveriesLoading from "../Loadings/AdminDeliveriesLoading";
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useState, useEffect } from 'react';
import FilterBar from "../Rider/Filterbar";
import { PackageCheck, User, Phone, MapPin, Truck, BadgeCheck, CreditCard } from "lucide-react";
import Collapsible from "../ui/Collapsible";

const AdminDeliveriesTable = () => {
  const { data, loading, error, refetch } = useQuery(GETDELIVERIESADMIN);
  const { data: ridersData } = useQuery(RIDERS);
  const [assignRider] = useMutation(ASSIGNRIDER, {
    onCompleted: (e) => {
      console.log(e);
    },
  });

  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);

  const handleAssignRider = async (deliveryId: string, riderId: string) => {
    try {
      await assignRider({
        variables: {
          deliveryId,
          riderId,
        },
        refetchQueries: [GETDELIVERIESADMIN],
      });
    } catch (err) {
      console.error('Failed to assign rider:', err);
    }
  };

  const deliveries = data?.getDeliveries.filter((delivery: any) => delivery.assignedRiderId === null) ?? [];
  const riders = ridersData?.getRiders ?? [];

  // Set deliveries when fetched
  useEffect(() => {
    if (deliveries.length) {
      setFilteredDeliveries(deliveries);
    }
  }, [deliveries]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    let filtered = [...deliveries];

    if (search) {
      filtered = filtered.filter(delivery =>
        delivery.trackingNumber?.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (date) {
      const filterDate = new Date(date);
      filtered = filtered.filter(delivery => {
        const deliveryDate = new Date(delivery.createdAt);
        return (
          deliveryDate.getFullYear() === filterDate.getFullYear() &&
          deliveryDate.getMonth() === filterDate.getMonth() &&
          deliveryDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredDeliveries(filtered);
  }

  if (loading) return <AdminDeliveriesLoading />;

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error fetching deliveries: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full p-0">
      <FilterBar onFilter={handleFilter} />
      
      {/* Mobile View - Cards */}
      <div className="block md:hidden">
        {filteredDeliveries.map((delivery: any) => (
          <Card key={delivery.id} className="border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4">
            <CardContent className="p-6 space-y-2 text-sm text-zinc-800">
              {/* Mobile card content remains the same */}
              <div className="flex justify-between items-center font-mono text-xs text-zinc-500">
                <span className="font-semibold">📦 Tracking:</span>
                <span>{delivery.trackingNumber}</span>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <User size={14} /> Recipient
                </p>
                <p>{delivery.recipientName}</p>
                <p className="text-xs text-zinc-400 flex items-center gap-1"><Phone size={12} /> {delivery.recipientPhone}</p>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <MapPin size={14} /> Pickup
                </p>
                <p className="text-xs text-zinc-500">{delivery.pickupAddress}</p>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <MapPin size={14} /> Dropoff
                </p>
                <p className="text-xs text-zinc-500">{delivery.dropoffAddress}</p>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <BadgeCheck size={14} /> Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{delivery.deliveryStatus}</Badge>
                  {delivery.isCancelled && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <Truck size={14} /> Rider
                </p>
                {delivery.assignedRider ? (
                  <div className="text-sm text-zinc-700">
                    {delivery.assignedRider.name}
                    <br />
                    <span className="text-xs text-zinc-400">
                      {delivery.assignedRider.phoneNumber}
                    </span>
                  </div>
                ) : (
                  <select
                    className="w-full mt-1 text-sm border border-zinc-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignRider(delivery.id, e.target.value);
                      }
                    }}
                  >
                    <option value="" disabled>Select a rider</option>
                    {riders.map((rider: any) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name} ({rider.phoneNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <User size={14} /> Sender
                </p>
                <p className="text-sm text-zinc-700">{delivery.sender?.name}</p>
                <p className="text-xs text-zinc-400">{delivery.sender?.phoneNumber}</p>
              </div>

              <div className="border rounded-xl p-4 shadow-sm bg-white space-y-2">
                <div className="flex justify-between text-sm font-medium text-zinc-700">
                  <span>Base Rate</span>
                  <span className="text-right">
                    ₱{(delivery.baseRate ?? 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-medium text-zinc-700">
                  <span>Distance</span>
                  <span className="text-right">
                    {delivery.distance ?? 0} km
                  </span>
                </div>

                <div className="flex justify-between text-sm font-medium text-zinc-700">
                  <span>Per KM Rate</span>
                  <span className="text-right">
                    ₱{(delivery.perKmRate ?? 0).toFixed(2)}
                  </span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between text-sm font-bold text-zinc-900">
                  <span>Total</span>
                  <span className="text-right">
                    ₱{(
                      (delivery.baseRate ?? 0) +
                      ((delivery.distance ?? 0) * (delivery.perKmRate ?? 0))
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
                  <CreditCard size={14} /> Payment
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600">{delivery.paymentMethod}</span>
                  <Badge variant={delivery.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {delivery.paymentStatus}
                  </Badge>
                </div>
              </div>

              {delivery.packages?.length > 0 && (
                <Collapsible title={`Packages (${delivery.packages.length})`}>
                  <div className="space-y-3 pt-2">
                    {delivery.packages.map((pkg: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3 text-sm text-zinc-600 bg-zinc-50 shadow-sm">
                        <p><strong>Type:</strong> {pkg.packageType}</p>
                        <p><strong>Weight:</strong> {pkg.weight}kg</p>
                        <p><strong>Dimensions:</strong> {pkg.dimensions}</p>
                        <p className="text-xs text-zinc-400 italic">{pkg.specialInstructions}</p>
                      </div>
                    ))}
                  </div>
                </Collapsible>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full">
          <thead className="bg-zinc-100">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Tracking</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Recipient</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Pickup</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Dropoff</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Rider</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Sender</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Payment</th>
              <th className="p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {filteredDeliveries.map((delivery: any) => (
              <tr key={delivery.id} className="hover:bg-zinc-50">
                <td className="p-3 text-sm text-zinc-900">{delivery.trackingNumber}</td>
                <td className="p-3 text-sm text-zinc-900">
                  <div>{delivery.recipientName}</div>
                  <div className="text-zinc-500">{delivery.recipientPhone}</div>
                </td>
                <td className="p-3 text-sm text-zinc-900 max-w-xs truncate">{delivery.pickupAddress}</td>
                <td className="p-3 text-sm text-zinc-900 max-w-xs truncate">{delivery.dropoffAddress}</td>
                <td className="p-3 text-sm text-zinc-900">
                  <Badge variant="outline">{delivery.deliveryStatus}</Badge>
                  {delivery.isCancelled && (
                    <Badge variant="destructive" className="ml-1">Cancelled</Badge>
                  )}
                </td>
                <td className="p-3 text-sm text-zinc-900">
                  {delivery.assignedRider ? (
                    <div>
                      <div>{delivery.assignedRider.name}</div>
                      <div className="text-zinc-500">{delivery.assignedRider.phoneNumber}</div>
                    </div>
                  ) : (
                    <select
                      className="w-full text-sm border border-zinc-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignRider(delivery.id, e.target.value);
                        }
                      }}
                    >
                      <option value="" disabled>Select a rider</option>
                      {riders.map((rider: any) => (
                        <option key={rider.id} value={rider.id}>
                          {rider.name} ({rider.phoneNumber})
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="p-3 text-sm text-zinc-900">
                  <div>{delivery.sender?.name}</div>
                  <div className="text-zinc-500">{delivery.sender?.phoneNumber}</div>
                </td>
                <td className="p-3 text-sm text-zinc-900">
                  <div>{delivery.paymentMethod}</div>
                  <Badge variant={delivery.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {delivery.paymentStatus}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-zinc-900">
                  <button className="text-indigo-600 hover:text-indigo-900 text-xs font-medium">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDeliveriesTable;
