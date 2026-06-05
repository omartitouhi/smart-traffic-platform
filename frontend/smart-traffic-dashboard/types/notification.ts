export type NotificationType =
  | "INFO"
  | "WARNING"
  | "SUCCESS"
  | "ERROR"
  | "TRAFFIC_ALERT"
  | "INCIDENT_ALERT";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsQueryInput = {
  userId: string;
  isRead?: boolean;
  take?: number;
  skip?: number;
};

export type NotificationUserInput = {
  userId: string;
};

export type MarkNotificationReadInput = {
  id: string;
  userId: string;
};

export type DeleteNotificationInput = MarkNotificationReadInput;
