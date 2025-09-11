'use client';

import { useState, useEffect, useMemo } from "react"; 
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button"; 
import Collapsible from "../ui/Collapsible";
import ProofOfPickupCard from "../Rider/ProofOfPickupCard";
import { 
  Clock, MapPin, Bike, Compass, XCircle, FileSignature, 
  User, Truck, WalletCards, CreditCard, Code  
} from "lucide-react";
import HistoryContainer from "../History/HistoryContainer"; 
import { calculateEta, convertMinutesToHours } from '../../../../utils/calculateEta';

import { LocationTracking } from '../../../../graphql/subscription';
import Image from 'next/image';
import { CANCELEDDELIVERY } from "../../../../graphql/mutation"; 
import { useMutation, useQuery, useSubscription } from "@apollo/client"; 
import { showToast } from '../../../../utils/toastify'; 
import { GETDISPATCH } from '../../../../graphql/query';
import CreatePackageForm from "./CreatePackageForm";
import { useSelector } from "react-redux";
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { formatDate } from '../../../../utils/decryptToken';
import FilterBar from "../Rider/Filterbar";
import SenderDashboardLoading from "./SenderDashboardLoading";
import dynamic from "next/dynamic";

const SenderMap = dynamic(() => import("./SenderMap"), { ssr: false });

