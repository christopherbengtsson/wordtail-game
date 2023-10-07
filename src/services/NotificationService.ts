import { supabaseClientInstance } from '.';

export class NotificationService {
  constructor() {}

  // Fetch all notifications for the current user
  async fetchNotifications() {
    const { data, error } = await supabaseClientInstance
      .from('notifications')
      .select('*');
    if (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error(error.message);
    }
    return data;
  }

  // Update the status of a notification
  async updateNotificationStatus(
    notificationId: string,
    seen: boolean,
  ): Promise<void> {
    const { error } = await supabaseClientInstance
      .from('notifications')
      .update({ seen })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to update notification status:', error);
      throw new Error(error.message);
    }
  }
}
