import { gql } from "@apollo/client";
import { NOTIFICATION_FIELDS_FRAGMENT } from "@/graphql/fragments/notification.fragments";

export const NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FIELDS_FRAGMENT}
  query Notifications($input: NotificationsQueryInput!) {
    notifications(input: $input) {
      ...NotificationFields
    }
  }
`;

export const UNREAD_NOTIFICATIONS_QUERY = gql`
  ${NOTIFICATION_FIELDS_FRAGMENT}
  query UnreadNotifications($input: NotificationsQueryInput!) {
    unreadNotifications(input: $input) {
      ...NotificationFields
    }
  }
`;

export const UNREAD_NOTIFICATION_COUNT_QUERY = gql`
  query UnreadNotificationCount($input: NotificationUserInput!) {
    unreadNotificationCount(input: $input)
  }
`;