export default function SenderDashboard() {
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("Deliveries"); 
  const [showMap, setMap] = useState(false); 
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null); 

  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: selectedDelivery?.assignedRiderId },
    skip: !selectedDelivery?.assignedRiderId,
  });

  const [cancelDelivery] = useMutation(CANCELEDDELIVERY, {
    onCompleted: () => {
      showToast("Delivery Cancelled", "success");
      refetch();
    },
    onError: (e: any) => console.error('Cancel Error', e)
  });

  const openMap = (delivery: any) => { 
    setSelectedDelivery(delivery); 
    setMap(true); 
  };

  const { data, loading, error, refetch } = useQuery(GETDISPATCH, {
    variables: { getDispatchId: globalUserId },
    skip: !globalUserId,
  });

  const acceptedDeliveries = useMemo(() => 
    data?.getDispatch?.filter(
      (delivery: any) => delivery.deliveryStatus !== "Delivered" && delivery.deliveryStatus !== "Cancelled"
    ) || [],
    [data]
  );

  const filteredDeliveries = useMemo(() => {
    let result = [...acceptedDeliveries];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(delivery =>
        delivery.trackingNumber?.toLowerCase().includes(searchLower) ||
        delivery.assignedRider?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedDate) {
      const targetDate = new Date(selectedDate).toDateString();
      result = result.filter(delivery => 
        new Date(Number(delivery.createdAt)).toDateString() === targetDate
      );
    }

    return result;
  }, [acceptedDeliveries, searchTerm, selectedDate]);

  useEffect(() => {
    refetch();
  }, [GlobalactiveIndex, refetch]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    setSearchTerm(search);
    setSelectedDate(date);
  };

  const handleCancel = (delivery: any) => {
    const confirmCancel = confirm("Are you sure you want to cancel this delivery?");
    if (confirmCancel) {
      cancelDelivery({
        variables: {
          deliveryId: delivery.id,
          riderId: delivery.assignedRiderId
        }
      });
    }
  };

  const tabs = [
    { label: "Deliveries", icon: Truck },
    { label: "History", icon: Clock }
  ];
  
  return (
    <div className="w-full bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-10 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-2">
        <nav> 
          <ul className="space-y-4 text-[15px] font-medium">
            {tabs.map(({ label, icon: Icon }) => (
              <li
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-all duration-200 ${
                  activeTab === label
                    ? 'customgrad text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
              </li>
            ))}
          </ul>
        </nav> 
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-0">
        {activeTab === "Deliveries" && <FilterBar onFilter={handleFilter} />}

        {loading ? (
          <SenderDashboardLoading/>
        ) : error ? (
          <div className="text-center mt-8 text-red-500">Error loading deliveries</div>
        ) : (
          <>
            {activeTab === "Deliveries" && filteredDeliveries.length === 0 && (
              <div className="text-center mt-8 text-gray-500">No deliveries found</div>
            )}
            <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-0">
              {activeTab === "Deliveries" && filteredDeliveries.map(delivery => (
                <Card
                  key={delivery.id}
                  className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-5 space-y-4">
                    <div>Created: {formatDate(delivery.createdAt)}</div>
                    <div className="text-lg font-semibold text-gray-800">{delivery.trackingNumber}</div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                      <Bike className="w-4 h-4 text-blue-600" />
                      <span>Rider: {delivery.assignedRider?.name || "Unassigned"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{delivery.pickupAddress}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span>{delivery.dropoffAddress}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>ETA: {convertMinutesToHours(parseInt(delivery.eta==="" || delivery.eta===null?"0":delivery.eta))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>ATA: {convertMinutesToHours(parseInt(delivery.ata==="" || delivery.ata===null?"0":delivery.ata))}</span>
                    </div>
                    {delivery.deliveryStatus === 'in_transit' && (
                      <>
                        <Button
                          onClick={() => openMap(delivery)} 
                          variant="outline"
                          className="w-full transition-all text-white duration-200 customgrad hover:bg-blue-50 hover:border-blue-500"
                        >
                          <Compass className="w-4 h-4 mr-1" /> Track
                        </Button>

                        <Button
                          onClick={() => handleCancel(delivery)} 
                          variant="outline"
                          className="w-full transition-all text-white duration-200 bg-red-800 hover:bg-red-200 hover:border-red-500"
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </>
                    )}

                    <Collapsible
                      title={delivery.packages.length > 0 ? "Package Ready" : "Create Package"}
                      defaultOpen={delivery.packages.length === 0}
                    >
                      <CreatePackageForm
                        deliveryId={delivery.id}
                        Package={delivery.packages}
                        refresh={refetch}
                      />
                    </Collapsible>

                    <Collapsible 
                          title={'Pickup Proof'}
                          defaultOpen={false}>
                       { delivery.proofOfPickup.length > 0?
                         delivery.proofOfPickup.map((proof:any,i:number) =>(
                          <div key={i}>
                          <ProofOfPickupCard
                           createdAt={proof.createdAt}
                           customerName={proof.customerName}
                           customerSignature={proof.customerSignature}
                           id={proof.id}
                           numberOfPackages={proof.numberOfPackages}
                           packageCondition={proof.packageCondition}
                           pickupAddress={proof.pickupAddress}
                           pickupDateTime={proof.pickupDateTime}
                           pickupLatitude={proof.pickupLatitude}
                           pickupLongitude={proof.pickupLongitude}
                           proofPhotoUrl={proof.proofPhotoUrl}
                           remarks={proof.remarks}
                           status={proof.status}
                           updatedAt={proof.updatedAt}/>
                          </div> 
                         )):(
                           <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                        <FileSignature className="text-gray-400" size={48} />
                        <h3 className="mt-4 text-lg font-medium text-gray-700">No proof added</h3>
                        <p className="mt-2 text-gray-500 text-center max-w-md">
                          Rider will add pickup proof including photos, recipient information, and signatures
                        </p>
                      </div>
                         )
                       }
                        
                           
                      </Collapsible>

                    
                    <Collapsible title="Delivery Proof" defaultOpen={false}>
                      {/* Proof Gallery */}
                      {delivery.proofOfDelivery.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {delivery.proofOfDelivery.map((item: any, idx: number) => (
                            <div 
                              key={idx}
                              className="bg-gradient-to-br from-white to-gray-50 shadow-xl overflow-hidden border border-gray-100 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >
                              <div className="relative h-52 w-full">
                                <Image
                                  src={item.photoUrl}
                                  alt={`Proof of Delivery ${idx + 1}`}
                                  className="object-cover w-full h-full"
                                  height={100}
                                  width={200}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                              </div>
                              <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-amber-100 p-2 rounded-full">
                                    <User size={18} className="text-amber-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Received by</p>
                                    <p className="font-medium text-gray-900">{item.receivedBy}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 p-2 rounded-full">
                                    <Clock size={16} className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Time received</p>
                                    <p className="font-medium text-gray-900">{formatDate(item.receivedAt)}</p>
                                  </div>
                                </div>
                                {item.signatureData && (
                                  <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">Signature:</p>
                                    <div className="relative h-16 w-full bg-gray-50 rounded-lg p-2 border border-gray-200">
                                      <Image
                                        src={item.signatureData}
                                        alt="Signature"
                                        height={100}
                                        width={200}
                                        className="object-contain w-full h-full"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                          <FileSignature className="text-gray-400" size={48} />
                          <h3 className="mt-4 text-lg font-medium text-gray-700">No proof added</h3>
                          <p className="mt-2 text-gray-500 text-center max-w-md">
                            Rider will add delivery proof including photos, recipient information, and signatures
                          </p>
                        </div>
                      )}
                    </Collapsible>

                    <Collapsible title="Payment" defaultOpen={false}>
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Code size={18} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment Code</p>
                            <p className="font-medium text-gray-900">{delivery.paymentCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <WalletCards size={18} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment Method</p>
                            <p className="font-medium text-gray-900">{delivery.paymentMethod}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <CreditCard size={18} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment Status</p>
                            <p className="font-medium text-gray-900">{delivery.paymentStatus}</p>
                          </div>
                        </div>
                      </div>
                    </Collapsible>

                    <div className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow">
                      {delivery.deliveryStatus}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeTab === "History" && <HistoryContainer />}
            </div>
          </>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around z-50">
        {['Deliveries','History'].map(tab => (
          <button
            key={tab}
            className={`flex flex-col items-center transition p-2 w-full ${
              activeTab === tab ? 'customgrad text-white font-semibold' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {showMap && (
        <div className="fixed h-[100vh] inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
          <button
            onClick={() => setMap(false)}
            className="fixed top-5 right-5 z-50 p-1 rounded hover:bg-gray-100 transition"
          >
            <XCircle className="w-5 h-5 text-red-600" />
          </button>
          <div className="w-full h-[100vh] sm:max-w-md bg-white shadow-lg overflow-y-auto">
            <SenderMap
              riderId={selectedDelivery.assignedRiderId}
              riderPOS={{
                lat: selectedDelivery.pickupLatitude,
                lng: selectedDelivery.pickupLongitude,
              }}
              senderPOS={{
                lat: selectedDelivery.pickupLatitude,
                lng: selectedDelivery.pickupLongitude, 
              }}
              receiverPOS={{
                lat: selectedDelivery.dropoffLatitude,
                lng: selectedDelivery.dropoffLongitude,
              }}
              delivery={selectedDelivery}
              setMap={()=>setMap(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
        }
