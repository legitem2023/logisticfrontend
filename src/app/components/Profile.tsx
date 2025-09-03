'use client';
import { useSelector } from 'react-redux';
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { useQuery } from "@apollo/client"; 
import { ACCOUNT } from "../../../graphql/query"; 
import AccountLoading from "./Loadings/AccountLoading";
import RiderCard from './Administrator/RiderCard'; 

export default function Profile() { 
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

  const { data, loading, error } = useQuery(ACCOUNT, { 
    variables: { id: globalUserId },
    skip: !globalUserId, // don't run until we have an ID
  });

  if (loading) return <AccountLoading/>;
  if (error) {
    console.error(error);
    return <p>Error loading user</p>;
  }

  const rider = data?.getUser;

  if (!rider) return <p>No user found</p>;

  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row"> 
      <RiderCard 
        key={rider.id}
        rider={rider}
        onViewDetails={() => {}}
        onSave={() => {}}
      />
    </div>
  );
}
