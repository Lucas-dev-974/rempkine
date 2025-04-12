import { createSignal } from "solid-js";

export type NotificationType = {
  id: number;
  content: string;
  type: "error" | "info";
};

export const [notifications, setNotifications] = createSignal<
  NotificationType[]
>([]);

export class NotificationService {
  static push(notifi: Partial<NotificationType>) {
    const ids = notifications().map((noti) => noti.id);
    const lastId = ids[ids.length - 1] || 0;
    let newId = lastId + 1;

    while (ids.includes(newId)) {
      newId = newId + 1;
    }

    setNotifications((prev) => {
      if (!prev) return prev;

      const newnotif = [
        ...prev,
        {
          id: newId as number,
          ...(notifi as Pick<NotificationType, "content" | "type">),
        } as NotificationType,
      ];

      return newnotif;
    });
  }
}
