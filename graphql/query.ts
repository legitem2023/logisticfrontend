import { gql } from "@apollo/client";

export const VEHICLEQUERY = gql`
query GetVehicleTypes {
  getVehicleTypes {
    id
    name
    maxCapacityKg
    maxVolumeM3
    description
    icon
    createdAt
    updatedAt
    cost
  }
}
`

export const RIDERS = gql`
query GetRiders {
  getRiders {
    id
    name
    email
    phoneNumber
    vehicleType {
      id
      name
      maxCapacityKg
      maxVolumeM3
      description
      createdAt
      updatedAt
      icon
      cost
    }
    licensePlate
    status
    currentLatitude
    currentLongitude
    lastUpdatedAt
    createdAt
    updatedAt
    role
    image
  }
}
`
export const DELIVERIES = gql`
query GetRidersDelivery($getRidersDeliveryId: String) {
  getRidersDelivery(id: $getRidersDeliveryId) {
    id
    trackingNumber
    recipientName
    recipientPhone
    pickupAddress
    pickupLatitude
    pickupLongitude
    dropoffAddress
    dropoffLatitude
    dropoffLongitude
    deliveryStatus
    estimatedDeliveryTime
    actualDeliveryTime
    createdAt
    updatedAt
    senderId
    assignedRiderId
    assignedRider {
      id
      image
      name
      email
      phoneNumber
      vehicleType {
        id
        name
        maxCapacityKg
        maxVolumeM3
        description
        createdAt
        updatedAt
        icon
        cost
      }
      licensePlate
      status
      currentLatitude
      currentLongitude
      lastUpdatedAt
      createdAt
      updatedAt
      role
    }
  }
}`