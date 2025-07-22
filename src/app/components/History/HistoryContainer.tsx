// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import SenderShipmentHistory from '../SenderShipmentHistory';
export default function HistoryContainer() {
  const progressitem = [
    { label: 'Pending', content: <SenderShipmentHistory status={"Pending"}/> },
    { label: 'Completed', content: <SenderShipmentHistory status={"Delivered"}/> },
    { label: 'Cancelled', content: <SenderShipmentHistory status={"Cancelled"}/> },
  ];
  return (
    <>
      <SwiperTabs tabs={progressitem} />
    </> 
  );
}
