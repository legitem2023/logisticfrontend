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