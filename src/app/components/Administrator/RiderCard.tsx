import React from 'react';
import { Card, Avatar, Tag, Button, Divider, Tooltip } from 'antd';
import { 
  UserOutlined, 
  CarOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  IdcardOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';

const RiderCard = ({ rider, onViewDetails }) => {
  const statusColors = {
    ACTIVE: 'green',
    INACTIVE: 'red',
    BUSY: 'orange',
    OFFLINE: 'gray'
  };

  return (
    <Card
      hoverable
      style={{ width: 320, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      cover={
        <div style={{ 
          height: 140, 
          background: `linear-gradient(135deg, #1890ff 0%, #673ab7 100%)`,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {rider.image ? (
            <Avatar 
              size={80} 
              src={rider.image} 
              style={{ border: '3px solid white' }} 
            />
          ) : (
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#fff',
                color: '#1890ff',
                border: '3px solid white'
              }} 
            />
          )}
          <Tag 
            color={statusColors[rider.status] || 'blue'} 
            style={{ 
              position: 'absolute', 
              bottom: 16, 
              right: 16,
              fontWeight: 'bold'
            }}
          >
            {rider.status}
          </Tag>
        </div>
      }
      actions={[
        <Button 
          type="primary" 
          ghost 
          onClick={() => onViewDetails(rider)}
          style={{ width: '90%', borderRadius: 6 }}
        >
          View Details
        </Button>
      ]}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4, fontSize: 18 }}>{rider.name}</h3>
        <Tag icon={<IdcardOutlined />} color="blue">{rider.role}</Tag>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MailOutlined style={{ marginRight: 8, color: '#666' }} />
          <span>{rider.email}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneOutlined style={{ marginRight: 8, color: '#666' }} />
          <span>{rider.phoneNumber}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CarOutlined style={{ marginRight: 8, color: '#666' }} />
          <Tooltip title={`Max ${rider.vehicleType.maxCapacityKg}kg · ${rider.vehicleType.maxVolumeM3}m³`}>
            <span>
              {rider.vehicleType.name} ({rider.licensePlate})
            </span>
          </Tooltip>
        </div>
        
        {rider.currentLatitude && rider.currentLongitude && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ marginRight: 8, color: '#666' }} />
            <span>Location: {rider.currentLatitude.toFixed(4)}, {rider.currentLongitude.toFixed(4)}</span>
          </div>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 8, color: '#666' }} />
          <span>
            Last updated: {formatDistanceToNow(new Date(rider.lastUpdatedAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RiderCard;
