"use client";

import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { CalendarIcon, DownloadIcon, EyeIcon, XIcon, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GETDISPATCH } from '../../../graphql/query';
import { capitalize, formatDate } from '../../../utils/decryptToken';
import FilterBar from "./Rider/Filterbar";

// Reusable DetailItem Component
const DetailItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="col-span-1">
    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {label}
    </div>
    <div className="font-medium text-gray-900 pl-6 truncate">{value}</div>
  </div>
);

// Reusable DetailCard Component
const DetailCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow">
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {label}
    </div>
    <div className="font-medium text-gray-900 pl-6">{value}</div>
  </div>
);

export default function SenderShipmentHistory({ status }: any) {
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [originalDeliveries, setOriginalDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const globalUserId = useSelector(selectTempUserId);
  const { data, loading } = useQuery(GETDISPATCH, {
    variables: { id: globalUserId }
  });

  useEffect(() => {
    if (data) {
      const formattedDeliveries = data.getDispatch.filter((del:any)=>del.deliveryStatus === status).map((delivery: any) => ({
        ...delivery,
        deliveryStatus: capitalize(delivery.deliveryStatus),
        estimatedDeliveryTime: formatDate(delivery.estimatedDeliveryTime),
        packages: delivery.packages || [],
      }));
      
      setOriginalDeliveries(formattedDeliveries);
      setFilteredDeliveries(formattedDeliveries);
    }
  }, [data]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    if (!search && !date) {
      setFilteredDeliveries(originalDeliveries);
      setCurrentPage(1); // Reset to first page when filters are cleared
      return;
    }

    const result = originalDeliveries.filter((d: any) => {
      const searchMatch = search 
        ? d.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
          (d.recipientName && d.recipientName.toLowerCase().includes(search.toLowerCase()))
        : true;

      const dateMatch = date
        ? new Date(d.estimatedDeliveryTime).toDateString() === date.toDateString()
        : true;

      return searchMatch && dateMatch;
    });

    setFilteredDeliveries(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = originalDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(originalDeliveries.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading || !data) return null;
  
  return (
    <>
      <div className="relative p-1 space-y-4">
        <FilterBar onFilter={handleFilter} />

        {/* Items Per Page Selector */}
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-gray-600">Items per page:</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="grid gap-4">
          {currentDeliveries.map((shipment: any) => (
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
                    className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-700"
                    size="sm"
                    onClick={() => {
                      setSelectedShipment(shipment);
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

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDeliveries.length)} of {filteredDeliveries.length} shipments
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* First Page */}
              {currentPage > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Button>
              )}
              
              {/* Ellipsis for skipped pages */}
              {currentPage > 3 && (
                <Button variant="ghost" size="sm" disabled className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
              
              {/* Previous Page */}
              {currentPage > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </Button>
              )}
              
              {/* Current Page */}
              <Button
                variant="default"
                size="sm"
              >
                {currentPage}
              </Button>
              
              {/* Next Page */}
              {currentPage < totalPages - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </Button>
              )}
              
              {/* Ellipsis for skipped pages */}
              {currentPage < totalPages - 2 && (
                <Button variant="ghost" size="sm" disabled className="px-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
              
              {/* Last Page */}
              {currentPage < totalPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Sliding Drawer */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white shadow-t-lg transform transition-transform duration-300 ease-in-out z-50
            ${drawerOpen ? "translate-y-0" : "translate-y-full"}
            h-[85vh] rounded-t-2xl border-t overflow-hidden
          `}
        >
          <div className="flex justify-between items-center p-4 border-b bg-white">
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
            <div className="relative bg-gradient-to-br from-white to-green-50 overflow-hidden min-h-full p-4">
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full filter blur-[100px] opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-100 rounded-full filter blur-[100px] opacity-40"></div>
              
              <div className="p-6 border-b border-green-200 bg-gradient-to-r from-white to-green-50 rounded-t-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Shipment Details</h2>
                      <p className="text-xs text-green-600">Premium tracking information</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      selectedShipment.deliveryStatus === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedShipment.deliveryStatus === 'In Transit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedShipment.deliveryStatus}
                    </span>
                    
                    <span className="px-3 py-1 bg-green-100 rounded-full text-xs font-semibold text-green-800 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedShipment.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 text-gray-700 overflow-y-auto max-h-[60vh]">
                <div className="bg-white rounded-xl p-5 border border-green-200 shadow">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    TRACKING NUMBER
                  </div>
                  <div className="font-mono text-lg font-bold text-gray-900 tracking-wider px-4 py-3 rounded-lg bg-green-50 border border-green-200">
                    {selectedShipment.trackingNumber}
                  </div>
                </div>

                {selectedShipment.packages && selectedShipment.packages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-green-200 pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      PACKAGE DETAILS
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedShipment.packages.map((item: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-green-200 shadow">
                          <div className="grid grid-cols-2 gap-4">
                            <DetailItem 
                              icon="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              label="Package Type" 
                              value={item.packageType || "N/A"}
                            />
                            <DetailItem 
                              icon="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                              label="Dimensions" 
                              value={item.dimensions || "N/A"}
                            />
                            <DetailItem 
                              icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              label="Weight" 
                              value={item.weight || "N/A"}
                            />
                            <DetailItem 
                              icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              label="Instructions" 
                              value={item.specialInstructions || "None"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-green-200 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    DELIVERY INFORMATION
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailCard 
                      icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      label="Receiver"
                      value={selectedShipment.recipientName}
                    />
                    <DetailCard 
                      icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      label="Drop-off Address"
                      value={selectedShipment.dropoffAddress}
                    />
                    <div className="h-[80px]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
          }
