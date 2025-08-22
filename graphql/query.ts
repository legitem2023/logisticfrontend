import { gql } from "@apollo/client";

export const ACCOUNTS = gql`
query GetUsers {
  getUsers {
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
    license
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

export const ACCOUNT = gql`
query GetUser($id: String) {
  getUser(id: $id) {
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
    license
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

export const VEHICLEQUERY = gql`
query GetVehicleTypes {
  getVehicleTypes {
    id
    name
    maxCapacityKg
    maxVolumeM3
    description
    createdAt
    updatedAt
    icon
    cost
    perKmRate
    rushTimeAddon
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
    baseRate
    perKmRate
    distance
    paymentCode
    proofOfPickup {
        id
        pickupDateTime
        pickupAddress
        pickupLatitude
        pickupLongitude
        customerName
        customerSignature
        proofPhotoUrl
        packageCondition
        numberOfPackages
        remarks
        status
        createdAt
        updatedAt
     }
    proofOfDelivery {
      id
      photoUrl
      signatureData
      receivedBy
      receivedAt
    }
    packages {
      id
      packageType
      weight
      dimensions
      specialInstructions
    }
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
    eta
    ata
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
    baseRate
    perKmRate
    distance
    paymentCode
        proofOfPickup {
        id
        pickupDateTime
        pickupAddress
        pickupLatitude
        pickupLongitude
        customerName
        customerSignature
        proofPhotoUrl
        packageCondition
        numberOfPackages
        remarks
        status
        createdAt
        updatedAt
     }
    proofOfDelivery {
      id
      photoUrl
      signatureData
      receivedBy
      receivedAt
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
    eta
    ata
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
    packages {
      id
      packageType
      weight
      dimensions
      specialInstructions
    }
    packageId
  }   
}
`

export const GETDELIVERIESADMIN = gql`
query GetDeliveries {
  getDeliveries {
    id
    trackingNumber
    baseRate
    perKmRate
    distance
    proofOfPickup {
        id
        pickupDateTime
        pickupAddress
        pickupLatitude
        pickupLongitude
        customerName
        customerSignature
        proofPhotoUrl
        packageCondition
        numberOfPackages
        remarks
        status
        createdAt
        updatedAt
     }
     proofOfDelivery {
      id
      photoUrl
      signatureData
      receivedBy
      receivedAt
    }
    packages {
      id
      packageType
      weight
      dimensions
      specialInstructions
    }
    packageId
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
    eta
    ata
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
