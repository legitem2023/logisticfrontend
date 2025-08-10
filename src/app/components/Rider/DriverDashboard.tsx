'use client';
import Image from 'next/image';
import ProofOfDeliveryForm from './ProofOfDeliveryForm';
import PaymentComponent from '../PaymentComponent';
import { useState, useEffect } from "react"; 
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { Button } from "../ui/Button"; 
import { showToast } from '../../../../utils/toastify'; 
import { Card, CardContent } from "../ui/Card"; 
import { useMutation, useQuery } from "@apollo/client"; 
import { DELIVERIES } from "../../../../graphql/query"; 
import HistoryContainer from "../History/HistoryContainer"; 
import { Clock, X, Compass, FileText, Upload, Plus, User,PackageOpen, FileSignature } from "lucide-react"; 
import { DashboardLoading } from "../Loadings/DashboardLoading"; 
import { capitalize, formatDate } from "../../../../utils/decryptToken"; 
import { ACCEPTDELIVERY, SKIPDELIVERY } from "../../../../graphql/mutation"; 
import DeliveryDetailCard from "./DeliveryDetailCard"; 
import dynamic from "next/dynamic"; 
import FilterBar from "./Filterbar";
import Collapsible from "../ui/Collapsible";

const RiderMap = dynamic(() => import("./RiderMap"), { ssr: false });
type Indicator = {
  loadingText:string;
  enable:boolean;
}
export default function DriverDashboard() { 
  
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);
  const [activeTab, setActiveTab] = useState("Deliveries"); 
  const [showMap, setMap] = useState(false); 
  const [showDetails, setShowDetails] = useState(false); 
  const [selectedDelivery, setSelectedDelivery] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [showProof, setProof] = useState(false);

  const [showPayment,setPayment]= useState(false);
   const [deliveryId,setdeliveryId] = useState();
const [useIndicator, setIndicator] = useState<Indicator>({
  loadingText: 'Accept Delivery',
  enable: false,
});  

const [useIndicatorA, setIndicatorA] = useState<Indicator>({
  loadingText: 'Skip Delivery',
  enable: false,
});  
  
  const location = useSelector((state: any) => state.location.current);
  
  const openDetails = (delivery: any) => { 
    setSelectedDelivery(delivery); 
    setShowDetails(true); 
  };

  const closeDetails = () => { 
    setShowDetails(false); 
    setSelectedDelivery(null); 
  };

  const { data, loading, refetch } = useQuery(DELIVERIES, { 
    variables: { getRidersDeliveryId: globalUserId }, 
    skip: !globalUserId, 
  });

  const [acceptDelivery] = useMutation(ACCEPTDELIVERY, { 
    onCompleted: () => {
     showToast("Delivery accepted successfully", "success");
      setIndicator({
     loadingText: 'Done.',
     enable:true,
   })
      refetch();
    }, 
    onError: (e: any) => console.log('Acceptance Error', e) 
  });

