import { gql } from "@apollo/client";
import { TRAFFIC_ZONE_FIELDS_FRAGMENT } from "@/graphql/fragments/traffic.fragments";

export const TRAFFIC_ZONES_QUERY = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  query TrafficZones {
    trafficZones {
      ...TrafficZoneFields
    }
  }
`;

export const TRAFFIC_ZONE_QUERY = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  query TrafficZone($id: ID!) {
    trafficZone(id: $id) {
      ...TrafficZoneFields
    }
  }
`;

export const CONGESTED_ZONES_QUERY = gql`
  ${TRAFFIC_ZONE_FIELDS_FRAGMENT}
  query CongestedZones {
    congestedZones {
      ...TrafficZoneFields
    }
  }
`;
