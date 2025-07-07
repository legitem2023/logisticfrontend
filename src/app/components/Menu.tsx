'use client'
import Sidebar from "./Sidebar";
// import DeliveryMap from "./components/DeliveryMap";
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
});
export default function Menu() {
  const tabItems = [
    { label: 'Tab 1', content: <div><DeliveryMap/></div> },
    { label: 'Tab 2', content: <div>Content for ADTab 2</div> },
    { label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];

  return (
    <div>
      <div className="customgrad h-[70px] w-[100%]"></div>
      <Sidebar tabs={tabItems} />
    </div>
  );
}
