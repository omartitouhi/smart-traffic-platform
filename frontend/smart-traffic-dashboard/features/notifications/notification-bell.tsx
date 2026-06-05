"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Bell, Check, CheckCheck, ExternalLink, Inbox } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Skeleton } from "@/components/ui/loader";
import { notify } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/auth-provider";
import { MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION, MARK_NOTIFICATION_AS_READ_MUTATION } from "@/graphql/mutations/notification.mutations";
import { NOTIFICATIONS_QUERY, UNREAD_NOTIFICATION_COUNT_QUERY } from "@/graphql/queries/notification.queries";
import { cn } from "@/lib/utils";
import type {
  AppNotification,
  MarkNotificationReadInput,
  NotificationUserInput,
  NotificationsQueryInput,
} from "@/types/notification";
import { useNotificationSocket } from "./use-notification-socket";

type NotificationsResult = {
  notifications: AppNotification[];
};

type UnreadCountResult = {
  unreadNotificationCount: number;
};

type MarkReadResult = {
  markNotificationAsRead: AppNotification;
};

type MarkAllReadResult = {
  markAllNotificationsAsRead: AppNotification[];
};

function formatRelativeDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function NotificationBell({ className }: { className?: string }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const variables = useMemo(
    () => ({
      input: {
        take: 5,
        skip: 0,
      },
    }),
    [],
  );
  const countVariables = useMemo(
    () => ({
      input: {},
    }),
    [],
  );

  const {
    data,
    loading,
    error,
    refetch: refetchNotifications,
  } = useQuery<NotificationsResult, { input: NotificationsQueryInput }>(
    NOTIFICATIONS_QUERY,
    {
      skip: !user?.id,
      variables,
      fetchPolicy: "cache-and-network",
    },
  );
  const {
    data: countData,
    refetch: refetchUnreadCount,
  } = useQuery<UnreadCountResult, { input: NotificationUserInput }>(
    UNREAD_NOTIFICATION_COUNT_QUERY,
    {
      skip: !user?.id,
      variables: countVariables,
      fetchPolicy: "cache-and-network",
    },
  );
  const [markAsRead, { loading: isMarkingRead }] = useMutation<
    MarkReadResult,
    { input: MarkNotificationReadInput }
  >(MARK_NOTIFICATION_AS_READ_MUTATION);
  const [markAllAsRead, { loading: isMarkingAllRead }] = useMutation<
    MarkAllReadResult,
    { input: NotificationUserInput }
  >(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);

  const notifications = data?.notifications ?? [];
  const unreadCount = countData?.unreadNotificationCount ?? 0;

  const refreshNotifications = useCallback(async () => {
    await Promise.all([refetchNotifications(), refetchUnreadCount()]);
  }, [refetchNotifications, refetchUnreadCount]);

  useNotificationSocket({
    userId: user?.id,
    enabled: Boolean(user?.id),
    onNewNotification: () => {
      void refreshNotifications();
    },
    onReadNotification: () => {
      void refreshNotifications();
    },
    onUnreadCount: () => {
      void refetchUnreadCount();
    },
  });

  async function handleMarkAsRead(notification: AppNotification) {
    if (!user?.id || notification.isRead) return;

    try {
      await markAsRead({
        variables: {
          input: {
            id: notification.id,
          },
        },
      });
      await refreshNotifications();
    } catch (markError) {
      notify.error(
        markError instanceof Error
          ? markError.message
          : "Impossible de marquer la notification comme lue.",
      );
    }
  }

  async function handleMarkAllAsRead() {
    if (!user?.id || unreadCount === 0) return;

    try {
      await markAllAsRead({
        variables: {
          input: {},
        },
      });
      await refreshNotifications();
      notify.success("Toutes les notifications sont marquees comme lues.");
    } catch (markError) {
      notify.error(
        markError instanceof Error
          ? markError.message
          : "Impossible de marquer les notifications comme lues.",
      );
    }
  }

  if (!user) return null;

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="relative inline-grid size-10 place-items-center border border-border bg-white text-zinc-700 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
      >
        <Bell className="size-4" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center border border-zinc-950 bg-zinc-950 px-1 text-[10px] font-semibold leading-5 text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-[min(calc(100vw-2rem),24rem)] border border-border bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <p className="text-sm font-semibold text-zinc-950">
                Notifications
              </p>
              <p className="text-xs text-muted-foreground">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={unreadCount === 0}
              isLoading={isMarkingAllRead}
              icon={<CheckCheck className="size-4" aria-hidden="true" />}
              onClick={() => void handleMarkAllAsRead()}
            >
              Tout lire
            </Button>
          </div>

          <div className="max-h-[24rem] overflow-y-auto p-3">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : null}

            {error ? (
              <ErrorState
                title="Notifications indisponibles"
                message="Impossible de charger les notifications."
              />
            ) : null}

            {!loading && !error && notifications.length === 0 ? (
              <EmptyState
                icon={<Inbox className="size-5" aria-hidden="true" />}
                title="Aucune notification"
                message="Les alertes temps reel apparaitront ici."
              />
            ) : null}

            {!loading && !error && notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleMarkAsRead(notification)}
                    disabled={isMarkingRead || notification.isRead}
                    className={cn(
                      "w-full border p-3 text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950",
                      notification.isRead
                        ? "border-border bg-white"
                        : "border-zinc-300 bg-zinc-50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-950">
                          {notification.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead ? (
                        <Check className="size-4 shrink-0 text-zinc-700" aria-hidden="true" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11px] font-medium uppercase text-muted-foreground">
                      {formatRelativeDate(notification.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 border-t border-border px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
          >
            Voir toutes
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
