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


// {
//   "input": {
//     "assignedRiderId": "686d427603399308ff9a237a",
//     "deliveryFee": 120.50,
//     "deliveryType": "standard",
//     "dropoffAddress": "123 Mabini St, Manila",
//     "dropoffLatitude": 14.5995,
//     "dropoffLongitude": 120.9842,
//     "estimatedDeliveryTime": "2025-07-14T18:00:00.000Z",
//     "paymentMethod": "cash",
//     "paymentStatus": "unpaid",
//     "pickupAddress": "456 Katipunan Ave, QC",
//     "pickupLatitude": 14.6372,
//     "pickupLongitude": 121.0771,
//     "recipientName": "Juan Dela Cruz",
//     "recipientPhone": "+639171234567",
//     "senderId": "686d427603399308ff9a237a"
//   }
// }




export const CREATERIDER = gql`
mutation CreateRider($input: CreateRiderInput) {
  createRider(input: $input) {
    statusText
  }
}
`

// {
//   "input": {
//     "email": "robertsancomarquez1988@gmail.com",
//     "licensePlate": "TFN551",
//     "name": "Rodolfo Marquez Sr.",
//     "password": "2ddyjrv15G6",
//     "phoneNumber": "09065962015",
//     "vehicleTypeId": "686d3d615d788ba6da7f3598",
//   }
// }

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
// {
//   "input": {
//     "accuracy": 1,
//     "batteryLevel":2,
//     "heading": 1,
//     "latitude": 1,
//     "longitude": 1,
//     "speed": 1,
//     "timestamp": "1",
//     "userID": "2"
//   }
// }

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

// {
//   "userId": "686d427603399308ff9a237a",
//   "title": "Delivered",
//   "message": "Your Parcel Has Delivered",
//   "type": "YEAH"
// }

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

// {
//   "deliveryId": "68700a7a55394f1f6527b0c6",
//   "riderId": "686d427603399308ff9a237a"
// }

export const CREATEROUTE = gql`
mutation CreateRouteHistory($deliveryId: String!, $riderId: String!, $latitude: Float, $longitude: Float) {
  createRouteHistory(deliveryId: $deliveryId, riderId: $riderId, latitude: $latitude, longitude: $longitude) {
    statusText
    token
  }
}
`
// {
//   "deliveryId": null,
//   "riderId": null,
//   "latitude": null,
//   "longitude": null
// }

export const ASSIGNRIDER = gql`
mutation AssignRider($deliveryId: String!, $riderId: String!) {
  assignRider(deliveryId: $deliveryId, riderId: $riderId) {
    statusText
  }
}
`
// {
//   "deliveryId": "688071e732b94850b85213f7",
//   "riderId": "687e18da1002bedc6aa71a39"
// }

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
// {
//   "deliveryId": null,
//   "packageType": null,
//   "weight": null,
//   "dimensions": null,
//   "specialInstructions": null
// }

