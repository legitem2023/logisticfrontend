// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import RiderShipmentHistory from '../RiderShipmentHistory';
import SenderShipmentHistory from '../SenderShipmentHistory';
import { useDispatch,useSelector } from 'react-redux';
import { setRole, clearRole, selectRole } from '../../../../Redux/roleSlice';

import { setRole, clearRole, selectRole } from '../../../../Redux/roleSlice';

export default function HistoryContainer() {
  
  const useRole = useSelector(selectRole); 
  const progressitem = [
    { label: 'Pending', content:{useRole==='Sender'?( <SenderShipmentHistory status={"Pending"}/> ):(<RiderShipmentHistory status={"Pending"}/>) } },
    { label: 'Completed', content:{useRole==='Delivered'?( <SenderShipmentHistory status={"Delivered"}/> ):(<RiderShipmentHistory status={"Delivered"}/>) } },
    { label: 'Cancelled', content:{useRole==='Cancelled'?( <SenderShipmentHistory status={"Cancelled"}/> ):(<RiderShipmentHistory status={"Cancelled"}/>) } },
  ];
  return (
    <>
      <SwiperTabs tabs={progressitem} />
    </> 
  );
}
