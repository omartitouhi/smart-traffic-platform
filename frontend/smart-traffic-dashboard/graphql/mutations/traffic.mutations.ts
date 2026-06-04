import { gql } from "@apollo/client";
import { TRAFFIC_ZONE_FIELDS_FRAGMENT } from "@/graphql/fragments/traffic.fragments";

export const CREATE_TRAFFIC_ZONE_MUTATION = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  mutation CreateTrafficZone($input: CreateTrafficZoneInput!) {
    createTrafficZone(input: $input) {
      ...TrafficZoneFields
    }
  }
`;

export const UPDATE_TRAFFIC_ZONE_MUTATION = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  mutation UpdateTrafficZone($id: String!, $input: UpdateTrafficZoneInput!) {
    updateTrafficZone(id: $id, input: $input) {
      ...TrafficZoneFields
    }
  }
`;

export const UPDATE_TRAFFIC_DENSITY_MUTATION = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  mutation UpdateTrafficDensity($input: UpdateTrafficDensityInput!) {
    updateTrafficDensity(input: $input) {
      ...TrafficZoneFields
    }
  }
`;

export const DELETE_TRAFFIC_ZONE_MUTATION = gql`
  mutation DeleteTrafficZone($id: String!) {
    deleteTrafficZone(id: $id)
  }
`;
