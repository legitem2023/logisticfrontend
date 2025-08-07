"use client";

import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

import { useSelector } from 'react-redux';

import { selectTempUserId } from '../../../Redux/tempUserSlice';


import { CalendarIcon, DownloadIcon, EyeIcon, XIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import { DELIVERIES } from '../../../graphql/query';
import { decryptToken, capitalize, formatDate } from '../../../utils/decryptToken';
import FilterBar from "./Rider/Filterbar";
export default function RiderShipmentHistory({status}:any) {
  const [useID, setID] = useState();
  const [search, setSearch] = useState("");
  const [useStatus,setStatus] = useState(status);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [originalDeliveries, setOriginalDeliveries] = useState([]);


const globalUserId = useSelector(selectTempUserId);
  const { data, loading } = useQuery(DELIVERIES, {
    variables: { getNotificationsId: globalUserId }
  });

console.log(status,data);

useEffect(() => {
  if (data) {
    const mockShipment = data.getRidersDelivery.filter((delivery: any) => delivery.deliveryStatus === status).map((delivery: any) => ({
      trackingNumber: delivery.trackingNumber, 
      id: delivery.id, 
      sender: delivery.sender.name, 
      phoneNumber: delivery.sender.phoneNumber, 
      pickupAddress: delivery.pickupAddress, 
      pickupLatitude: delivery.pickupLatitude, 
      pickupLongitude: delivery.pickupLongitude, 
      recipientName: delivery.recipientName, 
      recipientPhone: delivery.recipientPhone, 
      dropoffAddress: delivery.dropoffAddress, 
      dropoffLatitude: delivery.dropoffLatitude, 
      dropoffLongitude: delivery.dropoffLongitude, 
      deliveryStatus: capitalize(delivery.deliveryStatus), 
      estimatedDeliveryTime: formatDate(delivery.estimatedDeliveryTime), 
      earnings: "120.00", 
    }));
    setOriginalDeliveries(data.getRidersDelivery);
    setFilteredDeliveries(data.getRidersDelivery);
  }
}, [data,status]);



const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
  // Reset to original data if filters are empty
  if (!search && !date) {
    setFilteredDeliveries(originalDeliveries);
    return;
  }

const result = filteredDeliveries.filter((d) => {
    // Search filter (case insensitive)
    const searchMatch = search 
      ? d.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.recipientName.toLowerCase().includes(search.toLowerCase()) ||
        d.sender.toLowerCase().includes(search.toLowerCase())
      : true;

    // Date filter
    const dateMatch = date
      ? new Date(d.estimatedDeliveryTime).toDateString() === date.toDateString()
      : true;

    return searchMatch && dateMatch;
  });

  setFilteredDeliveries(result);
  
  // Optional: Show message when no results found
  if (result.length === 0) {
    // showToast("No deliveries match your filters", "info");
  }
};
  if (loading || !data) return null;
  const selectData = (data:any) =>{
    console.log(data,"<<<<<<");
    setSelectedShipment(data);
  }
  return (
    <>
      <div className="relative p-1 space-y-4">
        <FilterBar onFilter={handleFilter}/>

        <div className="grid gap-4">
          {filteredDeliveries.map((shipment) => (
            <Card key={shipment.id} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                <div>
                  <div className="text-sm text-gray-800">
                    {shipment.date}
                  </div>
                  <div className="font-semibold text-gray-900">{shipment.trackingNumber}</div>
                  <div className="text-sm text-gray-800">
                    To: {shipment.recipientName} ({shipment.dropoffAddress})
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      shipment.deliveryStatus === "Delivered"
                        ? "success"
                        : shipment.deliveryStatus === "In_transit"
                        ? "secondary"
                        : shipment.deliveryStatus === "Pending"
                        ? "outline"
                        : shipment.deliveryStatus === "Cancelled"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {shipment.deliveryStatus}
                  </Badge>
                  <Button
                    className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={() => {
                      selectData(shipment);
                      setDrawerOpen(true);
                    }}
                  >
                    <EyeIcon className="w-4 h-4" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                    <DownloadIcon className="w-4 h-4" /> Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sliding Drawer (Bottom) */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white shadow-t-lg transform transition-transform duration-300 ease-in-out z-50
            ${drawerOpen ? "translate-y-0" : "translate-y-full"}
            h-1/2 sm:h-[300px] rounded-t-2xl border-t
          `}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
          {selectedShipment && (
            <div className="p-4 space-y-3 text-sm text-gray-900 overflow-y-auto">
              <div><strong>Tracking ID:</strong> {selectedShipment.trackingNumber}</div>

              {
                selectedShipment.packages.map((item:any,i:number)=>(
                  <div key={i}>
                    <div><strong>Package Type:</strong> {item.packageType}</div>
                    <div><strong>Dimension :</strong> {item.dimensions}</div>
                    <div><strong>Weight:</strong> {item.weight}</div>
                    <div><strong>Instructions :</strong> {item.specialInstructions}</div>
                  </div>
                ))
              }
              <div><strong>Receiver:</strong> {selectedShipment.recipientName}</div>
              <div><strong>Drop-off Address:</strong> {selectedShipment.dropoffAddress}</div>
              <div><strong>Status:</strong> {selectedShipment.DeliveryStatus}</div>
              <div><strong>Date:</strong> {selectedShipment.estimatedDeliveryTime}</div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="absolute top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
