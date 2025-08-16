'use client';
import Image from 'next/image';
import { useState, useEffect, useMemo } from "react"; 
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { showToast } from '../../../utils/toastify'; 
import { useMutation, useQuery } from "@apollo/client"; 
import { DELIVERIES } from "../../../graphql/query"; 
import RiderCard from './Administrator/RiderCard'; // Import the card component

import dynamic from "next/dynamic"; 


export default function Profile() { 
  
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);
  const { data, loading, refetch } = useQuery(DELIVERIES, { 
    variables: { getRidersDeliveryId: globalUserId }, 
    skip: !globalUserId, 
  });
  if (loading || !data) return;

  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row"> 
       {data?.getRidersDelivery.map((rider: any) => (
            <RiderCard 
              key={rider.id}
              rider={rider}
              onViewDetails={() => {}}
              onSave={() => {}}
              />
          ))}       
    </div>
  );
}
