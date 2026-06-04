import { gql } from "@apollo/client";

export const TRAFFIC_ZONE_FIELDS_FRAGMENT = gql`
  fragment TrafficZoneFields on TrafficZoneEntity {
    id
    name
    description
    latitude
    longitude
    radius
    vehicleCount
    density
    congestionLevel
    isCongested
    createdAt
    updatedAt
  }
`;
