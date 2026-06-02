import { gql } from "@apollo/client";
import { AUTH_USER_FRAGMENT } from "@/graphql/fragments/auth.fragments";

export const ME_QUERY = gql`
  query Me {
    me {
      ...AuthUserFields
    }
  }
  ${AUTH_USER_FRAGMENT}
`;
