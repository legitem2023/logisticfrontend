import React from 'react'
import { useQuery } from '@apollo/client';
import { RIDERS } from '../../../../graphql/query';
import Loading from '../ui/Loading';
import ProfileCard from '../ProfileCard';
const Rider = () => {
    const { loading, error, data } = useQuery(RIDERS);
    if (loading) return <Loading lines={4} />;
    if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
        {data.getRiders.map((rider:any) => (
            <ProfileCard key={rider.id} name={rider.name} email={rider.email} contactNumber={rider.phoneNumber} address={rider.email} avatarUrl={rider.avatarUrl} />
        ))}
    </div>
  )
}

export default Rider