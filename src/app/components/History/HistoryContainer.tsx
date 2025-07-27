// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import RiderShipmentHistory from '../RiderShipmentHistory';
import SenderShipmentHistory from '../SenderShipmentHistory';
import { useDispatch,useSelector } from 'react-redux';
import { setRole, clearRole, selectRole } from '../../../../Redux/roleSlice';

export default function HistoryContainer() {
  const progressitem = [
    { label: 'Pending', content: <RiderShipmentHistory status={"Pending"}/> },
    { label: 'Completed', content: <RiderShipmentHistory status={"Delivered"}/> },
    { label: 'Cancelled', content: <RiderShipmentHistory status={"Cancelled"}/> },
  ];
  return (
    <>
      <SwiperTabs tabs={progressitem} />
    </> 
  );
}
