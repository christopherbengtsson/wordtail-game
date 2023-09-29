import { makeAutoObservable } from 'mobx';
import { NotificationService } from '../services';

export class Notification {
  id: string;
  message: string;
  seen: boolean;
  createdAt: Date;

  constructor(id: string, message: string, seen: boolean, createdAt: Date) {
    this.id = id;
    this.message = message;
    this.seen = seen;
    this.createdAt = createdAt;
  }
}

export class NotificationStore {
  notifications: Notification[] = [];
  service: NotificationService;

  constructor(service: NotificationService) {
    makeAutoObservable(this);
    this.service = service;
  }

  async fetchNotifications() {
    try {
      const fetchedNotifications = await this.service.fetchNotifications();
      this.notifications = fetchedNotifications.map(
        (notif) =>
          new Notification(
            notif.id,
            notif.message,
            notif.seen,
            new Date(notif.createdAt),
          ),
      );
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  markAsSeen(notificationId: string) {
    const notification = this.notifications.find(
      (notif) => notif.id === notificationId,
    );
    if (notification) {
      notification.seen = true;
      this.service.updateNotificationStatus(notificationId, true);
    }
  }
}
