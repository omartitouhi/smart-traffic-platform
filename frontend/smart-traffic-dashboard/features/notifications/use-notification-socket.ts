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

function isForCurrentUser(
  notificationUserId: string | null | undefined,
  userId: string,
) {
  return !notificationUserId || notificationUserId === userId;
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

    const accessToken = getAccessToken();
    const socket: Socket<never, NotificationSocketEvents> = io(
      NOTIFICATION_WS_URL,
      {
        auth: accessToken ? { token: accessToken } : undefined,
        transports: ["websocket", "polling"],
      },
    );

    socket.on("notification:new", (notification) => {
      if (!isForCurrentUser(notification.userId, userId)) return;
      if (showToast) {
        notify.info(notification.title);
      }
      onNewNotification?.(notification);
    });

    socket.on("notification:read", (notification) => {
      if (!isForCurrentUser(notification.userId, userId)) return;
      onReadNotification?.(notification);
    });

    socket.on("notification:unreadCount", (payload) => {
      if (!isForCurrentUser(payload.userId, userId)) return;
      onUnreadCount?.(payload.count);
    });

    return () => {
      socket.disconnect();
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
