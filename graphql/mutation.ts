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
//     "dropoffAddress": "Olongapo City",
//     "dropoffLatitude": 120.294113,
//     "dropoffLongitude": 14.83662,
//     "estimatedDeliveryTime": "2025-07-10T07:22:00Z",
//     "pickupAddress": "Angono, Rizal",
//     "pickupLatitude": 14.523375,
//     "pickupLongitude": 121.153625,
//     "recipientName": "Tintin",
//     "recipientPhone": "0956789789",
//     "senderId": "686ffdf59a1ad0a2e9c79f0b",
//     "assignedRiderId": "686d427603399308ff9a237a"
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