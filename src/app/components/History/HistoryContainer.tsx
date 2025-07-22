// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import SenderShipmentHistory from '../SenderShipmentHistory';
export default function HistoryContainer() {
  const progressitem = [
    { label: 'In Progress', content: <SenderShipmentHistory status={"in_transit"}/> },
    { label: 'Completed', content: <SenderShipmentHistory status={"Delivered"}/> },
    { label: 'Pending', content: <SenderShipmentHistory status={"Pending"}/> },
    { label: 'Cancelled', content: <SenderShipmentHistory status={"Cancelled"}/> },
  ];
  return (
    <>
      <SwiperTabs tabs={progressitem} />
    </> 
  );
}
