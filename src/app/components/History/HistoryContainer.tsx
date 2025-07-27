// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import SenderShipmentHistory from '../SenderShipmentHistory';
import { useDispatch,useSelector } from 'react-redux';
import { setRole, clearRole, selectRole } from '../../../../Redux/roleSlice';

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
