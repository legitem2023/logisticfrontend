import { gql } from "@apollo/client";

export const LocationTracking = gql`
subscription Subscription {
  LocationTracking {
    latitude
    longitude
    speed
    heading
    accuracy
    batteryLevel
    timestamp
    userID
  }
}
`