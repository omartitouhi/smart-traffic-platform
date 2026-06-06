import { gql } from "@apollo/client";
import {
  VEHICLE_FRAGMENT,
  VEHICLE_POSITION_FRAGMENT,
} from "@/graphql/fragments/vehicle.fragments";

export const VEHICLES_QUERY = gql`
  query Vehicles {
    vehicles {
      ...VehicleFields
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const VEHICLE_QUERY = gql`
  query Vehicle($id: ID!) {
    vehicle(id: $id) {
      ...VehicleFields
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const VEHICLE_POSITIONS_QUERY = gql`
  query VehiclePositions($vehicleId: ID!) {
    vehiclePositions(vehicleId: $vehicleId) {
      ...VehiclePositionFields
    }
  }
  ${VEHICLE_POSITION_FRAGMENT}
`;

export const VEHICLE_POSITION_COUNT_QUERY = gql`
  query VehiclePositionCount {
    vehiclePositionCount
  }
`;
