"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  Bell,
  Check,
  CheckCheck,
  Inbox,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { TableSkeleton } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { notify } from "@/components/ui/toast";
import { useAuth } from "@/features/auth/auth-provider";
import {
  DELETE_NOTIFICATION_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  MARK_NOTIFICATION_AS_READ_MUTATION,
} from "@/graphql/mutations/notification.mutations";
import {
  NOTIFICATIONS_QUERY,
  UNREAD_NOTIFICATION_COUNT_QUERY,
} from "@/graphql/queries/notification.queries";
import type {
  AppNotification,
  DeleteNotificationInput,
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

type DeleteNotificationResult = {
  deleteNotification: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function notificationTone(type: string) {
  if (["SUCCESS"].includes(type)) return "success" as const;
  if (["WARNING", "TRAFFIC_ALERT", "INCIDENT_ALERT"].includes(type)) {
    return "warning" as const;
  }
  if (type === "ERROR") return "danger" as const;
  return "default" as const;
}

export function NotificationsPage() {
  const { user } = useAuth();
  const [notificationToDelete, setNotificationToDelete] =
    useState<AppNotification | null>(null);
  const variables = useMemo(
    () => ({
      input: {
        userId: user?.id ?? "",
        take: 100,
        skip: 0,
      },
    }),
    [user?.id],
  );
  const countVariables = useMemo(
    () => ({
      input: {
        userId: user?.id ?? "",
      },
    }),
    [user?.id],
  );

  const { data, loading, error, refetch } = useQuery<
    NotificationsResult,
    { input: NotificationsQueryInput }
  >(NOTIFICATIONS_QUERY, {
    skip: !user?.id,
    variables,
    fetchPolicy: "cache-and-network",
  });
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
  const [deleteNotification, { loading: isDeleting }] = useMutation<
    DeleteNotificationResult,
    { input: DeleteNotificationInput }
  >(DELETE_NOTIFICATION_MUTATION);

  const notifications = data?.notifications ?? [];
  const unreadCount = countData?.unreadNotificationCount ?? 0;

  const refresh = useCallback(async () => {
    await Promise.all([refetch(), refetchUnreadCount()]);
  }, [refetch, refetchUnreadCount]);

  useNotificationSocket({
    userId: user?.id,
    enabled: Boolean(user?.id),
    showToast: false,
    onNewNotification: () => {
      void refresh();
    },
    onReadNotification: () => {
      void refresh();
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
            userId: user.id,
          },
        },
      });
      await refresh();
      notify.success("Notification marquee comme lue.");
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
          input: {
            userId: user.id,
          },
        },
      });
      await refresh();
      notify.success("Toutes les notifications sont marquees comme lues.");
    } catch (markError) {
      notify.error(
        markError instanceof Error
          ? markError.message
          : "Impossible de marquer les notifications comme lues.",
      );
    }
  }

  async function confirmDelete() {
    if (!user?.id || !notificationToDelete) return;

    try {
      await deleteNotification({
        variables: {
          input: {
            id: notificationToDelete.id,
            userId: user.id,
          },
        },
      });
      setNotificationToDelete(null);
      await refresh();
      notify.success("Notification supprimee.");
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer la notification.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Notification Center
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Notifications
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Consultez les alertes et messages recus en temps reel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            icon={<RefreshCw className="size-4" aria-hidden="true" />}
            onClick={() => void refresh()}
          >
            Actualiser
          </Button>
          <Button
            type="button"
            disabled={unreadCount === 0}
            isLoading={isMarkingAllRead}
            icon={<CheckCheck className="size-4" aria-hidden="true" />}
            onClick={() => void handleMarkAllAsRead()}
          >
            Tout marquer lu
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Total
          </p>
          <p className="mt-3 text-3xl font-semibold">{notifications.length}</p>
        </div>
        <div className="border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Non lues
          </p>
          <p className="mt-3 text-3xl font-semibold">{unreadCount}</p>
        </div>
        <div className="border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Temps reel
          </p>
          <p className="mt-3 text-sm font-medium text-zinc-950">
            WebSocket actif quand la session est connectee.
          </p>
        </div>
      </div>

      {loading ? <TableSkeleton rows={6} /> : null}

      {error ? (
        <ErrorState
          title="Notifications indisponibles"
          message="Impossible de charger les notifications depuis l API Gateway GraphQL."
          action={
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => void refresh()}
            >
              Reessayer
            </Button>
          }
        />
      ) : null}

      {!loading && !error && notifications.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" aria-hidden="true" />}
          title="Aucune notification"
          message="Les notifications creees par la plateforme apparaitront ici."
        />
      ) : null}

      {!loading && !error && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`border bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-colors ${
                notification.isRead ? "border-border" : "border-zinc-400"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="grid size-9 place-items-center border border-border bg-zinc-50 text-zinc-800">
                      <Bell className="size-4" aria-hidden="true" />
                    </div>
                    <Badge tone={notificationTone(notification.type)}>
                      {notification.type}
                    </Badge>
                    <Badge tone={notification.isRead ? "default" : "success"}>
                      {notification.isRead ? "Lue" : "Non lue"}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-950">
                    {notification.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={notification.isRead}
                    isLoading={isMarkingRead}
                    icon={<Check className="size-4" aria-hidden="true" />}
                    onClick={() => void handleMarkAsRead(notification)}
                  >
                    Marquer lue
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="size-4" aria-hidden="true" />}
                    onClick={() => setNotificationToDelete(notification)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Modal
        open={Boolean(notificationToDelete)}
        title="Supprimer la notification"
        description={`Cette action supprimera ${notificationToDelete?.title ?? "cette notification"}.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => setNotificationToDelete(null)}
      />
    </section>
  );
}
