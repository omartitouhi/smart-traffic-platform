import { gql } from "@apollo/client";
import { INCIDENT_FIELDS_FRAGMENT } from "@/graphql/fragments/incident.fragments";

export const DECLARE_INCIDENT_MUTATION = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  mutation DeclareIncident($input: CreateIncidentInput!) {
    declareIncident(input: $input) {
      ...IncidentFields
    }
  }
`;

export const UPDATE_INCIDENT_MUTATION = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  mutation UpdateIncident($id: ID!, $input: UpdateIncidentInput!) {
    updateIncident(id: $id, input: $input) {
      ...IncidentFields
    }
  }
`;

export const UPDATE_INCIDENT_STATUS_MUTATION = gql`
  ${INCIDENT_FIELDS_FRAGMENT}
  mutation UpdateIncidentStatus($input: UpdateIncidentStatusInput!) {
    updateIncidentStatus(input: $input) {
      ...IncidentFields
    }
  }
`;

export const DELETE_INCIDENT_MUTATION = gql`
  mutation DeleteIncident($id: ID!) {
    deleteIncident(id: $id)
  }
`;
