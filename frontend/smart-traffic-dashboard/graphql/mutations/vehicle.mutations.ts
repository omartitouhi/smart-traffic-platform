import { gql } from "@apollo/client";
import {
  VEHICLE_FRAGMENT,
  VEHICLE_POSITION_FRAGMENT,
} from "@/graphql/fragments/vehicle.fragments";

export const CREATE_VEHICLE_MUTATION = gql`
  mutation CreateVehicle($input: CreateVehicleInput!) {
    createVehicle(input: $input) {
      ...VehicleFields
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const UPDATE_VEHICLE_MUTATION = gql`
  mutation UpdateVehicle($id: ID!, $input: UpdateVehicleInput!) {
    updateVehicle(id: $id, input: $input) {
      ...VehicleFields
    }
  }
  ${VEHICLE_FRAGMENT}
`;

export const DELETE_VEHICLE_MUTATION = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

export const ADD_VEHICLE_POSITION_MUTATION = gql`
  mutation AddVehiclePosition($input: AddVehiclePositionInput!) {
    addVehiclePosition(input: $input) {
      ...VehiclePositionFields
    }
  }
  ${VEHICLE_POSITION_FRAGMENT}
`;

export const SIMULATE_VEHICLE_POSITION_MUTATION = gql`
  mutation SimulateVehiclePosition($vehicleId: ID!) {
    simulateVehiclePosition(vehicleId: $vehicleId) {
      ...VehiclePositionFields
    }
  }
  ${VEHICLE_POSITION_FRAGMENT}
`;
