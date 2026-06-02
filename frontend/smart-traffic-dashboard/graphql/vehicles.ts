import { gql } from "@apollo/client";

export const VEHICLES_QUERY = gql`
  query Vehicles {
    vehicles {
      id
      matricule
      brand
      model
      type
      status
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_QUERY = gql`
  query Vehicle($id: ID!) {
    vehicle(id: $id) {
      id
      matricule
      brand
      model
      type
      status
      createdAt
      updatedAt
    }
  }
`;

export const VEHICLE_POSITIONS_QUERY = gql`
  query VehiclePositions($vehicleId: ID!) {
    vehiclePositions(vehicleId: $vehicleId) {
      id
      vehicleId
      latitude
      longitude
      speed
      recordedAt
    }
  }
`;
