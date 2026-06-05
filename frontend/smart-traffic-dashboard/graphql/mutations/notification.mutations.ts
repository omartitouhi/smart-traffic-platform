import { gql } from "@apollo/client";
import { NOTIFICATION_FIELDS_FRAGMENT } from "@/graphql/fragments/notification.fragments";

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  ${NOTIFICATION_FIELDS_FRAGMENT}
  mutation MarkNotificationAsRead($input: MarkNotificationReadInput!) {
    markNotificationAsRead(input: $input) {
      ...NotificationFields
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  ${NOTIFICATION_FIELDS_FRAGMENT}
  mutation MarkAllNotificationsAsRead($input: MarkAllNotificationsReadInput!) {
    markAllNotificationsAsRead(input: $input) {
      ...NotificationFields
    }
  }
`;

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($input: DeleteNotificationInput!) {
    deleteNotification(input: $input)
  }
`;
