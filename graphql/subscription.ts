import { gql } from "@apollo/client";

export const LocationTracking = gql`
subscription Subscription($userId: String) {
  LocationTracking(userID: $userId) {
    userID
    latitude
    longitude
    speed
    heading
    accuracy
    batteryLevel
    timestamp
  }
}
`