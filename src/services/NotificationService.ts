import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseClientInstance } from '.';

export interface NotificationData {
  id: string;
  message: string;
  seen: boolean;
  createdAt: string;
}

export class NotificationService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabaseClientInstance;
  }

  // Fetch all notifications for the current user
  async fetchNotifications(): Promise<NotificationData[]> {
    const { data, error } = await this.client.from('notifications').select('*');
    if (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error(error.message);
    }
    return data!;
  }

  // Update the status of a notification
  async updateNotificationStatus(
    notificationId: string,
    seen: boolean,
  ): Promise<void> {
    const { error } = await this.client
      .from('notifications')
      .update({ seen })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to update notification status:', error);
      throw new Error(error.message);
    }
  }
}
