import React from 'react';
import { 
  Card, 
  Avatar, 
  Typography, 
  Button, 
  Badge, 
  Space,
  Descriptions,
  Tag 
} from 'antd';
import { 
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

const { Text, Title } = Typography;

const RiderProfileCard = ({ rider, onViewDetails }) => {
  const statusBadge = {
    ACTIVE: { color: 'green', text: 'Active' },
    INACTIVE: { color: 'red', text: 'Inactive' },
    BUSY: { color: 'orange', text: 'On Delivery' },
    OFFLINE: { color: 'gray', text: 'Offline' }
  };

  const status = statusBadge[rider.status] || { color: 'blue', text: rider.status };

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: 360,
        borderRadius: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        padding: 24,
        textAlign: 'center',
        margin: -24,
        marginBottom: 16
      }}>
        <Badge 
          dot 
          color={status.color}
          offset={[-10, 80]}
        >
          <Avatar 
            size={90} 
            src={rider.image} 
            icon={!rider.image && <User size={32} />}
            style={{ 
              border: '4px solid rgba(255,255,255,0.3)',
              backgroundColor: rider.image ? 'transparent' : '#fff',
              color: '#6a11cb'
            }}
          />
        </Badge>
        <Title level={4} style={{ color: 'white', marginTop: 16, marginBottom: 0 }}>
          {rider.name}
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>{rider.role}</Text>
      </div>

      <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label={<Space><Mail size={16} />Email</Space>}>
          <Text copyable>{rider.email}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<Space><Phone size={16} />Phone</Space>}>
          <Text copyable>{rider.phoneNumber}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<Space><Car size={16} />Vehicle</Space>}>
          <Text strong>{rider.vehicleType.name}</Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary">Plate: {rider.licensePlate}</Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary">
              Capacity: {rider.vehicleType.maxCapacityKg}kg · {rider.vehicleType.maxVolumeM3}m³
            </Text>
          </div>
        </Descriptions.Item>
        {rider.currentLatitude && rider.currentLongitude && (
          <Descriptions.Item label={<Space><MapPin size={16} />Location</Space>}>
            <Text>
              {rider.currentLatitude.toFixed(4)}, {rider.currentLongitude.toFixed(4)}
            </Text>
          </Descriptions.Item>
        )}
        <Descriptions.Item label={<Space><Shield size={16} />Status</Space>}>
          <Tag color={status.color}>{status.text}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Calendar size={14} color="#999" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Joined {format(new Date(rider.createdAt), 'MMM d, yyyy')}
          </Text>
        </Space>
        <Button 
          type="primary" 
          onClick={() => onViewDetails(rider)}
          shape="round"
          icon={<ChevronRight size={16} />}
        >
          View Full Profile
        </Button>
      </div>
    </Card>
  );
};

export default RiderProfileCard;
