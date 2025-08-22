"use client";

import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, DownloadIcon, EyeIcon, XIcon, ChevronLeft, ChevronRight, MoreHorizontal, FileSignature, User, CreditCard, WalletCards, MapPin, Package, Truck, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { GETDELIVERIESADMIN } from '../../../graphql/query';
import { capitalize, formatDate } from '../../../utils/decryptToken';
import FilterBar from "./Rider/Filterbar";
import Image from 'next/image';

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

// Proof of Pickup/Delivery Card Component
const ProofCard = ({ proof, type }: { proof: any; type: string }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow mb-4">
    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
      {type === 'pickup' ? (
        <>
          <Package className="h-5 w-5 text-blue-500" />
          PICKUP PROOF - {formatDate(proof.pickupDateTime)}
        </>
      ) : (
        <>
          <Truck className="h-5 w-5 text-green-500" />
          DELIVERY PROOF - {formatDate(proof.createdAt)}
        </>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Customer Name</div>
          <div className="font-medium">{proof.customerName || 'N/A'}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Address</div>
          <div className="font-medium">{proof.pickupAddress || 'N/A'}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Package Condition</div>
          <div className="font-medium">{proof.packageCondition || 'N/A'}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500 mb-1">Number of Packages</div>
          <div className="font-medium">{proof.numberOfPackages || 'N/A'}</div>
        </div>
        
        {proof.remarks && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Remarks</div>
            <div className="font-medium">{proof.remarks}</div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {proof.proofPhotoUrl && (
          <div>
            <div className="text-xs text-gray-500 mb-2">Proof Photo</div>
            <div className="relative h-48 w-full rounded-lg overflow-hidden border">
              <Image
                src={proof.proofPhotoUrl}
                alt="Proof photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        
        {proof.customerSignature && (
          <div>
            <div className="text-xs text-gray-500 mb-2">Customer Signature</div>
            <div className="relative h-24 w-full bg-gray-50 rounded-lg p-2 border border-gray-200">
              <Image
                src={proof.customerSignature}
                alt="Signature"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Payment Information Component
const PaymentInfo = ({ delivery }: { delivery: any }) => {
  const deliveryFee = parseFloat(delivery.deliveryFee) || 0;
  const baseRate = parseFloat(delivery.baseRate) || 0;
  const perKmRate = parseFloat(delivery.perKmRate) || 0;
  const distance = parseFloat(delivery.distance) || 0;
  const calculatedFee = baseRate + (perKmRate * distance);
  
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow">
      <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-gray-200 pb-2 mb-4">
        <CreditCard className="h-5 w-5 text-purple-500" />
        PAYMENT INFORMATION
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Payment Status</div>
            <div className="font-medium">
              <Badge variant={
                delivery.paymentStatus === 'Paid' ? 'success' : 
                delivery.paymentStatus === 'Pending' ? 'outline' : 
                'destructive'
              }>
                {delivery.paymentStatus || 'N/A'}
              </Badge>
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1">Payment Method</div>
            <div className="font-medium">{delivery.paymentMethod || 'N/A'}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1">Delivery Fee</div>
            <div className="font-medium">${deliveryFee.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Base Rate</div>
            <div className="font-medium">${baseRate.toFixed(2)}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1">Distance</div>
            <div className="font-medium">{distance.toFixed(2)} km</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 mb-1">Per Km Rate</div>
            <div className="font-medium">${perKmRate.toFixed(2)}/km</div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Calculated Fee</div>
            <div className="font-medium text-lg text-green-600">${calculatedFee.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [originalDeliveries, setOriginalDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, loading } = useQuery(GETDELIVERIESADMIN);

  useEffect(() => {
    if (data) {
      const formattedDeliveries = data.getDeliveries.map((delivery: any) => ({
        ...delivery,
        estimatedDeliveryTime: formatDate(delivery.estimatedDeliveryTime),
        actualDeliveryTime: formatDate(delivery.actualDeliveryTime),
        createdAt: formatDate(delivery.createdAt),
        packages: delivery.packages || [],
      }));
      
      setOriginalDeliveries(formattedDeliveries);
      setFilteredDeliveries(formattedDeliveries);
      setCurrentPage(1);
    }
  }, [data]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    if (!search && !date) {
      setFilteredDeliveries(originalDeliveries);
      setCurrentPage(1);
      return;
    }

    const result = originalDeliveries.filter((d: any) => {
      const searchMatch = search 
        ? d.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
          (d.recipientName && d.recipientName.toLowerCase().includes(search.toLowerCase())) ||
          (d.assignedRider?.name && d.assignedRider.name.toLowerCase().includes(search.toLowerCase()))
        : true;

      const dateMatch = date
        ? new Date(d.createdAt).toDateString() === date.toDateString()
        : true;

      return searchMatch && dateMatch;
    });

    setFilteredDeliveries(result);
    setCurrentPage(1);
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading || !data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
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
              setCurrentPage(1);
            }}
            className="border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="grid gap-4">
          {currentDeliveries.map((delivery: any) => (
            <Card key={delivery.id} className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">
                    {delivery.createdAt}
                  </div>
                  <div className="font-semibold text-gray-900">{delivery.trackingNumber}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    To: {delivery.recipientName} • {delivery.dropoffAddress}
                  </div>
                  <div className="text-sm text-gray-600">
                    Rider: {delivery.assignedRider?.name || 'Unassigned'}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      delivery.deliveryStatus === "Delivered"
                        ? "success"
                        : delivery.deliveryStatus === "In_transit"
                        ? "secondary"
                        : delivery.deliveryStatus === "Pending"
                        ? "outline"
                        : delivery.deliveryStatus === "Cancelled"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {delivery.deliveryStatus}
                  </Badge>
                  <Button
                    className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                    onClick={() => {
                      setSelectedDelivery(delivery);
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDeliveries.length)} of {filteredDeliveries.length} transactions
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

        {/* Empty State */}
        {filteredDeliveries.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileSignature className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new delivery.</p>
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
            <h2 className="text-lg font-semibold text-gray-900">Transaction Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
          
          {selectedDelivery && (
            <div className="relative bg-gradient-to-br from-white to-blue-50 overflow-y-auto min-h-full p-4">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full filter blur-[100px] opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full filter blur-[100px] opacity-40"></div>
              
              <div className="p-6 border-b border-blue-200 bg-gradient-to-r from-white to-blue-50 rounded-t-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                      <p className="text-xs text-blue-600">Complete delivery information</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      selectedDelivery.deliveryStatus === 'Delivered' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedDelivery.deliveryStatus === 'In_transit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedDelivery.deliveryStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedDelivery.deliveryStatus}
                    </span>
                    
                    <span className="px-3 py-1 bg-blue-100 rounded-full text-xs font-semibold text-blue-800 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedDelivery.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 text-gray-700">
                <div className="bg-white rounded-xl p-5 border border-blue-200 shadow">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    TRACKING NUMBER
                  </div>
                  <div className="font-mono text-lg font-bold text-gray-900 tracking-wider px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
                    {selectedDelivery.trackingNumber}
                  </div>
                </div>

                {/* Package Details */}
                {selectedDelivery.packages && selectedDelivery.packages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-blue-200 pb-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      PACKAGE DETAILS
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDelivery.packages.map((item: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-5 border border-blue-200 shadow">
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

                {/* Delivery Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-blue-200 pb-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    DELIVERY INFORMATION
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailCard 
                      icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      label="Receiver"
                      value={selectedDelivery.recipientName}
                    />
                    <DetailCard 
                      icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      label="Drop-off Address"
                      value={selectedDelivery.dropoffAddress}
                    />
                    <DetailCard 
                      icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      label="Pickup Address"
                      value={selectedDelivery.pickupAddress}
                    />
                    <DetailCard 
                      icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      label="Estimated Delivery"
                      value={selectedDelivery.estimatedDeliveryTime || "N/A"}
                    />
                  </div>
                </div>

                {/* Rider Information */}
                {selectedDelivery.assignedRider && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-blue-200 pb-2">
                      <User className="h-5 w-5 text-blue-500" />
                      RIDER INFORMATION
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailCard 
                        icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        label="Rider Name"
                        value={selectedDelivery.assignedRider.name}
                      />
                      <DetailCard 
                        icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        label="Phone Number"
                        value={selectedDelivery.assignedRider.phoneNumber}
                      />
                      <DetailCard 
                        icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        label="Status"
                        value={selectedDelivery.assignedRider.status}
                      />
                      {selectedDelivery.assignedRider.vehicleType && (
                        <DetailCard 
                          icon="M5 13l4 4L19 7"
                          label="Vehicle Type"
                          value={selectedDelivery.assignedRider.vehicleType.name}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Proof of Pickup */}
                {selectedDelivery.proofOfPickup && selectedDelivery.proofOfPickup.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-blue-200 pb-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      PROOF OF PICKUP
                    </div>
                    
                    {selectedDelivery.proofOfPickup.map((proof: any, index: number) => (
                      <ProofCard key={index} proof={proof} type="pickup" />
                    ))}
                  </div>
                )}

                {/* Proof of Delivery */}
                {selectedDelivery.proofOfDelivery && selectedDelivery.proofOfDelivery.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm uppercase tracking-wider border-b border-blue-200 pb-2">
                      <Truck className="h-5 w-5 text-blue-500" />
                      PROOF OF DELIVERY
                    </div>
                    
                    {selectedDelivery.proofOfDelivery.map((proof: any, index: number) => (
                      <ProofCard key={index} proof={proof} type="delivery" />
                    ))}
                  </div>
                )}

                {/* Payment Information */}
                <PaymentInfo delivery={selectedDelivery} />
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
