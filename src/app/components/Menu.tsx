'use client'
import Sidebar from "./Sidebar";
import DeliveryCard from "./DeliveryCard";
// import DeliveryMap from "./components/DeliveryMap";
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
});
export default function Menu() {
  const tabItems = [
    { label: 'Tab 1', content: <div><DeliveryMap/></div> },
    { label: 'Tab 2', content: <div><DeliveryCard
        pickup="SM North EDSA, Quezon City"
        dropoff="Bonifacio Global City, Taguig"
        status="in_progress"
      /></div> },
    { label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];

  return (
    <div>
      <div className="customgrad h-[70px] w-[100%]"></div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
