"use client";

import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { notify } from "@/components/ui/toast";
import { getAccessToken } from "@/lib/auth-token-storage";
import { NOTIFICATION_WS_URL } from "@/lib/config";
import type { AppNotification } from "@/types/notification";

type UnreadCountPayload = {
  userId?: string;
  count: number;
};

type NotificationSocketEvents = {
  "notification:new": (notification: AppNotification) => void;
  "notification:read": (notification: AppNotification) => void;
  "notification:unreadCount": (payload: UnreadCountPayload) => void;
};

type UseNotificationSocketOptions = {
  userId?: string;
  enabled?: boolean;
  showToast?: boolean;
  onNewNotification?: (notification: AppNotification) => void;
  onReadNotification?: (notification: AppNotification) => void;
  onUnreadCount?: (count: number) => void;
};

type Subscriber = Required<
  Pick<UseNotificationSocketOptions, "showToast">
> &
  Pick<
    UseNotificationSocketOptions,
    "onNewNotification" | "onReadNotification" | "onUnreadCount"
  >;

let sharedSocket: Socket<never, NotificationSocketEvents> | null = null;
let sharedUserId: string | null = null;
const subscribers = new Set<Subscriber>();
const recentlyToastedNotificationIds = new Set<string>();

function isForCurrentUser(
  notificationUserId: string | null | undefined,
  userId: string,
) {
  return !notificationUserId || notificationUserId === userId;
}

function rememberToast(notificationId: string) {
  recentlyToastedNotificationIds.add(notificationId);
  window.setTimeout(() => {
    recentlyToastedNotificationIds.delete(notificationId);
  }, 10_000);
}

function handleNewNotification(notification: AppNotification) {
  const userId = sharedUserId;
  if (!userId || !isForCurrentUser(notification.userId, userId)) return;

  let shouldShowToast = false;
  subscribers.forEach((subscriber) => {
    if (subscriber.showToast) {
      shouldShowToast = true;
    }
    subscriber.onNewNotification?.(notification);
  });

  if (
    shouldShowToast &&
    !recentlyToastedNotificationIds.has(notification.id)
  ) {
    notify.info(notification.title);
    rememberToast(notification.id);
  }
}

function handleReadNotification(notification: AppNotification) {
  const userId = sharedUserId;
  if (!userId || !isForCurrentUser(notification.userId, userId)) return;

  subscribers.forEach((subscriber) => {
    subscriber.onReadNotification?.(notification);
  });
}

function handleUnreadCount(payload: UnreadCountPayload) {
  const userId = sharedUserId;
  if (!userId || !isForCurrentUser(payload.userId, userId)) return;

  subscribers.forEach((subscriber) => {
    subscriber.onUnreadCount?.(payload.count);
  });
}

function getSharedSocket(userId: string) {
  if (sharedSocket && sharedUserId === userId) return sharedSocket;

  if (sharedSocket) {
    sharedSocket.off("notification:new", handleNewNotification);
    sharedSocket.off("notification:read", handleReadNotification);
    sharedSocket.off("notification:unreadCount", handleUnreadCount);
    sharedSocket.disconnect();
  }

  const accessToken = getAccessToken();
  sharedUserId = userId;
  sharedSocket = io(NOTIFICATION_WS_URL, {
    auth: accessToken ? { token: accessToken } : undefined,
    transports: ["websocket", "polling"],
  });

  sharedSocket.on("notification:new", handleNewNotification);
  sharedSocket.on("notification:read", handleReadNotification);
  sharedSocket.on("notification:unreadCount", handleUnreadCount);

  return sharedSocket;
}

export function useNotificationSocket({
  userId,
  enabled = true,
  showToast = true,
  onNewNotification,
  onReadNotification,
  onUnreadCount,
}: UseNotificationSocketOptions) {
  useEffect(() => {
    if (!enabled || !userId || !NOTIFICATION_WS_URL) return undefined;

    const subscriber: Subscriber = {
      showToast,
      onNewNotification,
      onReadNotification,
      onUnreadCount,
    };
    subscribers.add(subscriber);
    getSharedSocket(userId);

    return () => {
      subscribers.delete(subscriber);

      if (subscribers.size === 0 && sharedSocket) {
        sharedSocket.off("notification:new", handleNewNotification);
        sharedSocket.off("notification:read", handleReadNotification);
        sharedSocket.off("notification:unreadCount", handleUnreadCount);
        sharedSocket.disconnect();
        sharedSocket = null;
        sharedUserId = null;
      }
    };
  }, [
    enabled,
    onNewNotification,
    onReadNotification,
    onUnreadCount,
    showToast,
    userId,
  ]);
}
