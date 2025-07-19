import { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { LocationTracking, NOTIFICATION } from '../../../../graphql/subscription';

const SubscriptionsToggle = ({ userId }: { userId: string }) => {
  const [enabled, setEnabled] = useState(false);

  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId },
    skip: !enabled,
  });

  const { data: notificationData } = useSubscription(NOTIFICATION, {
    variables: { userId },
    skip: !enabled,
  });

  useEffect(() => {
    if (locationData) {
      console.log('📍 Location Update:', locationData.LocationTracking);
    }
  }, [locationData]);

  useEffect(() => {
    if (notificationData) {
      console.log('🔔 Notification:', notificationData.notificationReceived);
    }
  }, [notificationData]);

  return (
    <div className="p-4 border rounded shadow w-fit space-y-2">
      {/* Toggle Switch Only */}
      <button
        onClick={() => setEnabled(prev => !prev)}
        className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>

    </div>
  );
};

export default SubscriptionsToggle;
