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

export const NOTIFICATION = gql`
subscription NotificationReceived($userId: String!) {
  notificationReceived(userID: $userId) {
    id
    userId
    title
    message
    type
    isRead
    createdAt
  }
}
`