const [skipDelivery] = useMutation(SKIPDELIVERY, { 
    onCompleted: (e:any) => {
      showToast("You have successfuly skipped this delivery", "success");
      setIndicatorA({
       loadingText: 'Done.',
       enable:true,
      })
      refetch();
    }, 
    onError: (e: any) => console.log('Acceptance Error', e) 
  });



  
  const acceptedDeliveries = data?.getRidersDelivery?.filter((delivery: any) => 
    delivery.deliveryStatus !== "Delivered" && delivery.deliveryStatus !== "Cancelled"
  ) || [];

  useEffect(() => {
    refetch();
  }, [GlobalactiveIndex]);
 
  useEffect(() => {
    const filtered = acceptedDeliveries.filter((delivery: any) => {
      const matchesSearch = searchTerm 
        ? delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (delivery.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        : true;

      const matchesDate = selectedDate
        ? new Date(delivery.estimatedDeliveryTime).toDateString() === selectedDate.toDateString()
        : true;

      return matchesSearch && matchesDate;
    });

    setFilteredDeliveries(filtered);
  }, [acceptedDeliveries, searchTerm, selectedDate]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    setSearchTerm(search);
    setSelectedDate(date);
  };

  const handleGetIp = (delivery: any) => { 
    if(location){
      setSelectedDelivery(delivery); 
      setMap(true);
    } else {
      showToast("Open your Device GPS", "error");  
    }
  };

  const handleAccept = async (id: string, riderId: string) => { 
  const cnfrm = confirm("Are you sure you want to accept the delivery?");
   if(cnfrm){
   setIndicator({
     loadingText: 'Loading...',
     enable:true,
   })
     await acceptDelivery({ 
      variables: { deliveryId: id, riderId: riderId } 
    });  
   }   
  };


const handleSkip = async (id: string, riderId: string) => { 
  const cnfrm = confirm("Are you sure you want to skip the delivery?");
  if(cnfrm){
    setIndicatorA({
     loadingText: 'Loading...',
     enable:true,
   })
   await skipDelivery({ 
      variables: { deliveryId: id, riderId: riderId } 
    }); 
   }  
  };


  
  if (loading || !data) return <DashboardLoading />;
console.log(filteredDeliveries);
  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row"> 
      <aside className="hidden md:block md:w-64 bg-white/70 backdrop-blur-lg border-r border-gray-200 shadow-md p-6 rounded-r-3xl"> 
        <h2 className="text-2xl font-bold text-gray-800 mb-10 tracking-tight">🚚 Driver Panel</h2> 
        <nav> 
          <ul className="space-y-4 text-[15px] font-medium">
            {['Deliveries', 'History'].map(tab => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-200 ${
                  activeTab === tab
                    ? 'customgrad text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </li>
            ))}
          </ul> 
        </nav> 
      </aside>
      
      <main className="flex-1">
        {activeTab === "Deliveries" &&( <FilterBar onFilter={handleFilter} />)}
        {activeTab === "Deliveries" && (
          <>
            <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-0">
              {filteredDeliveries.length > 0 ? filteredDeliveries?.map((delivery: any) => (
                <Card key={delivery.id} className="transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] border border-gray-200">
                  <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">{delivery.trackingNumber}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">From:</span> {delivery.pickupAddress}<br />
                        <span className="font-medium">To:</span> {delivery.dropoffAddress}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="italic">ETA: {formatDate(delivery.estimatedDeliveryTime) || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 bg-orange-500 hover:bg-blue-50 hover:border-blue-500"
                        onClick={() => openDetails(delivery)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        disabled={delivery.deliveryStatus === "Pending"}
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 customgrad hover:bg-blue-50 hover:border-blue-500"
                        onClick={() => handleGetIp(delivery)}
                      >
                        <Compass className="w-4 h-4 mr-1" /> {delivery.deliveryStatus === "Pending" ? "Accept Delivery" : "Track"}
                      </Button>
                      <Collapsible 
                        title={'Payment'}
                        defaultOpen={false}>
                            <div className="flex justify-end">
                              <button 
                               onClick={() => {
                               setSelectedDelivery(delivery)
                               setdeliveryId(delivery.id);
                               setPayment(true);
                               }}
                               className="flex items-center gap-2 px-4 py-2 m-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50">
                               <Plus className="text-white" size={18} />
                               <span className="font-semibold">Add Payment</span>
                              </button>
                              
                          </div>
                              <span>Payment Method: {delivery.paymentMethod}</span>
                              <span>Payment Status: {delivery.paymentStatus}</span>
                      </Collapsible>
                      <Collapsible 
  title={'Delivery Proof'}
  defaultOpen={false}>
  <div className="space-y-4">
    {/* Add Proof Button */}
    <div className="flex justify-end">
      <button 
        onClick={() => {
          setdeliveryId(delivery.id);
          setProof(true);
        }}
        className="flex items-center gap-2 px-4 py-2 m-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50"
      >
        <Plus className="text-white" size={18} />
        <span className="font-semibold">Add Proof</span>
      </button>
    </div>

    {/* Proof Gallery */}
    {delivery.proofOfDelivery.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {delivery.proofOfDelivery.map((item: any, idx: number) => (
          <div 
            key={idx}
            className="bg-gradient-to-br from-white to-gray-50 shadow-xl overflow-hidden border border-gray-100 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Photo */}
            <div className="relative h-52 w-full">
              <Image
                src={item.photoUrl}
                alt={`Proof of Delivery ${idx + 1}`}
                fill
                className="object-cover"
                height="100"
                width="200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Receiver */}
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <User size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Received by</p>
                  <p className="font-medium text-gray-900">{item.receivedBy}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time received</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(item.receivedAt)}
                  </p>
                </div>
              </div>

              {/* Signature */}
              {item.signatureData && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Signature:</p>
                  <div className="relative h-16 w-full bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <Image
                      src={item.signatureData}
                      alt="Signature"
                      fill
                      height="100"
                      width="200"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      // Empty State
      <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
        <FileSignature className="text-gray-400" size={48} />
        <h3 className="mt-4 text-lg font-medium text-gray-700">No proof added</h3>
        <p className="mt-2 text-gray-500 text-center max-w-md">
          Add delivery proof including photos, recipient information, and signatures
        </p>
      </div>
    )}
  </div>
</Collapsible>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full flex justify-center items-center h-64">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">No Deliveries Found...</h1>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "History" && <HistoryContainer />}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around z-50">
        {['Deliveries','History'].map(tab => (
          <button
            key={tab}
            className={`flex flex-col items-center transition p-2 w-[100%] h-[100%] ${
              activeTab === tab ? 'customgrad text-white-100 font-semibold' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {showDetails && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-slide-up overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">📦 Delivery Details</h2>
              <button onClick={closeDetails} className="p-1 rounded hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <DeliveryDetailCard
                sender={{
                  name: selectedDelivery.sender?.name || "N/A",
                  address: selectedDelivery.pickupAddress,
                  contact: selectedDelivery.phoneNumber,
                }}
                recipient={{
                  name: selectedDelivery.recipientName,
                  address: selectedDelivery.dropoffAddress,
                  contact: selectedDelivery.recipientPhone,
                }}
                billing={{
                  distanceKm:selectedDelivery.distance,
                  baseRate:selectedDelivery.baseRate,
                  perKmRate:selectedDelivery.perKmRate,
                  total: selectedDelivery.baseRate + (selectedDelivery.distance * selectedDelivery.perKmRate),
                }}
                packages={selectedDelivery.packages}
                coordinates={{
                  pickLat: selectedDelivery.pickupLatitude,
                  pickLng: selectedDelivery.pickupLongitude,
                  dropLat: selectedDelivery.dropoffLatitude,
                  dropLng: selectedDelivery.dropoffLongitude,
                }}
                status={selectedDelivery.deliveryStatus}
                Indicator={useIndicator}
                IndicatorA={useIndicatorA}
                onAcceptClick={() => {handleAccept(selectedDelivery.id, globalUserId);}}
                onSkipClick={() => { handleSkip(selectedDelivery.id, globalUserId)}}
              />
            </div>
          </div>
        </div>
      )}

      {showProof && (
       <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
         <div className="w-full h-[90vh] bg-white p-0 shadow-lg animate-slide-up overflow-y-auto">
          <ProofOfDeliveryForm data={{id:deliveryId}} />
         </div>
       </div>
      )}
      {showPayment &&(
       <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
         <div className="w-full h-[90vh] bg-white p-0 shadow-lg animate-slide-up overflow-y-auto">
            <PaymentComponent data={{id:deliveryId,base:selectedDelivery.baseRate,perKmRate:selectedDelivery.perKmRate,distance:selectedDelivery.distance}}/>
         </div>
       </div>
      )}
      {showMap && selectedDelivery && (
        <div className="fixed h-[100vh] inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 flex flex-col">
          
           <div className="flex justify-between items-center h-[10vh] bg-white w-full p-2">
              <h2 className="text-xl font-bold text-gray-800">Map</h2>
              <button onClick={() => setMap(false)} className="p-1 rounded hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
     
          <div className="w-full h-[90vh] sm:max-w-md bg-white p-0 shadow-lg animate-slide-up overflow-y-auto">
            <RiderMap
              deliveryId={selectedDelivery.id}
              senderId={selectedDelivery.sender.id}
              PickUpCoordinates={{
                lat: selectedDelivery.pickupLatitude,
                lng: selectedDelivery.pickupLongitude,
              }}
              DropOffCoordinates={{
                lat: selectedDelivery.dropoffLatitude,
                lng: selectedDelivery.dropoffLongitude,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
