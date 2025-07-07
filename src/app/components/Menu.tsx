'use client'
import Sidebar from "./Sidebar";
import SwiperTabs from "./SwiperTabs";
import DeliveryCard from "./DeliveryCard";
import VehicleSelector from "./VehicleSelector";
import DeliveryFormCard from "./DeliveryFormCard";
// import DeliveryMap from "./components/DeliveryMap";
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
});
export default function Menu() {
const progressitem = [
  SwiperTabs
  { label: 'In Progress', content:<div>
      <DeliveryCard
        pickup="SM North EDSA, Quezon City"
        dropoff="Bonifacio Global City, Taguig"
        status="in_progress"
      /></div>},
    { label: 'Completed', content: <div><DeliveryCard
        pickup="SM North EDSA, Quezon City"
        dropoff="Bonifacio Global City, Taguig"
        status="completed"
      /></div> },
    { label: 'Pending', content: <div>
    <DeliveryCard
        pickup="SM North EDSA, Quezon City"
        dropoff="Bonifacio Global City, Taguig"
        status="pending"
      />
    </div>},
    { label: 'Cancelled', content: <div>
        <DeliveryCard
         pickup="SM North EDSA, Quezon City"
         dropoff="Bonifacio Global City, Taguig"
         status="cancelled"
      /></div>}

]


  
  const tabItems = [
    { label: 'Home', content:<div>
      <DeliveryFormCard/>
      <VehicleSelector/></div>},
    { label: 'Map', content: <div><DeliveryMap/></div> },
    { label: 'Order', content: <div><SwiperTabs tabs={progressitem}/></div> },
  ];

  return (
    <div>
      <div className="customgrad h-[70px] w-[100%] flex item-center justify-center">
        <img src='/Logo.svg' className="h-[80%] w-[auto]"/>
      </div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
