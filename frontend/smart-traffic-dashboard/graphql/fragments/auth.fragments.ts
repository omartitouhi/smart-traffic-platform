import { gql } from "@apollo/client";

export const AUTH_USER_FRAGMENT = gql`
  fragment AuthUserFields on UserEntity {
    id
    email
    firstName
    lastName
    role
  }
`;

export const AUTH_PAYLOAD_FRAGMENT = gql`
  fragment AuthPayloadFields on AuthPayloadEntity {
    accessToken
    refreshToken
    user {
      ...AuthUserFields
    }
  }
  ${AUTH_USER_FRAGMENT}
`;
