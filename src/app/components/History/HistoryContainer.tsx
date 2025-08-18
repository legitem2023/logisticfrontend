// components/History.tsx
import SwiperTabs from '../SwiperTabs';
import RiderShipmentHistory from '../RiderShipmentHistory';
import SenderShipmentHistory from '../SenderShipmentHistory';
import { useSelector } from 'react-redux';
import { selectRole } from '../../../../Redux/roleSlice';

export default function HistoryContainer() {
  const role = useSelector(selectRole); 

  const progressitem = [
    {
      label: 'Completed',
      content: role === 'Sender' || role === 'SENDER'
        ? <SenderShipmentHistory status="Delivered" />
        : <RiderShipmentHistory status="Delivered" />
    },
    {
      label: 'Cancelled',
      content: role === 'Sender' || role === 'SENDER'
        ? <SenderShipmentHistory status="Cancelled" />
        : <RiderShipmentHistory status="Cancelled" />
    },
  ];

  return <SwiperTabs tabs={progressitem} />;
}
