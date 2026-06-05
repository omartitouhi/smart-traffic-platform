import { gql } from "@apollo/client";
import { INCIDENT_FIELDS_FRAGMENT } from "@/graphql/fragments/incident.fragments";

export const INCIDENTS_QUERY = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  query Incidents {
    incidents {
      ...IncidentFields
    }
  }
`;

export const INCIDENT_QUERY = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  query Incident($id: ID!) {
    incident(id: $id) {
      ...IncidentFields
    }
  }
`;

export const INCIDENTS_BY_STATUS_QUERY = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  query IncidentsByStatus($status: IncidentStatus!) {
    incidentsByStatus(status: $status) {
      ...IncidentFields
    }
  }
`;
