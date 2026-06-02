import { gql } from "@apollo/client";

export const VEHICLE_FRAGMENT = gql`
  fragment VehicleFields on VehicleEntity {
    id
    matricule
    brand
    model
    type
    status
    createdAt
    updatedAt
  }
`;

export const VEHICLE_POSITION_FRAGMENT = gql`
  fragment VehiclePositionFields on VehiclePositionEntity {
    id
    vehicleId
    latitude
    longitude
    speed
    recordedAt
  }
`;
