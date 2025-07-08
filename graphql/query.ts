import { gql } from "@apollo/client";

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
  }
}
`