import { gql } from "@apollo/client";

export const NOTIFICATION_FIELDS_FRAGMENT = gql`
  fragment NotificationFields on NotificationEntity {
    id
    title
    message
    type
    isRead
    userId
    createdAt
    updatedAt
  }
`;
