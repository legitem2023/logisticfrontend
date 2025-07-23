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
    sender {
      email
      currentLongitude
      currentLatitude
      name
      image
      phoneNumber
    }
    recipientName
    recipientPhone
    pickupAddress
    pickupLatitude
    pickupLongitude
    dropoffAddress
    dropoffLatitude
    dropoffLongitude
    assignedRider {
      currentLatitude
      currentLongitude
      email
      id
      name
      image
      phoneNumber
    }
    deliveryStatus
    estimatedDeliveryTime
    actualDeliveryTime
    createdAt
    updatedAt
    deliveryType
    paymentStatus
    paymentMethod
    deliveryFee
    isCancelled
    cancellationReason
    failedAttemptReason
    currentLatitude
    currentLongitude
    senderId
    assignedRiderId
  }
}`

export const GETNOTIFICATION = gql`
query GetNotifications($getNotificationsId: String) {
  getNotifications(id: $getNotificationsId) {
    id
    user {
      name
      phoneNumber
    }
    userId
    title
    message
    type
    isRead
    createdAt
  }
}
`

export const GETDISPATCH = gql`
query GetDispatch($getDispatchId: String) {
  getDispatch(id: $getDispatchId) {
    id
    trackingNumber
    packages {
      id           
      deliveryId
      delivery
      packageType
      weight
      dimensions
      specialInstructions
    }
    sender {
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
    recipientName
    recipientPhone
    pickupAddress
    pickupLatitude
    pickupLongitude
    dropoffAddress
    dropoffLatitude
    dropoffLongitude
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
    deliveryStatus
    estimatedDeliveryTime
    actualDeliveryTime
    createdAt
    updatedAt
    deliveryType
    paymentStatus
    paymentMethod
    deliveryFee
    isCancelled
    cancellationReason
    failedAttemptReason
    currentLatitude
    currentLongitude
    senderId
    assignedRiderId
  }
}
`

export const GETDELIVERIESADMIN = gql`
query GetDeliveries {
  getDeliveries {
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
    deliveryType
    paymentStatus
    paymentMethod
    deliveryFee
    isCancelled
    cancellationReason
    failedAttemptReason
    currentLatitude
    currentLongitude
    senderId
    assignedRiderId
    assignedRider {
      id
      image
      name
      email
      phoneNumber
      licensePlate
      status
      currentLatitude
      currentLongitude
      lastUpdatedAt
      createdAt
      updatedAt
      role
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
    }
    sender {
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
}
`
