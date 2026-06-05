import { gql } from "@apollo/client";

export const INCIDENT_FIELDS_FRAGMENT = gql`
  fragment IncidentFields on IncidentEntity {
    id
    title
    description
    type
    status
    latitude
    longitude
    address
    createdAt
    updatedAt
  }
`;
