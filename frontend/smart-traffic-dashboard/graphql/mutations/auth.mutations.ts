import { gql } from "@apollo/client";
import { AUTH_PAYLOAD_FRAGMENT } from "@/graphql/fragments/auth.fragments";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      ...AuthPayloadFields
    }
  }
  ${AUTH_PAYLOAD_FRAGMENT}
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: RefreshTokenInput!) {
    logout(input: $input)
  }
`;
