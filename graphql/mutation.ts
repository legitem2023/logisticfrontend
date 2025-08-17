import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($input: LoginInput) {
  login(input: $input) {
    statusText
    token
  }
}`
export const FBLOGIN = gql`
mutation LoginWithFacebook($input: GoogleLoginInput!) {
  loginWithFacebook(input: $input) {
    token
    statusText
  }
}
`
export const GOOGLELOGIN = gql`
mutation LoginWithGoogle($input: GoogleLoginInput!) {
  loginWithGoogle(input: $input) {
    statusText
    token
  }
}`

export const CREATEDELIVERY = gql`
mutation CreateDelivery($input: CreateDeliveryInput) {
  createDelivery(input: $input) {
    statusText
  }
}`

export const CREATESENDER = gql`
mutation CreateSender($input: CreateSenderInput) {
  createSender(input: $input) {
    statusText
  }
}
`



export const CREATERIDER = gql`
mutation CreateRider($input: CreateRiderInput) {
  createRider(input: $input) {
    statusText
  }
}
`

export const LOCATIONTRACKING = gql`
mutation LocationTracking($input: LocationTrackingInput) {
  locationTracking(input: $input) {
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


export const SENDNOTIFICATION = gql`
mutation SendNotification($userId: String!, $title: String!, $message: String!, $type: String!) {
  sendNotification(userID: $userId, title: $title, message: $message, type: $type) {
    id
    title
    message
    type
    isRead
    createdAt
  }
}
`

export const ACCEPTDELIVERY = gql`
mutation AcceptDelivery($deliveryId: String!, $riderId: String!) {
  acceptDelivery(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`

export const SKIPDELIVERY = gql`
mutation SkipDelivery($deliveryId: String!, $riderId: String!) {
  skipDelivery(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`


export const FINISHDELIVERY = gql`
mutation FinishDelivery($deliveryId: String!, $riderId: String!) {
  finishDelivery(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`
export const CANCELEDDELIVERY = gql`
mutation CancelDelivery($deliveryId: String!, $riderId: String!) {
  cancelDelivery(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`

export const CREATEROUTE = gql`
mutation CreateRouteHistory($deliveryId: String!, $riderId: String!, $latitude: Float, $longitude: Float) {
  createRouteHistory(deliveryId: $deliveryId, riderId: $riderId, latitude: $latitude, longitude: $longitude) {
    statusText
    token
  }
}
`

export const ASSIGNRIDER = gql`
mutation AssignRider($deliveryId: String!, $riderId: String!) {
  assignRider(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`

export const CREATEPACKAGE = gql`
mutation CreatePackage($deliveryId: String!, $packageType: String, $weight: Float, $dimensions: String, $specialInstructions: String) {
  createPackage(deliveryId: $deliveryId, packageType: $packageType, weight: $weight, dimensions: $dimensions, specialInstructions: $specialInstructions) {
    statusText
  }
}
`


export const DELETENOTIFICATION = gql`
mutation DeleteNotification($notificationId: String!) {
  deleteNotification(notificationId: $notificationId) {
    statusText
  }
}
`


export const READNOTIFICATION =gql`
mutation ReadNotification($notificationId: String!) {
  readNotification(notificationId: $notificationId) {
    statusText
  }
}
`

export const UPLOAD = gql`
mutation UploadFile($file: ProofOfDeliveryInput!) {
  uploadFile(file: $file) {
    statusText
  }
}
`

export const MARKPAID = gql`
mutation MarkPaid($deliveryId: String!, $riderId: String!, $code: String) {
  markPaid(deliveryId: $deliveryId, riderId: $riderId, code: $code) {
    statusText
  }
}
`

export const INSERTPICKUPPROOF = gql`
mutation InsertPickupProof($input: ProofOfPickupInput) {
  insertPickupProof(input: $input) {
    statusText
  }
}
`
